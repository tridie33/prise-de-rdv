const appointmentSchema = {
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
    description: "Le nom du site parent",
  },
  referrer_link: {
    type: String,
    default: null,
    description: "L'url du site parent",
  },
  date_de_reponse_cfa: {
    type: Date,
    default: null,
    description: "La date de réponse du cfa au candidat",
  },
  statut_general: {
    type: String,
    default: "ouverte",
    description: "Description plus générale sur l'état de la demande (ouverte, finie, probleme)",
  },
  champs_libre_status: {
    type: String,
    default: null,
    description: "Champs libre qui sert de notes sur le statut",
  },
  champs_libre_commentaire: {
    type: String,
    default: null,
    description: "Champs libre qui sert de notes supplémentaires",
  },
  cfa_pris_contact_candidat: {
    type: Boolean,
    default: false,
    description: "Le cfa a t'il pris contact avec le candidat ?",
  },
  cfa_pris_contact_candidat_date: {
    type: Date,
    default: null,
    description: "La date de la première prise de contact du cfa vers le candidat",
  },
  email_premiere_demande_candidat_message_id: {
    type: String,
    default: null,
    description: "Identifiant externe du mail envoyé au candidat",
  },
  email_premiere_demande_candidat_statut: {
    type: String,
    default: null,
    description: "Statut du mail envoyé au candidat",
  },
  email_premiere_demande_cfa_message_id: {
    type: String,
    default: null,
    description: "Identifiant externe du mail envoyé au CFA",
  },
  email_premiere_demande_cfa_statut: {
    type: String,
    default: null,
    description: "Statut du mail envoyé au CFA",
  },
  id_rco_formation: {
    type: String,
    default: null,
    description: "Id RCO formation",
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
  email_cfa: {
    type: String,
    required: false,
    default: null,
    description: "Adresse email CFA",
  },
};

module.exports = appointmentSchema;
