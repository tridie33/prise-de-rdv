const nock = require("nock");
const config = require("../../../config");
const { sampleEtablissement, sampleFormation } = require("../../data/mnaCatalogSamples");

// Todo refacto query

module.exports = async () => {
  nock(config.mnaCatalog.endpoint)
    .persist()
    .get("/etablissement?query=%7B%22uai%22:%220751475W%22%7D")
    .reply(200, {
      result: { data: sampleEtablissement },
    });

  nock(config.mnaCatalog.endpoint)
    .persist()
    .get("/formation?query=%7B%22educ_nat_code%22:%2245025516%22%7D")
    .reply(200, {
      result: { data: sampleFormation },
    });
};
