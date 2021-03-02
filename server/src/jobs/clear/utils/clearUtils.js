const logger = require("../../../common/logger");
const { User, Log, UserEvent, Appointment, WidgetParameter } = require("../../../common/model");
const { candidat, cfa } = require("../../../common/roles");

const clearAll = async () => {
  logger.info("Suppression totale (hors logs) en cours");

  await User.deleteMany({});
  logger.info(`Users supprimés`);

  await UserEvent.deleteMany({});
  logger.info(`UsersEvents supprimés`);

  await Appointment.deleteMany({});
  logger.info(`Appointments supprimés`);

  await WidgetParameter.deleteMany({});
  logger.info(`WidgetParameters supprimés`);
};

const clearUsers = async () => {
  logger.info("Suppression des Users et UsersEvent en cours");

  await User.deleteMany({});
  logger.info(`Users supprimés`);

  await UserEvent.deleteMany({});
  logger.info(`UserEvents supprimés`);
};

const clearCandidats = async () => {
  logger.info("Suppression des Users candidats en cours");

  await User.deleteMany({ role: candidat });
  logger.info(`Users candidats supprimés`);
};

const clearCfas = async () => {
  logger.info("Suppression des Users cfas en cours");

  await User.deleteMany({ role: cfa });
  logger.info(`Users cfas supprimés`);
};

const clearAppointments = async () => {
  logger.info("Suppression des Appointments en cours");

  await Appointment.deleteMany({});
  logger.info(`Appointments supprimés`);
};

const clearWidgetParameters = async () => {
  logger.info("Suppression des WidgetParameters en cours");

  await WidgetParameter.deleteMany({});
  logger.info(`WidgetParameters supprimés`);
};

const clearLogsAndEvents = async () => {
  logger.info("Suppression en cours");

  await Log.deleteMany({});
  logger.info(`Logs supprimés`);

  await UserEvent.deleteMany({});
  logger.info(`UserEvents supprimés`);
};

module.exports = {
  clearAll,
  clearUsers,
  clearCandidats,
  clearCfas,
  clearLogsAndEvents,
  clearAppointments,
  clearWidgetParameters,
};
