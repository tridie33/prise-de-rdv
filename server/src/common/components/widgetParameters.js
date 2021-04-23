const { WidgetParameter } = require("../model");

module.exports = async () => ({
  /**
   * @description Creates new item.
   * @param {String} etablissement_siret
   * @param {String} etablissement_raison_sociale
   * @param {String} formation_intitule
   * @param {String} formation_cfd
   * @param {String} email_rdv
   * @param {String} code_postal
   * @param {Number[]} referrers
   * @param {String} id_rco_formation
   * @returns {Promise<*>}
   */
  createParameter: async ({
    etablissement_siret,
    etablissement_raison_sociale,
    formation_intitule,
    formation_cfd,
    email_rdv,
    code_postal,
    referrers,
    id_rco_formation,
  }) => {
    const widgetParameter = new WidgetParameter({
      etablissement_siret,
      etablissement_raison_sociale,
      formation_intitule,
      formation_cfd,
      email_rdv,
      referrers,
      code_postal,
      id_rco_formation,
    });
    await widgetParameter.save();

    return widgetParameter.toObject();
  },

  /**
   * @description Updates item.
   * @param {String} id
   * @param {WidgetParameter} body
   * @returns {Promise<*>}
   */
  updateParameter: async (id, body) => {
    return WidgetParameter.findOneAndUpdate({ _id: id }, body, { new: true });
  },

  /**
   * @description Deletes an item.
   * @param {String} id
   * @returns {Promise<*>}
   */
  deleteParameter: (id) => {
    return WidgetParameter.findByIdAndDelete(id);
  },

  /**
   * @description Returns item through its "id_rco_formation".
   * @param {String} idRcoFormation
   * @returns {Promise<WidgetParameter>}
   */
  getParameterByIdRcoFormation: ({ idRcoFormation }) => {
    return WidgetParameter.findOne({ id_rco_formation: idRcoFormation });
  },

  /**
   * @description Returns item through its "id_rco_formation".
   * @param {String} idRcoFormation
   * @param {Number} referrer
   * @returns {Promise<WidgetParameter>}
   */
  getParameterByIdRcoFormationReferrer: ({ idRcoFormation, referrer }) => {
    return WidgetParameter.findOne({
      id_rco_formation: idRcoFormation,
      referrers: { $in: [referrer] },
    });
  },

  /**
   * @description Checks if widget is enabled or not.
   * @param {String} idRcoFormation
   * @param {Number} referrer
   * @returns {Promise<Boolean>}
   */
  isWidgetVisible: async ({ idRcoFormation, referrer }) => {
    return WidgetParameter.exists({
      id_rco_formation: idRcoFormation,
      referrers: { $in: [referrer] },
    });
  },
});
