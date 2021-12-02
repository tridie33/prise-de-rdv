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
   * @param {String} catalogue_published
   * @param {Date} last_catalogue_sync
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
    catalogue_published,
    last_catalogue_sync,
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
      catalogue_published,
      last_catalogue_sync,
    });
    await widgetParameter.save();

    return widgetParameter.toObject();
  },

  /**
   * @description Finds or creates a parameter.
   * @param etablissement_siret
   * @param etablissement_raison_sociale
   * @param formation_intitule
   * @param formation_cfd
   * @param email_rdv
   * @param email_decisionnaire
   * @param code_postal
   * @param id_rco_formation
   * @param referrers
   * @returns {Promise<WidgetParameter>}
   */
  findUpdateOrCreate: async ({
    etablissement_siret,
    etablissement_raison_sociale,
    formation_intitule,
    formation_cfd,
    email_rdv,
    email_decisionnaire,
    code_postal,
    id_rco_formation,
    referrers,
  }) => {
    const parameter = {
      etablissement_siret,
      etablissement_raison_sociale,
      formation_intitule,
      formation_cfd,
      email_rdv,
      email_decisionnaire,
      code_postal,
      id_rco_formation,
      referrers,
    };

    const widgetParameterFind = await WidgetParameter.findOne({ id_rco_formation });

    if (widgetParameterFind) {
      return WidgetParameter.findOneAndUpdate({ _id: widgetParameterFind._id }, parameter, { new: true });
    }

    const widgetParameter = new WidgetParameter(parameter);
    await widgetParameter.save();

    return widgetParameter.toObject();
  },

  /**
   * @description Returns items.
   * @param {Object} conditions
   * @returns {Promise<WidgetParameter[]>}
   */
  find: (conditions) => WidgetParameter.find(conditions),

  /**
   * @description Returns one item.
   * @param {Object} conditions
   * @returns {Promise<WidgetParameter>}
   */
  findOne: async (conditions) => WidgetParameter.findOne(conditions),

  /**
   * @description Updates item.
   * @param {String} id
   * @param {WidgetParameter} body
   * @returns {Promise<*>}
   */
  updateParameter: (id, body) => WidgetParameter.findOneAndUpdate({ _id: id }, body, { new: true }),

  /**
   * @description Deletes an item.
   * @param {String} id
   * @returns {Promise<*>}
   */
  deleteParameter: (id) => WidgetParameter.findByIdAndDelete(id),

  /**
   * @description Update many documents.
   * @param {Object} conditions
   * @param {Object} values
   * @returns {Promise<WidgetParameter>}
   */
  updateMany: (conditions, values) => WidgetParameter.updateMany(conditions, values, { new: true, upsert: true }),

  /**
   * @description Returns all formations that have
   * @param {String} etablissement_siret
   * @returns {Promise<WidgetParameter>}
   */
  getParametersBySiret: ({ etablissement_siret }) => WidgetParameter.find({ etablissement_siret }),

  /**
   * @description Returns item through its "id_rco_formation".
   * @param {String} idRcoFormation
   * @returns {Promise<WidgetParameter>}
   */
  getParameterByIdRcoFormation: ({ idRcoFormation }) => WidgetParameter.findOne({ id_rco_formation: idRcoFormation }),

  /**
   * @description Returns items through its "id_rco_formation" have referrer item.
   * @param {String} idRcoFormation
   * @returns {Promise<WidgetParameter>}
   */
  getParameterByIdRcoFormationWithNotEmptyReferrers: ({ idRcoFormation }) =>
    WidgetParameter.findOne({ id_rco_formation: idRcoFormation, referrers: { $not: { $size: 0 } } }),

  /**
   * @description Returns item through its "id_rco_formation".
   * @param {String} idRcoFormation
   * @param {Number} referrer
   * @returns {Promise<WidgetParameter>}
   */
  getParameterByIdRcoFormationReferrer: ({ idRcoFormation, referrer }) =>
    WidgetParameter.findOne({
      id_rco_formation: idRcoFormation,
      referrers: { $in: [referrer] },
    }),

  /**
   * @description Checks if widget is enabled or not.
   * @param {String} idRcoFormation
   * @param {Number} referrer
   * @returns {Promise<Boolean>}
   */
  isWidgetVisible: async ({ idRcoFormation, referrer }) => {
    const widgetParameter = await WidgetParameter.findOne({
      id_rco_formation: idRcoFormation,
      referrers: { $in: [referrer] },
    });

    return !!(widgetParameter && widgetParameter.email_rdv);
  },
});
