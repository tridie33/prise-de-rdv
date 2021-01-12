const express = require("express");
const config = require("../../config/index");
const logger = require("../common/logger");
const bodyParser = require("body-parser");
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
const requestRoute = require("./routes/admin/request");
const password = require("./routes/auth/password");
const configRoute = require("./routes/auth/config");
const stats = require("./routes/admin/stats");
const appointment = require("./routes/public/appointment");
const { administrator } = require("./../common/roles");

module.exports = async (components) => {
  const { db } = components;
  const app = express();
  const checkJwtToken = authMiddleware(components);
  const adminOnly = permissionsMiddleware(administrator);

  app.use(bodyParser.json());
  app.use(corsMiddleware());
  app.use(logMiddleware());

  app.use("/api/appointment", appointment(components));
  app.use("/api/stats", checkJwtToken, adminOnly, stats(components));

  app.use("/api/login", login(components));
  app.use("/api/password", password(components));

  app.use("/api/authentified", checkJwtToken, authentified());
  app.use("/api/secured", apiKeyAuthMiddleware, secured());
  app.use("/api/admin", checkJwtToken, adminOnly, admin());
  app.use("/api/request", checkJwtToken, adminOnly, requestRoute());

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

  return app;
};
