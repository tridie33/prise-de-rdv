const { optMode } = require("../constants/etablissement");

const etablissementSchema = {
  siret_formateur: {
    type: String,
    default: null,
    description: "Siret formateur",
  },
  siret_gestionnaire: {
    type: String,
    default: null,
    description: "Siret gestionnaire",
  },
  raison_sociale: {
    type: String,
    default: null,
    description: "Raison sociale",
  },
  adresse: {
    type: String,
    default: null,
    description: "Adresse",
  },
  code_postal: {
    type: String,
    default: null,
    description: "Code postal",
  },
  localite: {
    type: String,
    default: null,
    description: "Localité",
  },
  email_decisionnaire: {
    type: String,
    default: null,
    description: "Email du decisionnaire de l'établissement",
  },
  opt_mode: {
    type: String,
    enum: Object.values(optMode),
    default: null,
    description: "OPT mode used",
  },
  opt_in_activated_at: {
    type: Date,
    default: null,
    description: "Date d'activation de l'opt-int",
  },
  opt_out_invited_at: {
    type: Date,
    default: null,
    description: "Date d'invitation de l'opt-out",
  },
  opt_out_activated_at: {
    type: Date,
    default: null,
    description: "Date d'activation de l'opt-out",
  },
  opt_out_refused_at: {
    type: Date,
    default: null,
    description: "Date de refus de l'opt-out",
  },
  mailing: {
    type: "array",
    description: "Liste des évènements MAIL récupéré par le serveur",
    required: false,
    items: {
      type: "object",
      required: false,
      properties: {
        campagne: {
          type: "string",
          default: "string",
          description: "Identifiant de campagne",
        },
        messageId: {
          type: "string",
          default: "string",
          description: "Identifiant sendinblue",
        },
        code: {
          type: "string",
          default: "string",
          description: "Code erreur Sendinblue",
        },
        message: {
          type: "string",
          default: "string",
          description: "Message erreur Sendinblue",
        },
      },
    },
  },
  last_catalogue_sync: {
    type: Date,
    default: Date.now,
    description: "Date de la dernière synchronisation avec le Catalogue",
  },
  created_at: {
    type: Date,
    default: Date.now,
    description: "Date de création de la collection",
  },
};

module.exports = etablissementSchema;