const { Appointment } = require("../../common/model");

module.exports = async () => {
  return {
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
      const { candidat_id, etablissement_id, formation_id, motivations, referrer } = options;

      const appointment = new Appointment({
        candidat_id,
        motivations,
        etablissement_id,
        formation_id,
        referrer,
      });
      await appointment.save();

      return appointment.toObject();
    },
    /**
     * @description Updates mail status.
     * @param {String} appointmentId
     * @returns {Appointment}
     */
    updateStatusMailsSend: (appointmentId) => {
      return Appointment.findOneAndUpdate(
        { _id: appointmentId },
        {
          email_premiere_demande_candidat_envoye: true,
          email_premiere_demande_cfa_envoye: true,
        },
        { new: true }
      );
    },
    getAppointmentById: async (appointmentId) => {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        throw new Error(`Unable to find appointement ${appointmentId}`);
      }
      return appointment.toObject();
    },
    updateStatusMailOpenedByCandidat: async (requestId) => {
      const retrievedData = await Appointment.findById(requestId);
      retrievedData.email_premiere_demande_candidat_ouvert = true;
      return Appointment.findOneAndUpdate({ _id: requestId }, retrievedData, { new: true });
    },
    updateStatusMailOpenedByCentre: async (requestId) => {
      const retrievedData = await Appointment.findById(requestId);
      retrievedData.email_premiere_demande_cfa_ouvert = true;
      return Appointment.findOneAndUpdate({ _id: requestId }, retrievedData, { new: true });
    },
    updateAppointment: (requestId, values) => {
      return Appointment.findOneAndUpdate({ _id: requestId }, values, { new: true });
    },
  };
};
