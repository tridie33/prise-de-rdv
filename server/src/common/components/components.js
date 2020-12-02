const { connectToMongo } = require("../mongodb");
const createUsers = require("./users");
const createMailer = require("../../common/mailer");
const config = require("config");

//Commun à l'API Express et les jobs
module.exports = async (options = {}) => {
  const users = options.users || (await createUsers());
  return {
    users,
    db: options.db || (await connectToMongo()).db,
    mailer: options.mailer || createMailer({ smtp: { ...config.local_smtp, secure: false } }),
  };
};
