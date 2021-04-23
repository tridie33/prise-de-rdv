const axios = require("axios");
const config = require("../../../config");

/**
 * @description Get formations by its idRcoFormation.
 * @param {String} idRcoFormation
 * @returns {Promise<Object>}
 */
const getFormationsByIdRcoFormation = async ({ idRcoFormation }) =>
  getFormations({
    $and: [
      { id_rco_formation: idRcoFormation },
      { published: true },
      { etablissement_reference_catalogue_published: true },
    ],
  });

/**
 * @description Get formations through the catalogue.
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
  getFormationsByIdRcoFormation,
  getFormations,
};
