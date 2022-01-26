const Boom = require("boom");
const express = require("express");
const Joi = require("joi");
const path = require("path");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const { dayjs } = require("../../utils/dayjs.js");
const { referrers } = require("../../../common/model/constants/referrers");
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
   * @description Confirm that the etablissement wants to be published on Parcoursup.
   */
  router.post(
    "/:id/premium/accept",
    tryCatch(async (req, res) => {
      const etablissement = await etablissements.findById(req.params.id);

      if (!etablissement) {
        throw Boom.badRequest("Etablissement not found.");
      }

      if (etablissement.premium_refused_at) {
        throw Boom.badRequest("Premium already refused.");
      }

      if (etablissement.premium_activated_at) {
        throw Boom.badRequest("Premium already activated.");
      }

      const { messageId } = await mailer.sendEmail(
        etablissement.email_decisionnaire,
        `Activation du service “RDV Apprentissage” sur Parcoursup`,
        path.join(__dirname, `../../../assets/templates/mail-cfa-premium-start.mjml.ejs`),
        {
          images: {
            peopleLaptop: `${config.publicUrl}/assets/man_laptop.png?raw=true`,
          },
          etablissement: {
            name: etablissement.raison_sociale,
            address: etablissement.adresse,
            postalCode: etablissement.code_postal,
            ville: etablissement.localite,
            siret: etablissement.siret_formateur,
            email: etablissement.email_decisionnaire,
          },
          activationDate: dayjs().format("DD/MM"),
        },
        config.email
      );

      const [widgetParametersFound] = await Promise.all([
        widgetParameters.find({ etablissement_siret: etablissement.siret_formateur }),
        etablissements.findOneAndUpdate(
          { _id: etablissement._id },
          {
            $push: {
              mailing: {
                campaign: mailType.PREMIUM_STARTING,
                status: null,
                message_id: messageId,
                email_sent_at: dayjs().toDate(),
              },
            },
            premium_activated_at: dayjs().toDate(),
          }
        ),
      ]);

      const [etablissementUpdated] = await Promise.all([
        etablissements.findById(req.params.id),
        ...widgetParametersFound.map((widgetParameter) =>
          widgetParameters.updateMany(
            { _id: widgetParameter._id, email_rdv: { $nin: [null, ""] } },
            {
              referrers: [...new Set([...widgetParameter.referrers, referrers.PARCOURSUP.code])],
            }
          )
        ),
      ]);

      return res.send(etablissementUpdated);
    })
  );

  /**
   * @description Refuses Premium
   */
  router.post(
    "/:id/premium/refuse",
    tryCatch(async (req, res) => {
      const etablissement = await etablissements.findById(req.params.id);

      if (!etablissement) {
        throw Boom.badRequest("Etablissement not found.");
      }

      if (etablissement.premium_refused_at) {
        throw Boom.badRequest("Premium already refused.");
      }

      if (etablissement.premium_activated_at) {
        throw Boom.badRequest("Premium already activated.");
      }

      const { messageId } = await mailer.sendEmail(
        etablissement.email_decisionnaire,
        `Le service “RDV Apprentissage” ne sera pas activé sur Parcoursup`,
        path.join(__dirname, `../../../assets/templates/mail-cfa-premium-refused.mjml.ejs`),
        {
          images: {
            peopleLaptop: `${config.publicUrl}/assets/man_laptop.png?raw=true`,
            informationIcon: `${config.publicUrl}/assets/icon_warning_orange.png?raw=true`,
          },
          etablissement: {
            name: etablissement.raison_sociale,
            address: etablissement.adresse,
            postalCode: etablissement.code_postal,
            ville: etablissement.localite,
            siret: etablissement.siret_formateur,
            email: etablissement.email_decisionnaire,
          },
          activationDate: dayjs().format("DD/MM"),
        },
        config.email
      );

      const [widgetParametersFound] = await Promise.all([
        widgetParameters.find({ etablissement_siret: etablissement.siret_formateur }),
        etablissements.findOneAndUpdate(
          { _id: etablissement._id },
          {
            $push: {
              mailing: {
                campaign: mailType.PREMIUM_REFUSED,
                status: null,
                message_id: messageId,
                email_sent_at: dayjs().toDate(),
              },
            },
            premium_refused_at: dayjs().toDate(),
          }
        ),
      ]);

      const [etablissementUpdated] = await Promise.all([
        etablissements.findById(req.params.id),
        ...widgetParametersFound.map((widgetParameter) =>
          widgetParameters.updateParameter(widgetParameter._id, {
            referrers: [...new Set([...widgetParameter.referrers, referrers.PARCOURSUP.code])],
          })
        ),
      ]);

      return res.send(etablissementUpdated);
    })
  );

  /**
   * @description OptOutUnsubscribe to "opt-out".
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
            siret: etablissement.siret_formateur,
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
