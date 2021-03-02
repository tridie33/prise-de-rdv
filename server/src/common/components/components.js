const { connectToMongo } = require("../mongodb");
const createUsers = require("./users");
const createWidgetParameters = require("./widgetParameters");
const createAppointement = require("./appointments");
const createMailer = require("../../common/mailer");
const config = require("../../../config");

// Commun à l'API Express et les jobs
module.exports = async (options = {}) => {
  const users = options.users || (await createUsers());
  const appointments = options.appointments || (await createAppointement());
  const widgetParameters = options.widgetParameters || (await createWidgetParameters());

  return {
    users,
    appointments,
    db: options.db || (await connectToMongo()).db,
    mailer: options.mailer || createMailer({ smtp: { ...config.smtp, secure: false } }),
    widgetParameters,
  };
};
