const express = require("express");
const Joi = require("joi");
const path = require("path");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const { dayjs } = require("../../utils/dayjs.js");
const { mailType } = require("../../../common/model/constants/etablissement");
const config = require("../../../../config");

const optOutUnsubscribeSchema = Joi.object({
  opt_out_question: Joi.string().optional(),
});

/**
 * @description Etablissement Router.
 */
module.exports = ({ etablissements, mailer, widgetParameters }) => {
  const router = express.Router();

  /**
   * @description Returns etablissement from its id.
   */
  router.get(
    "/:id",
    tryCatch(async (req, res) => {
      const etablissement = await etablissements.findById(req.params.id);

      if (!etablissement) {
        return res.sendStatus(404);
      }

      return res.send(etablissement);
    })
  );

  /**
   * @description Unsubscribe to "opt-out".
   */
  router.post(
    "/:id/opt-out/unsubscribe",
    tryCatch(async (req, res) => {
      const { opt_out_question } = await optOutUnsubscribeSchema.validateAsync(req.body, { abortEarly: false });

      let etablissement = await etablissements.findById(req.params.id);

      if (!etablissement) {
        return res.sendStatus(404);
      }

      if (etablissement.opt_out_refused_at) {
        return res.sendStatus(400);
      }

      if (opt_out_question) {
        await etablissements.findByIdAndUpdate(req.params.id, {
          opt_out_question,
        });

        etablissement = await etablissements.findById(req.params.id);

        // Sends email to the team with the question
        await mailer.sendEmail(
          config.email,
          `Un CFA se pose une question concernant l'opt-out"`,
          path.join(__dirname, `../../../assets/templates/mail-rdva-optout-unsubscription-question.mjml.ejs`),
          {
            images: {
              peopleLaptop: `${config.publicUrl}/assets/man_laptop.png?raw=true`,
              gouvernementLogo: `${config.publicUrl}/assets/gouvernement_logo.png?raw=true`,
            },
            etablissement: {
              name: etablissement.raison_sociale,
              address: etablissement.adresse,
              postalCode: etablissement.code_postal,
              ville: etablissement.localite,
              opt_out_question: etablissement.opt_out_question,
            },
            user: {
              destinataireEmail: etablissement.email_decisionnaire,
            },
          },
          etablissement.email_decisionnaire
        );

        return res.send(etablissement);
      }

      // If opt-out is already running but user unsubscribe, disable all formations
      if (etablissement.opt_out_activated_at && dayjs(etablissement.opt_out_activated_at).isBefore(dayjs())) {
        // Disable all formations
        await widgetParameters.updateMany(
          {
            etablissement_siret: etablissement.siret_formateur,
          },
          {
            referrers: [],
          }
        );
      }

      await etablissements.findByIdAndUpdate(req.params.id, {
        opt_out_refused_at: dayjs().toDate(),
      });

      // Sends unsubscription email to "décisionnaire"
      const { messageId } = await mailer.sendEmail(
        etablissement.email_decisionnaire,
        `Désinscription au service "RDV Apprentissage"`,
        path.join(__dirname, `../../../assets/templates/mail-cfa-optout-unsubscription.mjml.ejs`),
        {
          images: {
            peopleLaptop: `${config.publicUrl}/assets/man_laptop.png?raw=true`,
            gouvernementLogo: `${config.publicUrl}/assets/gouvernement_logo.png?raw=true`,
          },
          etablissement: {
            name: etablissement.raison_sociale,
            address: etablissement.adresse,
            postalCode: etablissement.code_postal,
            ville: etablissement.localite,
          },
          user: {
            destinataireEmail: etablissement.email_decisionnaire,
          },
        },
        config.email
      );

      await etablissements.findOneAndUpdate(
        { _id: etablissement._id },
        {
          $push: {
            mailing: {
              campaign: mailType.OPT_OUT_UNSUBSCRIPTION_CONFIRMATION,
              status: null,
              message_id: messageId,
              email_sent_at: dayjs().toDate(),
            },
          },
        }
      );

      etablissement = await etablissements.findById(req.params.id);

      return res.send(etablissement);
    })
  );

  return router;
};
