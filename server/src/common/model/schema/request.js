const requestSchema = {
  candidat_id: {
    type: String,
    default: null,
    description: "Id candidat",
  },
  numero_de_la_demande: {
    type: String,
    default: null,
    description: "Le numéro de la demande",
  },
  motivations: {
    type: String,
    default: null,
    required: false,
    description: "Les motivations du candidat",
  },
  etablissement_id: {
    type: String,
    default: null,
    description: "L'identifiant de l'établissement",
  },
  formation_id: {
    type: String,
    default: null,
    description: "L'identifiant de la formation",
  },
  referrer: {
    type: String,
    default: null,
    description: "L'url du site parent ou simplement le nom",
  },
  date_de_reponse_cfa: {
    type: Date,
    default: null,
    description: "La date de réponse du cfa au candidat",
  },
  statut_general: {
    type: String,
    default: "ouverte",
    description: "Description plus générale sur l'état de la demande (en cours, fini, probleme)",
  },
  cfa_pris_contact_candidat: {
    type: Boolean,
    default: false,
    description: "Le candidat a t'il été rappelé par le centre ?",
  },
  cfa_pris_contact_candidat_date: {
    type: Date,
    default: null,
    description: "Le candidat a t'il été rappelé par le centre ? date",
  },

  email_premiere_demande_candidat_recu: {
    type: Boolean,
    default: false,
    description: "Le candidat a t'il bien reçu un mail de confirmation suite à sa demande de rappel ?",
  },
  email_premiere_demande_candidat_ouvert: {
    type: Boolean,
    default: false,
    description: "Le candidat a t'il ouvert son mail de confirmation ?",
  },
  email_premiere_demande_cfa_recu: {
    type: Boolean,
    default: false,
    description: "Le centre a t'il bien reçu le mail de demande de rappel du candidat ?",
  },
  email_premiere_demande_cfa_ouvert: {
    type: Boolean,
    default: false,
    description: "Le centre a t'il ouvert son mail de demande de contact du candidat ?",
  },

  created_at: {
    type: Date,
    default: Date.now,
    description: "La date création de la demande",
  },
  last_update_at: {
    type: Date,
    default: Date.now,
    description: "Date de dernières mise à jour",
  },
};

module.exports = requestSchema;
