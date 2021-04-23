const nock = require("nock");
const config = require("../../../config");
const { sampleResponseSiretCfd } = require("../../data/mnaCatalogSamples");

module.exports = async () => {
  nock(config.mnaCatalog.endpoint)
    .persist()
    .get(
      "/v1/entity/formations2021?query=%7B%22$and%22:[%7B%22id_rco_formation%22:%2215_554095%7C15_1117617%7C106339%22%7D,%7B%22published%22:true%7D,%7B%22etablissement_reference_catalogue_published%22:true%7D]%7D&page=1&limit=500"
    )
    .reply(200, sampleResponseSiretCfd);

  nock(config.mnaCatalog.endpoint)
    .persist()
    .get("/v1/entity/formations2021?query=%7B%7D&page=1&limit=50")
    .reply(200, sampleResponseSiretCfd);
};
