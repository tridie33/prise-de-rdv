const mapping = {
  "af.13714": "21_114876|21_114876|106291",
};

/**
 * @description Returns idRcoFormation through its idActionFormation.
 * @param {string} idActionFormation
 * @returns {string|undefined}
 */
function getIdRcoFormationThroughIdActionFormation(idActionFormation) {
  return mapping[idActionFormation.toLowerCase()];
}

module.exports = {
  getIdRcoFormationThroughIdActionFormation,
};
