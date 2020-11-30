const mongoose = require("mongoose");
const { Schema } = mongoose;

const candidatsSchema = new Schema({
  firstname: {
    type: String,
    default: null,
    description: "Le prénom du candidat",
  },
  lastname: {
    type: String,
    default: null,
    description: "Le nom du candidat",
  },
  phone: {
    type: String,
    default: null,
    description: "Le téléphone du candidat",
  },
  email: {
    type: String,
    default: null,
    description: "L'email du candidat",
  },
});

module.exports = candidatsSchema;
