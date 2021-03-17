const Boom = require("boom");

// Referrer configurations
const referrers = {
  PARCOURSUP: {
    code: 1,
    name: "PARCOURSUP",
    fullName: "Parcoursup",
    url: "https://www.parcoursup.fr",
  },
  LBA: {
    code: 2,
    name: "LBA",
    fullName: "La Bonne Alternance",
    url: "https://labonnealternance.apprentissage.beta.gouv.fr",
  },
};

/**
 * @description Returns referrer from it's key.
 * @param {string} keyName
 * @returns {{code: {Number}, name: {String}, fullName: {String}, url: {String}}}
 */
function getReferrerByKeyName(keyName) {
  const referrerFound = referrers[keyName.toUpperCase()];

  if (!referrerFound) {
    throw Boom.badRequest("Referrer introuvable.");
  }

  return referrerFound;
}

/**
 * @description Returns referrer from it's identifier.
 * @param {string|number} id
 * @returns {{code: {Number}, name: {String}, fullName: {String}, url: {String}}}
 */
function getReferrerById(id) {
  const referrer = Object.values(referrers).find((referrer) => referrer.code.toString() === id.toString());

  if (!referrer) {
    throw new Error(`Unknown "${id}" referrer code.`);
  }

  return referrer;
}

module.exports = {
  referrers,
  getReferrerByKeyName,
  getReferrerById,
};
