const express = require("express");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const config = require("../../config");
const logger = require("../common/logger");
const { getSentry } = require("../common/sentry");
const logMiddleware = require("./middlewares/logMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");
const tryCatch = require("./middlewares/tryCatchMiddleware");
const apiKeyAuthMiddleware = require("./middlewares/apiKeyAuthMiddleware");
const corsMiddleware = require("./middlewares/corsMiddleware");
const authMiddleware = require("./middlewares/authMiddleware");
const permissionsMiddleware = require("./middlewares/permissionsMiddleware");
const packageJson = require("../../package.json");
const secured = require("./routes/auth/secured");
const login = require("./routes/auth/login");
const authentified = require("./routes/auth/authentified");
const admin = require("./routes/admin/admin");
const appointmentRoute = require("./routes/admin/appointment");
const adminEtablissementRoute = require("./routes/admin/etablissement");
const etablissementRoute = require("./routes/public/etablissement");
const appointmentRequestRoute = require("./routes/public/appointmentRequest");
const catalogueRoute = require("./routes/public/catalogue");
const password = require("./routes/auth/password");
const configRoute = require("./routes/auth/config");
const widgetParameterRoute = require("./routes/admin/widgetParameter");
const partnersRoute = require("./routes/public/partners");
const emailsRoute = require("./routes/auth/emails");
const constantsRoute = require("./routes/public/constants");
const supportRoute = require("./routes/public/support");
const { administrator } = require("./../common/roles");
const { syncEtablissementsAndFormations } = require("../cron/syncEtablissementsAndFormations");
const { activateOptOutEtablissementFormations } = require("../cron/activateOptOutEtablissementFormations");
// const { candidatHaveYouBeenContacted } = require("../cron/candidatHaveYouBeenContacted");
const { inviteEtablissementToOptOut } = require("../cron/inviteEtablissementToOptOut");
const { inviteEtablissementToPremium } = require("../cron/inviteEtablissementToPremium");
const { inviteEtablissementToPremiumFollowUp } = require("../cron/inviteEtablissementToPremiumFollowUp");

/**
 * @description Express function that embed components in routes.
 * @param {Object} components
 * @returns {Promise<*|Express>}
 */
module.exports = async (components) => {
  const { db, etablissements, widgetParameters, mailer } = components;
  const app = express();
  const checkJwtToken = authMiddleware(components);
  const adminOnly = permissionsMiddleware(administrator);
  const sentry = getSentry(app);

  app.use(bodyParser.json());
  app.use(corsMiddleware());
  app.use(logMiddleware());
  app.use(sentry.Handlers.requestHandler());
  app.use(sentry.Handlers.tracingHandler());

  // Auth routes
  app.use("/api/login", login(components));
  app.use("/api/password", password(components));
  app.use("/api/authentified", checkJwtToken, authentified());
  app.use("/api/secured", apiKeyAuthMiddleware, secured());
  app.use("/api/admin", checkJwtToken, adminOnly, admin());

  // Logic route
  app.use("/api/appointment", checkJwtToken, adminOnly, appointmentRoute(components));
  app.use("/api/admin/etablissements", checkJwtToken, adminOnly, adminEtablissementRoute(components));
  app.use("/api/etablissements", etablissementRoute(components));
  app.use("/api/appointment-request", appointmentRequestRoute(components));
  app.use("/api/catalogue", catalogueRoute(components));
  app.use("/api/constants", constantsRoute(components));
  app.use("/api/widget-parameters", checkJwtToken, adminOnly, widgetParameterRoute(components));
  app.use("/api/partners", partnersRoute(components));
  app.use("/api/emails", emailsRoute(components));
  app.use("/api/support", supportRoute(components));

  // Config route
  app.use("/api/config", checkJwtToken, adminOnly, configRoute());

  app.get(
    "/api",
    tryCatch(async (req, res) => {
      let mongodbStatus;
      logger.info("/api called");
      await db
        .collection("user")
        .stats()
        .then(() => {
          mongodbStatus = true;
        })
        .catch((e) => {
          mongodbStatus = false;
          logger.error("Healthcheck failed", e);
        });

      return res.json({
        name: `Serveur express MNA - ${config.appName}`,
        version: packageJson.version,
        env: config.env,
        healthcheck: {
          mongodb: mongodbStatus,
        },
      });
    })
  );

  app.use(sentry.Handlers.errorHandler());
  app.use(errorMiddleware());

  // Everyday at 14:00: Opt-out invite
  cron.schedule("0 14 * * *", () => inviteEtablissementToOptOut({ mailer, widgetParameters, etablissements }));

  // Everyday at 05:00 AM: Copy catalogue formations
  cron.schedule("0 5 * * *", () => syncEtablissementsAndFormations({ etablissements, widgetParameters }));

  // Everyday, every 5 minutes: Opt-out activation
  cron.schedule("*/5 * * * *", () =>
    activateOptOutEtablissementFormations({ etablissements, widgetParameters, mailer })
  );

  // // Everyday, every minutes: Send an email to candidats to know if they were contacted by the CFA
  // cron.schedule("* * * * *", () =>
  //   candidatHaveYouBeenContacted({ mailer, appointments, widgetParameters, users, etablissements })
  // );

  // Every hours: Invite to Premium mode
  cron.schedule("0 * * * *", () => inviteEtablissementToPremium({ mailer, widgetParameters, etablissements }));

  // Every hours: Invite to Premium mode (follow up)
  cron.schedule("0 * * * *", () => inviteEtablissementToPremiumFollowUp({ mailer, etablissements }));

  return app;
};
