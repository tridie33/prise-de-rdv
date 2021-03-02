const widgetParameterSchema = {
  etablissement_siret: {
    type: String,
    default: null,
    description: "Siret du cfa formateur",
  },
  etablissement_raison_sociale: {
    type: String,
    default: null,
    description: "Raison sociale du cfa formateur",
  },
  formation_intitule: {
    type: String,
    default: null,
    description: "Intitulé long de la formation autorisée",
  },
  formation_cfd: {
    type: String,
    default: null,
    description: "CFD de la formation autorisée",
  },
  email_rdv: {
    type: String,
    default: null,
    description: "Adresse email pour la prise de RDV",
  },
  referrers: {
    type: [Object],
    default: [],
    description: "Liste des sites autorisés",
  },
};

module.exports = widgetParameterSchema;
