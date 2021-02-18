const { runScript } = require("../scriptWrapper");
const logger = require("../../common/logger");
const { seedRandomCandidats } = require("./utils/seedUtils");

runScript(async ({ users }) => {
  logger.info("-> Seed Random Candidats ...");
  await seedRandomCandidats(users, 10);
  logger.info("-> All random Candidats are successfully created !");
});
