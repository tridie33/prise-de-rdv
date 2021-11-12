const logger = require("../common/logger");
const { dayjs } = require("../http/utils/dayjs");
const { optMode } = require("../common/model/constants/etablissement");
const { referrers } = require("../common/model/constants/referrers");

/**
 * @description Active all etablissement's formations that have subscribed to opt-out.
 * @returns {Promise<void>}
 */
const activateOptOutEtablissementFormations = async ({ etablissements, widgetParameters }) => {
  logger.info("Cron #activateOptOutEtablissementFormations started.");

  // Opt-out etablissement to activate
  const etablissementsToActivate = await etablissements.find({
    opt_out_will_be_activated_at: {
      $lte: dayjs().toDate(),
    },
    opt_out_activated_at: null,
    opt_mode: optMode.OPT_OUT,
  });

  // Activate all formations, for all referrers that have a mail
  await Promise.all(
    etablissementsToActivate.map(async (etablissement) =>
      Promise.all([
        widgetParameters.updateMany(
          {
            etablissement_siret: etablissement.siret_formateur,
            email_rdv: { $nin: [null, ""] },
          },
          {
            referrers: Object.values(referrers).map((referrer) => referrer.code),
          }
        ),
        etablissements.updateMany(
          {
            siret_formateur: etablissement.siret_formateur,
          },
          { opt_out_activated_at: dayjs().toDate() }
        ),
      ])
    )
  );

  logger.info("Cron #activateOptOutEtablissementFormations done.");
};

module.exports = {
  activateOptOutEtablissementFormations,
};
