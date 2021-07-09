const axios = require("axios");
const { AxiosRedis } = require("@tictactrip/axios-redis");
const config = require("../../../config");
const { axiosRedis } = require("../../common/redis");

const commonConditions = [{ published: true }, { etablissement_reference_catalogue_published: true }];

/**
 * @description Get formations by "siret formateur".
 * @param {String} siretFormateur
 * @returns {Promise<Object>}
 */
const getFormationsBySiretFormateur = ({ siretFormateur }) =>
  getFormations({
    $and: [{ etablissement_formateur_siret: siretFormateur }, ...commonConditions],
  });

/**
 * @description Get formations by idRcoFormations.
 * @param {String[]} idRcoFormations
 * @returns {Promise<Object>}
 */
const getFormationsByIdRcoFormations = ({ idRcoFormations }) =>
  getFormations({
    $and: [{ id_rco_formation: idRcoFormations }, ...commonConditions],
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
  const { data } = await axios.post(
    `${config.mnaCatalog.endpoint}/v1/entity/formations2021`,
    {
      query: JSON.stringify(query),
      select: JSON.stringify({
        code_postal: 1,
        id_rco_formation: 1,
        etablissement_formateur_entreprise_raison_sociale: 1,
        intitule_long: 1,
        etablissement_formateur_adresse: 1,
        etablissement_formateur_code_postal: 1,
        etablissement_formateur_nom_departement: 1,
        lieu_formation_adresse: 1,
        etablissement_formateur_siret: 1,
        cfd: 1,
        localite: 1,
      }),
      page,
      limit,
    },
    {
      adapter: (config) => AxiosRedis.ADAPTER(config, axiosRedis),
    }
  );

  return data;
};

module.exports = {
  getFormationsByIdRcoFormations,
  getFormationsByIdParcoursup,
  getFormationsBySiretFormateur,
  getFormations,
};
