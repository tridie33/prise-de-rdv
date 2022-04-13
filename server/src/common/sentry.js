const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const config = require("../../config");

/**
 * @description Initialize Sentry client.
 * @param app Express application
 * @return {Sentry}
 */
const getSentry = (app) => {
  Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.env,
    enabled: ["production", "recette"].includes(config.env),
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.3,
  });

  return Sentry;
};

module.exports = {
  getSentry,
};
