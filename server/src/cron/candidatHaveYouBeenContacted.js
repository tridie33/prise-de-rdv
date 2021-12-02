const path = require("path");
const logger = require("../common/logger");
const config = require("../../config");
const { dayjs } = require("../http/utils/dayjs");
const { getReferrerById } = require("../common/model/constants/referrers");
const { mailType } = require("../common/model/constants/appointments");

/**
 * @description Sends a mail to the candidat in order to know if he has been contacter or not.
 * @returns {Promise<void>}
 */
const candidatHaveYouBeenContacted = async ({ etablissements, widgetParameters, mailer, appointments, users }) => {
  logger.info("Cron #candidatHaveYouBeenContacted started.");

  // Appointments created there are less than 5 days
  const appointmentsToTrigger = await appointments.find({
    created_at: {
      $lte: dayjs().subtract(5, "days").toDate(),
      // Excludes very older appointments
      $gte: dayjs("2021-10-10T00:00:00.486Z").toDate(),
    },
    "candidat_mailing.campaign": { $ne: mailType.CANDIDAT_HAVE_YOU_BEEN_CONTACTED },
  });

  const promises = appointmentsToTrigger.map(async (appointment) => {
    const referrerObj = getReferrerById(appointment.referrer);

    const [user, widgetParameter, etablissement] = await Promise.all([
      users.findOne({ _id: appointment.candidat_id }),
      widgetParameters.findOne({ id_rco_formation: appointment.id_rco_formation }),
      etablissements.findOne({ siret_formateur: appointment.etablissement_id }),
    ]);

    const { messageId } = await mailer.sendEmail(
      user.email,
      `🛎️ Avez-vous été contacté par le centre de formation ?`,
      path.join(__dirname, `../assets/templates/mail-candidat-rdv-have-you-been-contacted.mjml.ejs`),
      {
        images: {
          peopleLaptop: `${config.publicUrl}/assets/man_laptop.png?raw=true`,
          gouvernementLogo: `${config.publicUrl}/assets/gouvernement_logo.png?raw=true`,
          optOutLbaIntegrationExample: `${config.publicUrl}/assets/exemple_integration_lba.png?raw=true`,
          informationIcon: `${config.publicUrl}/assets/icon_warning_orange.png?raw=true`,
          map: `${config.publicUrl}/assets/map.png?raw=true`,
        },
        etablissement: {
          name: etablissement.raison_sociale,
          address: etablissement.adresse,
          postalCode: etablissement.code_postal,
          ville: etablissement.localite,
        },
        formation: {
          intitule: widgetParameter.formation_intitule,
        },
        user: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        },
        appointment: {
          createdAt: dayjs(appointment.created_at).format("DD/MM/YYYY"),
          referrerLink: referrerObj.url,
          referrer: referrerObj.full_name,
        },
        links: {
          confirm: `${config.publicUrl}/appointment/candidat/follow-up/${appointment._id}/confirm`,
          resend: `${config.publicUrl}/appointment/candidat/follow-up/${appointment._id}/resend`,
        },
      },
      config.email
    );

    await appointments.findOneAndUpdate(
      { _id: appointment._id },
      {
        $push: {
          candidat_mailing: {
            campaign: mailType.CANDIDAT_HAVE_YOU_BEEN_CONTACTED,
            status: null,
            message_id: messageId,
            email_sent_at: dayjs().toDate(),
          },
        },
      }
    );
  });

  await Promise.all(promises);

  logger.info("Cron #candidatHaveYouBeenContacted done.");
};

module.exports = {
  candidatHaveYouBeenContacted,
};
