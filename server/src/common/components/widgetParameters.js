const { WidgetParameter } = require("../model");

module.exports = async () => ({
  /**
   * @description Creates new item.
   * @param {String} etablissement_siret
   * @param {String} etablissement_raison_sociale
   * @param {String} formation_intitule
   * @param {String} formation_cfd
   * @param {String} email_rdv
   * @param {Number[]} referrers
   * @returns {Promise<*>}
   */
  createParameter: async ({
    etablissement_siret,
    etablissement_raison_sociale,
    formation_intitule,
    formation_cfd,
    email_rdv,
    referrers,
  }) => {
    const toAdd = new WidgetParameter({
      etablissement_siret,
      etablissement_raison_sociale,
      formation_intitule,
      formation_cfd,
      email_rdv,
      referrers,
    });
    await toAdd.save();
    return toAdd.toObject();
  },

  /**
   * @description Updates item.
   * @param {String} requestId
   * @param {WidgetParameter} body
   * @returns {Promise<*>}
   */
  updateParameter: async (requestId, body) => {
    return WidgetParameter.findOneAndUpdate({ _id: requestId }, body, { new: true });
  },

  /**
   * @description Deletes an item.
   * @param {String} requestId
   * @returns {Promise<*>}
   */
  deleteParameter: async (requestId) => {
    return WidgetParameter.findByIdAndDelete(requestId);
  },

  /**
   * @description Returns item through its: siret, cfd and referrer.
   * @param {String} siret
   * @param {String} cfd
   * @returns {Promise<WidgetParameter>}
   */
  getParameterBySiretCfd: ({ siret, cfd }) => {
    return WidgetParameter.findOne({
      etablissement_siret: siret,
      formation_cfd: cfd,
    });
  },

  /**
   * @description Returns item through its: siret, cfd and referrer.
   * @param {String} siret
   * @param {String} cfd
   * @param {Number} referrer
   * @returns {Promise<WidgetParameter>}
   */
  getParameterBySiretCfdReferrer: ({ siret, cfd, referrer }) => {
    return WidgetParameter.findOne({
      etablissement_siret: siret,
      formation_cfd: cfd,
      referrers: { $in: [referrer] },
    });
  },

  /**
   * @description Checks if widget is enabled or not.
   * @param {String} siret
   * @param {String} cfd
   * @param {Number} referrer
   * @returns {Promise<Boolean>}
   */
  isWidgetVisible: async ({ siret, cfd, referrer }) => {
    return await WidgetParameter.exists({
      etablissement_siret: siret,
      formation_cfd: cfd,
      referrers: { $in: [referrer] },
    });
  },
});
