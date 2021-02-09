const { Appointment } = require("../../common/model/index");

module.exports = async () => {
  return {
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
    updateStatusMailsSend: async (appointmentId) => {
      const appointment = await Appointment.findById(appointmentId);
      appointment.email_premiere_demande_candidat_envoye = true;
      appointment.email_premiere_demande_cfa_envoye = true;
      const updatedAppointement = await Appointment.findOneAndUpdate({ _id: appointmentId }, appointment, {
        new: true,
      });
      return updatedAppointement;
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
      return await Appointment.findOneAndUpdate({ _id: requestId }, retrievedData, { new: true });
    },
    updateStatusMailOpenedByCentre: async (requestId) => {
      const retrievedData = await Appointment.findById(requestId);
      retrievedData.email_premiere_demande_cfa_ouvert = true;
      return await Appointment.findOneAndUpdate({ _id: requestId }, retrievedData, { new: true });
    },
    updateAppointment: async (requestId, values) => {
      return await Appointment.findOneAndUpdate({ _id: requestId }, values, { new: true });
    },
  };
};
