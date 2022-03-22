const nock = require("nock");
const config = require("../../../config");
const { sampleCatalogueResponse } = require("../../data/mnaCatalogSamples");

module.exports = async () => {
  nock(config.mnaCatalog.endpoint)
    .persist()
    .post("/v1/entity/formations", {
      query: "{}",
      select:
        '{"code_postal":1,"id_rco_formation":1,"etablissement_formateur_entreprise_raison_sociale":1,"etablissement_gestionnaire_courriel":1,"etablissement_formateur_courriel":1,"intitule_long":1,"etablissement_formateur_adresse":1,"etablissement_formateur_code_postal":1,"etablissement_formateur_nom_departement":1,"etablissement_formateur_localite":1,"lieu_formation_adresse":1,"etablissement_formateur_siret":1,"etablissement_gestionnaire_siret":1,"cfd":1,"localite":1,"email":1,"published":1,"parcoursup_id":1,"cle_ministere_educatif":1}',
      page: 1,
      limit: 50,
    })
    .reply(200, sampleCatalogueResponse);

  nock(config.mnaCatalog.endpoint)
    .persist()
    .post("/v1/entity/formations", {
      query: '{"$and":[{"id_rco_formation":["21_114876|21_114876|106291"]}]}',
      select:
        '{"code_postal":1,"id_rco_formation":1,"etablissement_formateur_entreprise_raison_sociale":1,"etablissement_gestionnaire_courriel":1,"etablissement_formateur_courriel":1,"intitule_long":1,"etablissement_formateur_adresse":1,"etablissement_formateur_code_postal":1,"etablissement_formateur_nom_departement":1,"etablissement_formateur_localite":1,"lieu_formation_adresse":1,"etablissement_formateur_siret":1,"etablissement_gestionnaire_siret":1,"cfd":1,"localite":1,"email":1,"published":1,"parcoursup_id":1,"cle_ministere_educatif":1}',
      page: 1,
      limit: 500,
    })
    .reply(200, sampleCatalogueResponse);
};
