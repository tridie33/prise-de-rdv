const { runScript } = require("../scriptWrapper");
const { clearAll } = require("./utils/clearUtils");
const logger = require("../../common/logger");

runScript(async () => {
  logger.info("Suppression de toutes les données ");
  await clearAll();
  logger.info("Toutes les données supprimées avec succès !");
});
