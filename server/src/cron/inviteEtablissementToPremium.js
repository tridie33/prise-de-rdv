const path = require("path");
const logger = require("../common/logger");
const config = require("../../config");
const { dayjs } = require("../http/utils/dayjs");
const { mailType } = require("../common/model/constants/etablissement");

/**
 * @description Invite all "etablissements" to Premium.
 * @returns {Promise<void>}
 */
const inviteEtablissementToPremium = async ({ etablissements, mailer }) => {
  logger.info("Cron #inviteEtablissementToPremium started.");

  const etablissementsActivated = await etablissements
    .find({
      email_decisionnaire: {
        $ne: null,
      },
      "mailing.campaign": { $ne: mailType.PREMIUM_INVITE },
    })
    .limit(255);

  for (const etablissement of etablissementsActivated) {
    // Invite all etablissements only in production environment
    const { messageId } = await mailer.sendEmail(
      etablissement.email_decisionnaire,
      `Optimisez le sourcing de vos candidats sur Parcoursup !`,
      path.join(__dirname, `../assets/templates/mail-cfa-premium-invite.mjml.ejs`),
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
            campaign: mailType.PREMIUM_INVITE,
            status: null,
            message_id: messageId,
            email_sent_at: dayjs().toDate(),
          },
        },
      }
    );
  }

  logger.info("Cron #inviteEtablissementToPremium done.");
};

module.exports = {
  inviteEtablissementToPremium,
};
