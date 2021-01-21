const { codesReferrersSites } = require("../../src/common/model/constants");

const sampleParameter = {
  etablissement_siret: "32922456200234",
  etablissement_raison_sociale: "TEST RAISON SOCIALE",
  formation_intitule: "Test Formation",
  formation_cfd: "26033206",
  email_rdv: "testContact@prdv.fr",
  referrers: [codesReferrersSites.LBA],
};

const sampleUpdateParameter = {
  etablissement_siret: "32922456299999",
  etablissement_raison_sociale: "UPDATE RAISON SOCIALE",
  formation_intitule: "Update Formation",
  formation_cfd: "260999999",
  email_rdv: "updateMail@prdv.fr",
  referrers: [codesReferrersSites.PARCOURSUP],
};

const sampleParameters = [
  {
    etablissement_siret: "32922456200234",
    etablissement_raison_sociale: "TEST RAISON SOCIALE",
    formation_intitule: "Test Formation",
    formation_cfd: "26033206",
    email_rdv: "testContact@prdv.fr",
    referrers: [codesReferrersSites.LBA],
  },
  {
    etablissement_siret: "32922456200235",
    etablissement_raison_sociale: "TEST RAISON SOCIALE 2",
    formation_intitule: "Test Formation 2",
    formation_cfd: "26033205",
    email_rdv: "testContact2@prdv.fr",
    referrers: [codesReferrersSites.PARCOURSUP],
  },
];

module.exports = { sampleParameter, sampleUpdateParameter, sampleParameters };
