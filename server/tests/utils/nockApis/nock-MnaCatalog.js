const nock = require("nock");
const config = require("../../../config");
const { sampleCatalogueResponse } = require("../../data/mnaCatalogSamples");

module.exports = async () => {
  nock(config.mnaCatalog.endpoint)
    .persist()
    .get(
      "/v1/entity/formations2021?query=%7B%22$and%22:[%7B%22id_rco_formation%22:%2214_AF_0000091719%7C14_SE_0000494236%7C18894%22%7D,%7B%22published%22:true%7D,%7B%22etablissement_reference_catalogue_published%22:true%7D]%7D&page=1&limit=500"
    )
    .reply(200, sampleCatalogueResponse);

  nock(config.mnaCatalog.endpoint)
    .persist()
    .get("/v1/entity/formations2021?query=%7B%7D&page=1&limit=50")
    .reply(200, sampleCatalogueResponse);

  nock(config.mnaCatalog.endpoint)
    .persist()
    .get(
      "/v1/entity/formations2021?query=%7B%22id_parcoursup%22:%2212345%22,%22published%22:true,%22etablissement_reference_catalogue_published%22:true%7D&page=1&limit=500"
    )
    .reply(200, sampleCatalogueResponse);

  nock(config.mnaCatalog.endpoint)
    .persist()
    .get(
      "/v1/entity/formations2021?query=%7B%22$and%22:[%7B%22id_rco_formation%22:%22KO%22%7D,%7B%22published%22:true%7D,%7B%22etablissement_reference_catalogue_published%22:true%7D]%7D&page=1&limit=500"
    )
    .reply(200, {
      formations: [],
      pagination: {
        page: "1",
        resultats_par_page: 500,
        nombre_de_page: 1,
        total: 0,
      },
    });

  nock(config.mnaCatalog.endpoint)
    .persist()
    .get(
      "/v1/entity/formations2021?query=%7B%22id_parcoursup%22:%22KO%22,%22published%22:true,%22etablissement_reference_catalogue_published%22:true%7D&page=1&limit=500"
    )
    .reply(200, {
      formations: [],
      pagination: {
        page: "1",
        resultats_par_page: 500,
        nombre_de_page: 1,
        total: 0,
      },
    });
};
