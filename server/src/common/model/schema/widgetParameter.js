const widgetParameterSchema = {
  etablissement_siret: {
    type: String,
    default: null,
    description: "Siret formateur",
  },
  formation_intitule: {
    type: String,
    default: null,
    description: "Intitulé long de la formation autorisée",
  },
  code_postal: {
    type: String,
    default: null,
    description: "Code postal du lieu de formation",
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
  id_rco_formation: {
    type: String,
    default: null,
    description: "Id RCO formation",
  },
  catalogue_published: {
    type: Boolean,
    default: null,
    description: "Si la formation est publiée sur le Catalogue",
  },
  last_catalogue_sync: {
    type: Date,
    default: Date.now,
    description: "Date de la dernière synchronisation avec le Catalogue",
  },
};

module.exports = widgetParameterSchema;
