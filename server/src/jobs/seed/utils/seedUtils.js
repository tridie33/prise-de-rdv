const logger = require("../../../common/logger");
const config = require("../../../../config");
const { User } = require("../../../common/model/index");
const { asyncForEach } = require("../../../common/utils/asyncUtils");

const seedUsers = async (usersModule) => {
  const users = Object.values(config.users);
  await asyncForEach(users, async (user) => {
    if ((await User.countDocuments({ username: user.name })) !== 0) {
      logger.info(`User ${user.name} already exists - no creation needed`);
    } else {
      logger.info(`Creating user ${user.name}`);
      try {
        await usersModule.createUser(user.name, user.password, {
          role: user.role,
          apiKey: user.apiKey,
        });
      } catch (err) {
        logger.error(err);
        logger.error(`Failed to create user ${user.name}`);
      }
    }
  });
};

module.exports = {
  seedUsers,
};
