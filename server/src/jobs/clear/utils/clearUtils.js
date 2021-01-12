const logger = require("../../../common/logger");
const { User, Log, UserEvent } = require("../../../common/model");

const clearAll = async () => {
  logger.info("Suppression en cours");

  await User.deleteMany({});
  logger.info(`Users supprimés`);
};

const clearUsers = async () => {
  logger.info("Suppression en cours");

  await User.deleteMany({});
  logger.info(`Users supprimés`);

  await UserEvent.deleteMany({});
  logger.info(`UserEvents supprimés`);
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
  clearLogsAndEvents,
};