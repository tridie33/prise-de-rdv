const path = require("path");
const logger = require("../common/logger");
const config = require("../../config");
const { dayjs } = require("../http/utils/dayjs");
const { mailType, optMode } = require("../common/model/constants/etablissement");
const { isValidEmail } = require("../common/utils/isValidEmail");

/**
 * @description Invite all "etablissements" to Premium (followup).
 * @returns {Promise<void>}
 */
const inviteEtablissementToPremiumFollowUp = async ({ etablissements, mailer }) => {
  logger.info("Cron #inviteEtablissementToPremiumFollowUp started.");

  const etablissementsFound = await etablissements.find({
    email_decisionnaire: {
      $ne: null,
    },
    opt_mode: optMode.OPT_OUT,
    opt_out_will_be_activated_at: {
      $ne: null,
    },
    premium_activated_at: null,
    premium_refused_at: null,
    premium_invited_at: {
      $ne: null,
      $lte: dayjs().subtract(10, "days").toDate(),
    },
    "mailing.campaign": {
      $ne: mailType.PREMIUM_INVITE_FOLLOW_UP,
    },
  });

  for (const etablissement of etablissementsFound) {
    if (!etablissement.email_decisionnaire || !isValidEmail(etablissement.email_decisionnaire)) {
      continue;
    }

    // Invite all etablissements only in production environment
    const { messageId } = await mailer.sendEmail(
      etablissement.email_decisionnaire,
      `Rendez-vous Apprentissage est disponible sur Parcoursup`,
      path.join(__dirname, `../assets/templates/mail-cfa-premium-invite-followup.mjml.ejs`),
      {
        images: {
          peopleLaptop: `${config.publicUrl}/assets/girl_laptop.png?raw=true`,
          parcoursupIntegrationExample: `${config.publicUrl}/assets/exemple_integration_parcoursup.jpg?raw=true`,
        },
        etablissement: {
          email: etablissement.email_decisionnaire,
          activatedAt: dayjs(etablissement.opt_out_will_be_activated_at).format("DD/MM"),
          linkToForm: `${config.publicUrl}/form/premium/${etablissement._id}`,
        },
      },
      config.email
    );

    await etablissements.updateOne(
      { siret_formateur: etablissement.siret_formateur },
      {
        premium_invited_at: dayjs().toDate(),
        $push: {
          mailing: {
            campaign: mailType.PREMIUM_INVITE_FOLLOW_UP,
            status: null,
            message_id: messageId,
            email_sent_at: dayjs().toDate(),
          },
        },
      }
    );
  }

  logger.info("Cron #inviteEtablissementToPremiumFollowUp done.");
};

module.exports = {
  inviteEtablissementToPremiumFollowUp,
};
