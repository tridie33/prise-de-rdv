const express = require("express");
const passport = require("passport");
const Joi = require("joi");
const { Strategy: LocalAPIKeyStrategy } = require("passport-localapikey");
const config = require("../../../../config");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const { dayjs } = require("../../utils/dayjs");

/**
 * @description Checks "Sendinblue" token.
 * @return {NextFunction}
 */
const checkWebhookToken = () => {
  passport.use(
    new LocalAPIKeyStrategy({}, async (token, done) =>
      done(null, config.smtp.sendinblueToken === token ? { apiKey: token } : false)
    )
  );

  return passport.authenticate("localapikey", { session: false, failWithError: true });
};

/**
 * @description Email controllers.
 * @param {Appointment} appointments
 * @param {Etablissement} etablissements
 * @return {Router}
 */
module.exports = ({ appointments, etablissements }) => {
  const router = express.Router();

  /**
   * @description Update email status.
   * @method {POST}
   * @returns {Promise<void>}
   */
  router.post(
    "/webhook",
    checkWebhookToken(),
    tryCatch(async (req, res) => {
      const parameters = await Joi.object({
        event: Joi.string().required(),
        "message-id": Joi.string().required(),
        date: Joi.string().required(),
      })
        .unknown()
        .validateAsync(req.body, { abortEarly: false });

      const messageId = parameters["message-id"];
      const eventDate = dayjs.utc(parameters["date"]).tz("Europe/Paris").toDate();

      const appointment = await appointments.findOne({
        $or: [
          {
            email_premiere_demande_candidat_message_id: messageId,
          },
          {
            email_premiere_demande_cfa_message_id: messageId,
          },
        ],
      });

      // If mail sent from appointment model
      if (appointment) {
        if (appointment.email_premiere_demande_candidat_message_id === messageId) {
          await appointments.updateAppointment(appointment._id, {
            email_premiere_demande_candidat_statut: parameters.event,
            email_premiere_demande_cfa_statut_date: eventDate,
          });
        } else if (appointment.email_premiere_demande_cfa_message_id === messageId) {
          await appointments.updateAppointment(appointment._id, {
            email_premiere_demande_cfa_statut: parameters.event,
            email_premiere_demande_candidat_statut_date: eventDate,
          });
        }
      }

      const [etablissementFound] = await etablissements.find({ "mailing.messageId": { $regex: messageId } });

      // If mail sent from etablissement model
      if (etablissementFound) {
        const previousEmail = etablissementFound.mailing.find((mail) => mail.messageId.includes(messageId));

        await etablissementFound.update({
          $push: {
            mailing: {
              campaign: previousEmail.campaign,
              status: parameters.event,
              message_id: previousEmail.message_id,
              webhook_status_at: eventDate,
            },
          },
        });
      }

      return res.json({});
    })
  );

  return router;
};
