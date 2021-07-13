const nock = require("nock");
const config = require("../../../config");
const { sampleCatalogueResponse } = require("../../data/mnaCatalogSamples");

module.exports = async () => {
  nock(config.mnaCatalog.endpoint)
    .persist()
    .post("/v1/entity/formations2021", {
      query: '{"$and":[{"id_rco_formation":["21_114876|21_114876|106291"]}]}',
      select:
        '{"code_postal":1,"id_rco_formation":1,"etablissement_formateur_entreprise_raison_sociale":1,"intitule_long":1,"etablissement_formateur_adresse":1,"etablissement_formateur_code_postal":1,"etablissement_formateur_nom_departement":1,"lieu_formation_adresse":1,"etablissement_formateur_siret":1,"cfd":1,"localite":1,"email":1}',
      page: 1,
      limit: 500,
    })
    .reply(200, sampleCatalogueResponse);

  nock(config.mnaCatalog.endpoint)
    .persist()
    .post("/v1/entity/formations2021", {
      query:
        '{"$and":[{"id_rco_formation":"14_AF_0000091719|14_SE_0000494236|18894"},{"published":true},{"etablissement_reference_catalogue_published":true}]}',
      select:
        '{"code_postal":1,"id_rco_formation":1,"etablissement_formateur_entreprise_raison_sociale":1,"intitule_long":1,"etablissement_formateur_adresse":1,"etablissement_formateur_code_postal":1,"etablissement_formateur_nom_departement":1,"lieu_formation_adresse":1,"etablissement_formateur_siret":1,"cfd":1,"localite":1,"email":1}',
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
        '{"code_postal":1,"id_rco_formation":1,"etablissement_formateur_entreprise_raison_sociale":1,"intitule_long":1,"etablissement_formateur_adresse":1,"etablissement_formateur_code_postal":1,"etablissement_formateur_nom_departement":1,"lieu_formation_adresse":1,"etablissement_formateur_siret":1,"cfd":1,"localite":1,"email":1}',
      page: 1,
      limit: 500,
    })
    .reply(200, sampleCatalogueResponse);

  nock(config.mnaCatalog.endpoint)
    .persist()
    .post("/v1/entity/formations2021", {
      query: "{}",
      select:
        '{"code_postal":1,"id_rco_formation":1,"etablissement_formateur_entreprise_raison_sociale":1,"intitule_long":1,"etablissement_formateur_adresse":1,"etablissement_formateur_code_postal":1,"etablissement_formateur_nom_departement":1,"lieu_formation_adresse":1,"etablissement_formateur_siret":1,"cfd":1,"localite":1,"email":1}',
      page: 1,
      limit: 50,
    })
    .reply(200, sampleCatalogueResponse);

  nock(config.mnaCatalog.endpoint)
    .persist()
    .post("/v1/entity/formations2021", {
      query: '{"id_parcoursup":"12345","published":true,"etablissement_reference_catalogue_published":true}',
      select:
        '{"code_postal":1,"id_rco_formation":1,"etablissement_formateur_entreprise_raison_sociale":1,"intitule_long":1,"etablissement_formateur_adresse":1,"etablissement_formateur_code_postal":1,"etablissement_formateur_nom_departement":1,"lieu_formation_adresse":1,"etablissement_formateur_siret":1,"cfd":1,"localite":1,"email":1}',
      page: 1,
      limit: 500,
    })
    .reply(200, sampleCatalogueResponse);

  nock(config.mnaCatalog.endpoint)
    .persist()
    .post("/v1/entity/formations2021", {
      query: '{"id_parcoursup":"KO","published":true,"etablissement_reference_catalogue_published":true}',
      select:
        '{"code_postal":1,"id_rco_formation":1,"etablissement_formateur_entreprise_raison_sociale":1,"intitule_long":1,"etablissement_formateur_adresse":1,"etablissement_formateur_code_postal":1,"etablissement_formateur_nom_departement":1,"lieu_formation_adresse":1,"etablissement_formateur_siret":1,"cfd":1,"localite":1,"email":1}',
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
        '{"code_postal":1,"id_rco_formation":1,"etablissement_formateur_entreprise_raison_sociale":1,"intitule_long":1,"etablissement_formateur_adresse":1,"etablissement_formateur_code_postal":1,"etablissement_formateur_nom_departement":1,"lieu_formation_adresse":1,"etablissement_formateur_siret":1,"cfd":1,"localite":1,"email":1}',
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
      query:
        '{"$and":[{"id_rco_formation":["21_114876|21_114876|106291"]},{"published":true},{"etablissement_reference_catalogue_published":true}]}',
      select:
        '{"code_postal":1,"id_rco_formation":1,"etablissement_formateur_entreprise_raison_sociale":1,"intitule_long":1,"etablissement_formateur_adresse":1,"etablissement_formateur_code_postal":1,"etablissement_formateur_nom_departement":1,"lieu_formation_adresse":1,"etablissement_formateur_siret":1,"cfd":1,"localite":1,"email":1}',
      page: 1,
      limit: 500,
    })
    .reply(200, {
      formations: [
        {
          _id: "5fc62395712d48a98814d33c",
          etablissement_formateur_siret: "13002068800086",
          etablissement_formateur_adresse: "3 RUE DARWIN",
          etablissement_formateur_code_postal: "49000",
          etablissement_formateur_entreprise_raison_sociale:
            "CHAMBRE DE METIERS ET DE L'ARTISANAT DE REGION DES PAYS DE LA LOIRE",
          etablissement_formateur_nom_departement: "Maine-et-Loire",
          cfd: "50022141",
          code_postal: "49000",
          localite: "Angers",
          intitule_long: "PATISSIER (CAP)",
          lieu_formation_adresse: "3 rue Darwin - Belle Beille CS 80806",
          id_rco_formation: "21_114876|21_114876|106291",
          id: "5fc62395712d48a98814d33c",
        },
      ],
      pagination: {
        page: 1,
        resultats_par_page: 500,
        nombre_de_page: 1,
        total: 1,
      },
    });

  nock(config.mnaCatalog.endpoint)
    .persist()
    .post("/v1/entity/formations2021", {
      query:
        '{"$and":[{"etablissement_formateur_siret":"32922456200234"},{"published":true},{"etablissement_reference_catalogue_published":true}]}',
      select:
        '{"code_postal":1,"id_rco_formation":1,"etablissement_formateur_entreprise_raison_sociale":1,"intitule_long":1,"etablissement_formateur_adresse":1,"etablissement_formateur_code_postal":1,"etablissement_formateur_nom_departement":1,"lieu_formation_adresse":1,"etablissement_formateur_siret":1,"cfd":1,"localite":1,"email":1}',
      page: 1,
      limit: 500,
    })
    .reply(200, {
      formations: [
        {
          _id: "5fc62395712d48a98814d33c",
          etablissement_formateur_siret: "32922456200234",
          etablissement_formateur_adresse: "3 RUE DARWIN",
          etablissement_formateur_code_postal: "49000",
          etablissement_formateur_entreprise_raison_sociale:
            "CHAMBRE DE METIERS ET DE L'ARTISANAT DE REGION DES PAYS DE LA LOIRE",
          etablissement_formateur_nom_departement: "Maine-et-Loire",
          cfd: "50022141",
          code_postal: "49000",
          localite: "Angers",
          intitule_long: "PATISSIER (CAP)",
          lieu_formation_adresse: "3 rue Darwin - Belle Beille CS 80806",
          id_rco_formation: "21_114876|21_114876|106291",
          id: "5fc62395712d48a98814d33c",
        },
      ],
      pagination: {
        page: 1,
        resultats_par_page: 500,
        nombre_de_page: 1,
        total: 1,
      },
    });
};
