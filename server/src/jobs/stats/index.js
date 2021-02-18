const logger = require("../../common/logger");
const { runScript } = require("../scriptWrapper");
const { Appointment } = require("../../common/model");

runScript(async ({ db }) => {
  const nbAppointments = await Appointment.countDocuments({});
  logger.info(`Db ${db.name} - Appointment count : ${nbAppointments}`);
});
