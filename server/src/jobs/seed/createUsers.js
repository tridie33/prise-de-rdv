const logger = require("../../common/logger");

module.exports = async (users) => {
  await users.createUser("testUser", "password", {
    firstname: "firstname",
    lastname: "lastname",
    phone: "0102030405",
    email: "h@ack.me",
    role: "candiat",
  });
  await users.createUser("testAdmin", "password", {
    permissions: { isAdmin: true },
    firstname: "admin",
    lastname: "admin",
    phone: "0102030405",
    email: "h@ack.me",
    role: "mna",
  });
  //logger.info(`User 'testUser' with password 'password' is successfully created `);
  logger.info(`User 'testAdmin' with password 'password' and admin is successfully created `);
};
