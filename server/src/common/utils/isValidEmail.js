const joi = require("joi");

const emailSchema = joi.string().email();

/**
 * @description Checks if given email is valid or not.
 * @param {string} email
 * @return {boolean}
 */
const isValidEmail = (email) => !emailSchema.validate(email)?.error;

module.exports = {
  isValidEmail,
};
