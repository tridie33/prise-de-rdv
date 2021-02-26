const axios = require("axios");
const config = require("../../../config");

/**
 * @description Get formations by siret and
 * @param {String} siret
 * @param {String} cfd
 * @returns {Promise<AxiosResponse<Object>>}
 */
const getFormationsBySiretCfd = async ({ siret, cfd }) => {
  const { data } = await axios.get(`${config.mnaCatalog.endpoint}/v1/entity/formations2021`, {
    params: {
      query: {
        $and: [{ etablissement_formateur_siret: siret }, { cfd }],
      },
      page: 1,
      limit: 500,
    },
  });

  return data;
};

module.exports = {
  getFormationsBySiretCfd,
};
