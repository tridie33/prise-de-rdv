const express = require("express");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const config = require("../../config/index");
const logger = require("../common/logger");
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
const { administrator } = require("./../common/roles");
const { syncEtablissementsAndFormations } = require("../cron/syncEtablissementsAndFormations");
const { activateOptOutEtablissementFormations } = require("../cron/activateOptOutEtablissementFormations");
const { candidatHaveYouBeenContacted } = require("../cron/candidatHaveYouBeenContacted");

/**
 * @description Express function that embed components in routes.
 * @param {Object} components
 * @returns {Promise<*|Express>}
 */
module.exports = async (components) => {
  const { db, etablissements, widgetParameters, mailer, appointments, users } = components;
  const app = express();
  const checkJwtToken = authMiddleware(components);
  const adminOnly = permissionsMiddleware(administrator);

  app.use(bodyParser.json());
  app.use(corsMiddleware());
  app.use(logMiddleware());

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

  app.use(errorMiddleware());

  // Everyday at 05:00 AM
  cron.schedule("0 5 * * *", () => syncEtablissementsAndFormations({ etablissements, widgetParameters }));

  // Everyday, every 5 minutes
  cron.schedule("*/5 * * * *", () =>
    activateOptOutEtablissementFormations({ etablissements, widgetParameters, mailer })
  );

  // Everyday, every 5 minutes
  cron.schedule("* * * * *", () =>
    candidatHaveYouBeenContacted({ mailer, appointments, widgetParameters, users, etablissements })
  );

  return app;
};
