const nock = require("nock");
const config = require("../../../config");
const { sampleResponseSiretCfd } = require("../../data/mnaCatalogSamples");

module.exports = async () => {
  nock(config.mnaCatalog.endpoint)
    .persist()
    .get(
      "/v1/entity/formations2021?query=%7B%22$and%22:[%7B%22etablissement_formateur_siret%22:%2232922456200234%22%7D,%7B%22cfd%22:%2226033206%22%7D]%7D&page=1&limit=500"
    )
    .reply(200, sampleResponseSiretCfd);

  nock(config.mnaCatalog.endpoint)
    .persist()
    .get("/v1/entity/formations2021?query=%7B%7D&page=1&limit=50")
    .reply(200, sampleResponseSiretCfd);
};
