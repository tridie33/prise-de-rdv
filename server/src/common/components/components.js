const { connectToMongo } = require("../mongodb");
const { cache } = require("../redis");
const createUsers = require("./users");
const createWidgetParameters = require("./widgetParameters");
const createAppointements = require("./appointments");
const createEtablissements = require("./etablissement");
const createMailer = require("../../common/mailer");
const config = require("../../../config");

// Commun à l'API Express et les jobs
module.exports = async (options = {}) => {
  const users = options.users || (await createUsers());
  const appointments = options.appointments || (await createAppointements());
  const widgetParameters = options.widgetParameters || (await createWidgetParameters());
  const etablissements = options.etablissements || (await createEtablissements());

  return {
    users,
    appointments,
    widgetParameters,
    etablissements,
    db: options.db || (await connectToMongo()).db,
    cache,
    mailer: options.mailer || createMailer({ smtp: { ...config.smtp, secure: false } }),
  };
};
