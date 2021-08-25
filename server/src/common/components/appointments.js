const { Appointment } = require("../../common/model");

module.exports = async () => ({
  /**
   * @description Crates an appointment.
   * @param {Object} options
   * @param {String} options.candidat_id
   * @param {String} options.formation_id
   * @param {String} options.etablissement_id
   * @param {String} options.formation_id
   * @param {String} options.motivations
   * @param {Number} options.referrer
   * @returns {Promise<Appointment>}
   */
  createAppointment: async (options = {}) => {
    const { candidat_id, etablissement_id, formation_id, motivations, referrer, id_rco_formation } = options;

    const appointment = new Appointment({
      candidat_id,
      motivations,
      etablissement_id,
      formation_id,
      referrer,
      id_rco_formation,
    });
    await appointment.save();

    return appointment.toObject();
  },
  /**
   * @description Updates email provider id and flag emails as sent.
   * @param {Object} params
   * @param {ObjectId} params.appointmentId
   * @param {string|null} params.cfaMessageId
   * @param {string|null} params.candidatMessageId
   * @returns {Appointment}
   */
  updateStatusMailsSend: ({ appointmentId, cfaMessageId, candidatMessageId }) => {
    return Appointment.findOneAndUpdate(
      { _id: appointmentId },
      {
        email_premiere_demande_candidat_envoye: true,
        email_premiere_demande_cfa_envoye: true,
        email_premiere_demande_cfa_envoye_message_id: cfaMessageId,
        email_premiere_demande_candidat_envoye_message_id: candidatMessageId,
      },
      { new: true }
    );
  },
  /**
   * @description Returns appoint from its id.
   * @param {String} id
   * @returns {Promise<*>}
   */
  getAppointmentById: async (id) => {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      throw new Error(`Unable to find appointement ${id}`);
    }
    return appointment.toObject();
  },
  /**
   * @description Updates opened mail status for candidate.
   * @param {String} id
   * @returns {Promise<*>}
   */
  updateStatusMailOpenedByCandidat: async (id) => {
    const retrievedData = await Appointment.findById(id);

    retrievedData.email_premiere_demande_candidat_ouvert = true;

    return Appointment.findOneAndUpdate({ _id: id }, retrievedData, { new: true });
  },
  /**
   * @description Updates opened mail status for the CFA.
   * @param {String} id
   * @returns {Promise<*>}
   */
  updateStatusMailOpenedByCentre: async (id) => {
    const retrievedData = await Appointment.findById(id);

    retrievedData.email_premiere_demande_cfa_ouvert = true;

    return Appointment.findOneAndUpdate({ _id: id }, retrievedData, { new: true });
  },
  /**
   * @description Updates an appointment from its id.
   * @param {String} id
   * @param {Appointment} values
   * @returns {*}
   */
  updateAppointment: (id, values) => {
    return Appointment.findOneAndUpdate({ _id: id }, values, { new: true });
  },
});
