const env = require("env-var");

module.exports = {
  appName: env.get("PRISE_DE_RDV_NAME").default("Prise de rdv").asString(),
  env: env.get("PRISE_DE_RDV_ENV").required().asString(),
  publicUrl: env.get("PRISE_DE_RDV_PUBLIC_URL").required().asString(),
  mongodb: {
    uri: env.get("PRISE_DE_RDV_MONGODB_URI").required().asString(),
  },
  apiKey: env.get("PRISE_DE_RDV_API_KEY").required().asString(),
  mnaCatalog: {
    endpoint: env.get("PRISE_DE_RDV_MNA_CATALOG_ENDPOINT").required().asString(),
    apiToken: env.get("PRISE_DE_RDV_MNA_API_TOKEN").required().asString(),
  },
  auth: {
    passwordHashRounds: env.get("PRISE_DE_RDV_AUTH_PASSWORD_HASH_ROUNDS").asInt(),
    user: {
      jwtSecret: env.get("PRISE_DE_RDV_AUTH_USER_JWT_SECRET").required().asString(),
      expiresIn: env.get("PRISE_DE_RDV_AUTH_USER_JWT_SECRET_EXPIRES").default("24h").asString(),
    },
    activation: {
      jwtSecret: env.get("PRISE_DE_RDV_AUTH_ACTIVATION_JWT_SECRET").required().asString(),
      expiresIn: env.get("PRISE_DE_RDV_AUTH_ACTIVATION_JWT_SECRET_EXPIRES").default("96h").asString(),
    },
    password: {
      jwtSecret: env.get("PRISE_DE_RDV_AUTH_PASSWORD_JWT_SECRET").required().asString(),
      expiresIn: env.get("PRISE_DE_RDV_AUTH_PASSWORD_JWT_SECRET_EXPIRES").default("1h").asString(),
    },
  },
  log: {
    type: env.get("PRISE_DE_RDV_LOG_TYPE").default("console").asString(),
    level: env.get("PRISE_DE_RDV_LOG_LEVEL").default("info").asString(),
  },
  slackWebhookUrl: env.get("PRISE_DE_RDV_SLACK_WEBHOOK_URL").asString(),
  outputDir: env.get("PRISE_DE_RDV_OUTPUT_DIR").required().asString(),
  users: {
    defaultAdmin: {
      name: env.get("PRISE_DE_RDV_USERS_DEFAULT_ADMIN_NAME").required().asString(),
      password: env.get("PRISE_DE_RDV_USERS_DEFAULT_ADMIN_PASSWORD").required().asString(),
      role: env.get("PRISE_DE_RDV_USERS_DEFAULT_ADMIN_ROLE").required().asString(),
    },
  },
  smtp: {
    host: env.get("PRISE_DE_RDV_SMTP_HOST").required().asString(),
    port: env.get("PRISE_DE_RDV_SMTP_PORT").required().asString(),
    auth: {
      user: env.get("PRISE_DE_RDV_SMTP_AUTH_USER").required().asString(),
      pass: env.get("PRISE_DE_RDV_SMTP_AUTH_PASS").required().asString(),
    },
  },
};
