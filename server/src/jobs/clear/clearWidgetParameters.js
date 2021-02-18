const { runScript } = require("../scriptWrapper");
const logger = require("../../common/logger");
const { clearWidgetParameters } = require("./utils/clearUtils");

runScript(async () => {
  logger.info("Suppression de tous les WidgetParameters ....");
  await clearWidgetParameters();
  logger.info("WidgetParameters supprimés avec succès !");
});
