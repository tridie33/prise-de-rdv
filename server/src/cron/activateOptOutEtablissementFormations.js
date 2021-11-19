const path = require("path");
const logger = require("../common/logger");
const config = require("../../config");
const { dayjs } = require("../http/utils/dayjs");
const { optMode } = require("../common/model/constants/etablissement");
const { referrers } = require("../common/model/constants/referrers");
const { mailType } = require("../common/model/constants/etablissement");

/**
 * @description Active all etablissement's formations that have subscribed to opt-out.
 * @returns {Promise<void>}
 */
const activateOptOutEtablissementFormations = async ({ etablissements, widgetParameters, mailer }) => {
  logger.info("Cron #activateOptOutEtablissementFormations started.");

  // Opt-out etablissement to activate
  const etablissementsToActivate = await etablissements.find({
    opt_out_will_be_activated_at: {
      $lte: dayjs().toDate(),
    },
    opt_out_refused_at: null,
    opt_out_activated_at: null,
    opt_mode: optMode.OPT_OUT,
  });

  // Activate all formations, for all referrers that have a mail
  await Promise.all(
    etablissementsToActivate.map(async (etablissement) => {
      await Promise.all([
        widgetParameters.updateMany(
          {
            etablissement_siret: etablissement.siret_formateur,
            email_rdv: { $nin: [null, ""] },
          },
          {
            referrers: Object.values(referrers).map((referrer) => referrer.code),
          }
        ),
        etablissements.findOneAndUpdate(
          {
            _id: etablissement._id,
          },
          { opt_out_activated_at: dayjs().toDate() }
        ),
      ]);

      // Send email
      const { messageId } = await mailer.sendEmail(
        etablissement.email_decisionnaire,
        `C'est parti pour améliorer le sourcing de vos candidats !`,
        path.join(__dirname, `../assets/templates/mail-cfa-optout-start.mjml.ejs`),
        {
          images: {
            peopleLaptop: `${config.publicUrl}/assets/girl_laptop.png?raw=true`,
            gouvernementLogo: `${config.publicUrl}/assets/gouvernement_logo.png?raw=true`,
            optOutLbaIntegrationExample: `${config.publicUrl}/assets/exemple_integration_lba.png?raw=true`,
            informationIcon: `${config.publicUrl}/assets/icon_warning_orange.png?raw=true`,
          },
          etablissement: {
            name: etablissement.raison_sociale,
            address: etablissement.adresse,
            postalCode: etablissement.code_postal,
            ville: etablissement.localite,
            siret: etablissement.siret_formateur,
            linkToUnsubscribe: `${config.publicUrl}/form/opt-out/unsubscribe/${etablissement._id}`,
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
              campaign: mailType.OPT_OUT_STARTING,
              status: null,
              message_id: messageId,
              email_sent_at: dayjs().toDate(),
            },
          },
        }
      );
    })
  );

  logger.info("Cron #activateOptOutEtablissementFormations done.");
};

module.exports = {
  activateOptOutEtablissementFormations,
};
