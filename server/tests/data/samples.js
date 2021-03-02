const { referrers } = require("../../src/common/model/constants/referrers");

const sampleAppointment = {
  candidat_id: "91a370e6-3eb1-4e09-80f0-b7cc6be84fac",
  etablissement_id: "2828558M",
  formation_id: "68769673",
  motivations: "TEST MOTIVATION",
  referrer: referrers.LBA.name,
};

const sampleUpdateAppointment = {
  candidat_id: "77a370e6-3eb1-4e09-80f0-b7cc6be84fac",
  etablissement_id: "9998558M",
  formation_id: "68769999",
  motivations: "TEST MOTIVATION UPDATE",
  referrer: referrers.PARCOURSUP.name,
};

const sampleParameter = {
  etablissement_siret: "32922456200234",
  etablissement_raison_sociale: "TEST RAISON SOCIALE",
  formation_intitule: "Test Formation",
  formation_cfd: "26033206",
  email_rdv: "testContact@prdv.fr",
  referrers: [referrers.LBA.code],
};

const sampleUpdateParameter = {
  etablissement_siret: "32922456299999",
  etablissement_raison_sociale: "UPDATE RAISON SOCIALE",
  formation_intitule: "Update Formation",
  formation_cfd: "260999999",
  email_rdv: "updateMail@prdv.fr",
  referrers: [referrers.PARCOURSUP.code],
};

const sampleParameters = [
  {
    etablissement_siret: "32922456200234",
    etablissement_raison_sociale: "TEST RAISON SOCIALE",
    formation_intitule: "Test Formation",
    formation_cfd: "26033206",
    email_rdv: "testContact@prdv.fr",
    referrers: [referrers.LBA.code],
  },
  {
    etablissement_siret: "32922456200235",
    etablissement_raison_sociale: "TEST RAISON SOCIALE 2",
    formation_intitule: "Test Formation 2",
    formation_cfd: "26033205",
    email_rdv: "testContact2@prdv.fr",
    referrers: [referrers.PARCOURSUP.code],
  },
];

module.exports = {
  sampleParameter,
  sampleUpdateParameter,
  sampleParameters,
  sampleAppointment,
  sampleUpdateAppointment,
};
