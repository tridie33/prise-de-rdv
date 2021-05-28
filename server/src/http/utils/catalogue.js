const axios = require("axios");
const config = require("../../../config");

/**
 * @description Get formations by idRcoFormations.
 * @param {String[]} idRcoFormations
 * @returns {Promise<Object>}
 */
const getFormationsByIdRcoFormations = ({ idRcoFormations }) =>
  getFormations({
    $and: [
      { id_rco_formation: idRcoFormations },
      { published: true },
      { etablissement_reference_catalogue_published: true },
    ],
  });

/**
 * @description Get formations by its idParcoursup.
 * @param {String} idParcoursup
 * @returns {Promise<Object>}
 */
const getFormationsByIdParcoursup = ({ idParcoursup }) =>
  getFormations({
    id_parcoursup: idParcoursup,
    published: true,
    etablissement_reference_catalogue_published: true,
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
  getFormationsByIdRcoFormations,
  getFormationsByIdParcoursup,
  getFormations,
};
