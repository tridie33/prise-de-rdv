const nockCatalog = require("./nock-MnaCatalog");

const nockApis = async () => {
  await nockCatalog();
};

module.exports = { nockApis };
