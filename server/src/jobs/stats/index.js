const logger = require("../../common/logger");
const { runScript } = require("../scriptWrapper");
const { Request } = require("../../common/model");

runScript(async ({ db }) => {
  const nbRequests = await Request.countDocuments({});
  logger.info(`Db ${db.name} - Requests count : ${nbRequests}`);
});
