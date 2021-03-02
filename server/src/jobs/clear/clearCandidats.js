const { runScript } = require("../scriptWrapper");
const logger = require("../../common/logger");
const { clearCandidats } = require("./utils/clearUtils");

runScript(async () => {
  logger.info("Suppression de tous les users candidats ....");
  await clearCandidats();
  logger.info("Users candidats supprimés avec succès !");
});
