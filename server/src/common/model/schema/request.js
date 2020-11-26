const requestsSchema = {
  candidatId: {
    type: Object,
    default: null,
    description: "Le numéro de la demande",
  },
  requestFoncId: {
    type: String,
    default: null,
    description: "Le numéro de la demande",
  },
  motivations: {
    type: String,
    default: null,
    description: "Les motivations du candidat",
  },
  centreId: {
    type: String,
    default: null,
    description: "L'identifiant de l'établissement'",
  },
  trainingId: {
    type: String,
    default: null,
    description: "L'identifiant de la formation'",
  },
  referrer: {
    type: String,
    default: null,
    description: "L'url du site parent ou simplement le nom",
  },
  createdAt: {
    type: Date,
    default: null,
    description: "La date création de la demande",
    unique: true,
  },
  answerCentreAt: {
    type: Date,
    default: null,
    description: "La date de réponse du centre au candidat",
  },
  statusRequest: {
    type: String,
    default: null,
    description: "Description plus générale sur l'état de la demande'",
  },
  statusCandidatIsContactedByCentre: {
    type: Boolean,
    default: false,
    description: "Le candidat a t'il été rappelé par le centre ?",
  },
  statusMailIsReceivedByCentre: {
    type: Boolean,
    default: null,
    description: "Le centre a t'il bien reçu le mail de demande de rappel du candidat ?",
  },
  statusMailIsReceivedByCandidat: {
    type: Boolean,
    default: null,
    description: "Le candidat a t'il bien reçu un mail de confirmation suite à sa demande de rappel ?",
  },
  statusMailIsOpenedByCandidat: {
    type: Boolean,
    default: null,
    description: "Le candidat a t'il ouvert son mail de confirmation ?",
  },
  statusMailIsOpenedByCentre: {
    type: Boolean,
    default: null,
    description: "Le centre a t'il ouvert son mail de demande de contact du candidat ?",
  },
};
module.exports = requestsSchema;
