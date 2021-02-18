const { runScript } = require("../scriptWrapper");
const logger = require("../../common/logger");
const { clearAppointments } = require("./utils/clearUtils");

runScript(async () => {
  logger.info("Suppression de tous les appointments ....");
  await clearAppointments();
  logger.info("Appointments supprimés avec succès !");
});
