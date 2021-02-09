const { runScript } = require("../scriptWrapper");
const logger = require("../../common/logger");
const { seedRandomAppointments } = require("./utils/seedUtils");

runScript(async ({ appointments }) => {
  logger.info("-> Seed Random Appointments ...");
  await seedRandomAppointments(appointments, 10);
  logger.info("-> All random appointments are successfully created !");
});
