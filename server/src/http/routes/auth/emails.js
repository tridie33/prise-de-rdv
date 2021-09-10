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
 * @return {Router}
 */
module.exports = ({ appointments }) => {
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
      })
        .unknown()
        .validateAsync(req.body, { abortEarly: false });

      const appointment = await appointments.findOne({
        $or: [
          {
            email_premiere_demande_candidat_message_id: parameters["message-id"],
          },
          {
            email_premiere_demande_cfa_message_id: parameters["message-id"],
          },
        ],
      });

      if (appointment.email_premiere_demande_candidat_message_id === parameters["message-id"]) {
        await appointments.updateAppointment(appointment._id, {
          email_premiere_demande_candidat_statut: parameters.event,
          email_premiere_demande_cfa_statut_date: dayjs().format(),
        });
      } else if (appointment.email_premiere_demande_cfa_message_id === parameters["message-id"]) {
        await appointments.updateAppointment(appointment._id, {
          email_premiere_demande_cfa_statut: parameters.event,
          email_premiere_demande_candidat_statut_date: dayjs().format(),
        });
      }

      return res.json({});
    })
  );

  return router;
};
