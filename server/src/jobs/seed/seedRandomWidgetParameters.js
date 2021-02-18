const { runScript } = require("../scriptWrapper");
const logger = require("../../common/logger");
const { seedRandomWidgetParameters } = require("./utils/seedUtils");

runScript(async ({ widgetParameters }) => {
  logger.info("-> Seed Random WidgetParameters ...");
  await seedRandomWidgetParameters(widgetParameters, 10);
  logger.info("-> All random WidgetParameters are successfully created !");
});
