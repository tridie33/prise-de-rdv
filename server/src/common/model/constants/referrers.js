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
 * @param {string} referrer
 * @returns {{code: {Number}, name: {String}, fullName: {String}, url: {String}}}
 */
function getReferrer(referrer) {
  const referrerFound = referrers[referrer.toUpperCase()];

  if (!referrerFound) {
    throw Boom.badRequest("Referrer introuvable.");
  }

  return referrerFound;
}

module.exports = {
  referrers,
  getReferrer,
};
