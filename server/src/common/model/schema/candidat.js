const candidatsSchema = {
  firstname: {
    type: String,
    default: null,
    description: "Le prénom du candidat",
    unique: true,
  },
  lastname: {
    type: String,
    default: null,
    description: "Le nom du candidat",
    unique: true,
  },
  phone: {
    type: String,
    default: null,
    description: "Le téléphone du candidat",
    unique: true,
  },
  email: {
    type: String,
    default: null,
    description: "L'email du candidat",
    unique: true,
  },
};
module.exports = candidatsSchema;
