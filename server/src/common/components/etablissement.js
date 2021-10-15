const { Etablissement } = require("../../common/model");

module.exports = async () => ({
  /**
   * @description Creates an etablissement.
   * @param {Object} options
   * @returns {Promise<Etablissement>}
   */
  create: async (options = {}) => {
    const etablissement = new Etablissement(options);
    await etablissement.save();

    return etablissement.toObject();
  },

  /**
   * @description Returns an etablissement from its id.
   * @param {ObjectId} id
   * @returns {Promise<Etablissement>}
   */
  findById: async (id) => {
    const etablissement = await Etablissement.findById(id);

    if (!etablissement) {
      throw new Error(`Unable to find etablissement ${id}`);
    }

    return etablissement.toObject();
  },

  /**
   * @description Returns one item.
   * @param {Object} conditions
   * @returns {Promise<Etablissement>}
   */
  findOne: (conditions) => Etablissement.findOne(conditions),

  /**
   * @description Updates an etablissement from its conditions.
   * @param {Object} conditions
   * @param {Object} values
   * @returns {Promise<Etablissement>}
   */
  findOneAndUpdate: (conditions, values) => Etablissement.findOneAndUpdate(conditions, values, { new: true }),

  /**
   * @description Upserts.
   * @param {Object} conditions
   * @param {Object} values
   * @returns {Promise<Etablissement>}
   */
  updateMany: (conditions, values) => Etablissement.updateMany(conditions, values, { new: true, upsert: true }),

  /**
   * @description Updates an etablissement from its id.
   * @param {ObjectId} id
   * @param {Object} values
   * @returns {Promise<Etablissement>}
   */
  findByIdAndUpdate: (id, values) => Etablissement.findByIdAndUpdate({ _id: id }, values, { new: true }),

  /**
   * @description Deletes an etablissement from its id.
   * @param {ObjectId} id
   * @returns {Promise<void>}
   */
  findByIdAndDelete: (id) => Etablissement.findByIdAndDelete(id),
});