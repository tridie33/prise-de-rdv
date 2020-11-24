const candidatReference = require("./candidat");

const requestsSchema = {
  ...candidatReference,

  referer: {
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
  motivations: {
    type: String,
    default: null,
    description: "Les motivations du candidat",
  },
  responseCentreAt: {
    type: Date,
    default: null,
    description: "La date de réponse du centre au candidat",
  },
  statusRequest: {
    type: String,
    default: null,
    description: "Description plus général sur l'etat de la demande'",
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
  statusMailIsOpenedBCentre: {
    type: Boolean,
    default: null,
    description: "Le centre a t'il ouvert son mail de demande de contact du candidat ?",
  }
};
module.exports = requestsSchema;
