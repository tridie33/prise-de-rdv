const axios = require("axios");
const config = require("../../../config");
/**
 * @description Get formations by siret and
 * @param {String} siret
 * @param {String} cfd
 * @returns {Promise<Object>}
 */
const getFormationsBySiretCfd = async ({ siret, cfd }) =>
  getFormations({
    $and: [{ etablissement_formateur_siret: siret }, { cfd }],
  });

/**
 * @description Get formations by siret and
 * @param {Object} query - Mongo query
 * @param {Number} page - For pagination
 * @param {Number} limit - Item limit
 * @returns {Promise<Object>}
 */
const getFormations = async (query, page = 1, limit = 500) => {
  const { data } = await axios.get(`${config.mnaCatalog.endpoint}/v1/entity/formations2021`, {
    params: {
      query,
      page,
      limit,
    },
  });

  return data;
};

module.exports = {
  getFormationsBySiretCfd,
  getFormations,
};
