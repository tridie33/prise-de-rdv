const nock = require("nock");
const config = require("../../../config");
const { sampleCatalogueResponse } = require("../../data/mnaCatalogSamples");

module.exports = async () => {
  nock(config.mnaCatalog.endpoint)
    .persist()
    .post("/v1/entity/formations2021", {
      query:
        '{"$and":[{"id_rco_formation":"14_AF_0000091719|14_SE_0000494236|18894"},{"published":true},{"etablissement_reference_catalogue_published":true}]}',
      select:
        '{"code_postal":1,"id_rco_formation":1,"etablissement_formateur_entreprise_raison_sociale":1,"intitule_long":1,"etablissement_formateur_adresse":1,"etablissement_formateur_code_postal":1,"etablissement_formateur_nom_departement":1,"lieu_formation_adresse":1,"etablissement_formateur_siret":1,"cfd":1,"localite":1}',
      page: 1,
      limit: 500,
    })
    .reply(200, sampleCatalogueResponse);

  nock(config.mnaCatalog.endpoint)
    .persist()
    .post("/v1/entity/formations2021", {
      query:
        '{"$and":[{"id_rco_formation":"KO"},{"published":true},{"etablissement_reference_catalogue_published":true}]}',
      select:
        '{"code_postal":1,"id_rco_formation":1,"etablissement_formateur_entreprise_raison_sociale":1,"intitule_long":1,"etablissement_formateur_adresse":1,"etablissement_formateur_code_postal":1,"etablissement_formateur_nom_departement":1,"lieu_formation_adresse":1,"etablissement_formateur_siret":1,"cfd":1,"localite":1}',
      page: 1,
      limit: 500,
    })
    .reply(200, sampleCatalogueResponse);

  nock(config.mnaCatalog.endpoint)
    .persist()
    .post("/v1/entity/formations2021", {
      query: "{}",
      select:
        '{"code_postal":1,"id_rco_formation":1,"etablissement_formateur_entreprise_raison_sociale":1,"intitule_long":1,"etablissement_formateur_adresse":1,"etablissement_formateur_code_postal":1,"etablissement_formateur_nom_departement":1,"lieu_formation_adresse":1,"etablissement_formateur_siret":1,"cfd":1,"localite":1}',
      page: 1,
      limit: 50,
    })
    .reply(200, sampleCatalogueResponse);

  nock(config.mnaCatalog.endpoint)
    .persist()
    .post("/v1/entity/formations2021", {
      query: '{"id_parcoursup":"12345","published":true,"etablissement_reference_catalogue_published":true}',
      select:
        '{"code_postal":1,"id_rco_formation":1,"etablissement_formateur_entreprise_raison_sociale":1,"intitule_long":1,"etablissement_formateur_adresse":1,"etablissement_formateur_code_postal":1,"etablissement_formateur_nom_departement":1,"lieu_formation_adresse":1,"etablissement_formateur_siret":1,"cfd":1,"localite":1}',
      page: 1,
      limit: 500,
    })
    .reply(200, sampleCatalogueResponse);

  nock(config.mnaCatalog.endpoint)
    .persist()
    .post("/v1/entity/formations2021", {
      query: '{"id_parcoursup":"KO","published":true,"etablissement_reference_catalogue_published":true}',
      select:
        '{"code_postal":1,"id_rco_formation":1,"etablissement_formateur_entreprise_raison_sociale":1,"intitule_long":1,"etablissement_formateur_adresse":1,"etablissement_formateur_code_postal":1,"etablissement_formateur_nom_departement":1,"lieu_formation_adresse":1,"etablissement_formateur_siret":1,"cfd":1,"localite":1}',
      page: 1,
      limit: 500,
    })
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
    .post("/v1/entity/formations2021", {
      query: '{"id_rco_formation":"KO","published":true,"etablissement_reference_catalogue_published":true}',
      select:
        '{"code_postal":1,"id_rco_formation":1,"etablissement_formateur_entreprise_raison_sociale":1,"intitule_long":1,"etablissement_formateur_adresse":1,"etablissement_formateur_code_postal":1,"etablissement_formateur_nom_departement":1,"lieu_formation_adresse":1,"etablissement_formateur_siret":1,"cfd":1,"localite":1}',
      page: 1,
      limit: 500,
    })
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
