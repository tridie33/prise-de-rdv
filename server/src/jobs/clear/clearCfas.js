const { runScript } = require("../scriptWrapper");
const logger = require("../../common/logger");
const { clearCfas } = require("./utils/clearUtils");

runScript(async () => {
  logger.info("Suppression de tous les users cfas ....");
  await clearCfas();
  logger.info("Users cfas supprimés avec succès !");
});
