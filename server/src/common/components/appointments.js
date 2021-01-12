const { Request } = require("../../common/model/index");

module.exports = async () => {
  return {
    createAppointment: async (options = {}) => {
      const { candidatId, centreId, trainingId, motivations, referrer } = options;

      const appointment = new Request({
        candidat_id: candidatId,
        motivations,
        etablissement_id: centreId,
        formation_id: trainingId,
        referrer,
      });
      await appointment.save();
      return appointment.toObject();
    },
    updateStatusMailsSend: async (appointmentId) => {
      const appointment = await Request.findById(appointmentId);
      appointment.email_premiere_demande_candidat_envoye = true;
      appointment.email_premiere_demande_cfa_envoye = true;
      const updatedAppointement = await Request.findOneAndUpdate({ _id: appointmentId }, appointment, { new: true });
      return updatedAppointement;
    },
    getAppointmentById: async (appointmentId) => {
      const appointment = await Request.findById(appointmentId);
      if (!appointment) {
        throw new Error(`Unable to find appointement ${appointmentId}`);
      }
      return appointment.toObject();
    },
    updateStatusMailOpenedByCandidat: async (requestId) => {
      const retrievedData = await Request.findById(requestId);
      retrievedData.email_premiere_demande_candidat_ouvert = true;
      const result = await Request.findOneAndUpdate({ _id: requestId }, retrievedData, { new: true });
      return result;
    },
    updateStatusMailOpenedByCentre: async (requestId) => {
      const retrievedData = await Request.findById(requestId);
      retrievedData.email_premiere_demande_cfa_ouvert = true;
      const result = await Request.findOneAndUpdate({ _id: requestId }, retrievedData, { new: true });
      return result;
    },
    updateAppointment: async (requestId, values) => {
      const result = await Request.findOneAndUpdate({ _id: requestId }, values, { new: true });
      return result;
    },
  };
};
