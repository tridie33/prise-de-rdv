const { connectToMongo } = require("../mongodb");
const createUsers = require("./users");
const createAppointement = require("./appointments");
const createMailer = require("../../common/mailer");
const config = require("../../../config/index");

//Commun à l'API Express et les jobs
module.exports = async (options = {}) => {
  const users = options.users || (await createUsers());
  const appointments = options.appointments || (await createAppointement());
  const smtpConfig = config.env === "local" ? config.local_smtp : config.smtp;
  return {
    users,
    appointments,
    db: options.db || (await connectToMongo()).db,
    mailer: options.mailer || createMailer({ smtp: { ...smtpConfig, secure: false } }),
  };
};
