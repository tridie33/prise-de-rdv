const { connectToMongo } = require("../mongodb");
const createUsers = require("./users");
const createRequests = require("./requests");

//commun express et jobs
module.exports = async (options = {}) => {
  const users = options.users || (await createUsers());
  const requests = options.requests || (await createRequests());

  return {
    users,
    requests,
    db: options.db || (await connectToMongo()).db,
  };
};
