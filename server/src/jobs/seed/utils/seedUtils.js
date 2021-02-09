const logger = require("../../../common/logger");
const config = require("../../../../config");
const { User } = require("../../../common/model/index");
const { asyncForEach } = require("../../../common/utils/asyncUtils");
const {
  createRandomCandidatsList,
  createRandomAppointmentsList,
  createRandomWidgetParametersList,
} = require("../../../../tests/data/randomizeSample");

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

const seedRandomAppointments = async (appointments, nbRandomItems) => {
  const randomAppointments = createRandomAppointmentsList(nbRandomItems);
  await asyncForEach(randomAppointments, async (randomAppointmentToAdd) => {
    await appointments.createAppointment(randomAppointmentToAdd);
  });
};

const seedRandomCandidats = async (users, nbRandomItems) => {
  const randomAppointments = createRandomCandidatsList(nbRandomItems);
  await asyncForEach(randomAppointments, async (randomCandidatToAdd) => {
    await users.createUser(randomCandidatToAdd.username, randomCandidatToAdd.password, {
      firstname: randomCandidatToAdd.firstname,
      lastname: randomCandidatToAdd.lastname,
      phone: randomCandidatToAdd.phone,
      email: randomCandidatToAdd.email,
      role: randomCandidatToAdd.role,
    });
  });
};

const seedRandomWidgetParameters = async (widgetParameters, nbRandomItems) => {
  const randomWidgetParameters = createRandomWidgetParametersList(nbRandomItems);
  await asyncForEach(randomWidgetParameters, async (randomWidgetParameterToAdd) => {
    await widgetParameters.createParameter({
      etablissement_siret: randomWidgetParameterToAdd.etablissement_siret,
      etablissement_raison_sociale: randomWidgetParameterToAdd.etablissement_raison_sociale,
      formation_intitule: randomWidgetParameterToAdd.formation_intitule,
      formation_cfd: randomWidgetParameterToAdd.formation_cfd,
      email_rdv: randomWidgetParameterToAdd.email_rdv,
      referrers: randomWidgetParameterToAdd.referrers,
    });
  });
};

module.exports = {
  seedUsers,
  seedRandomAppointments,
  seedRandomCandidats,
  seedRandomWidgetParameters,
};
