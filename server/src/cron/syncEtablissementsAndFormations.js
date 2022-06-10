const { referrers } = require("../common/model/constants/referrers");
const logger = require("../common/logger");
const { dayjs } = require("../http/utils/dayjs");
const { getFormations } = require("../http/utils/catalogue");
const { isValidEmail } = require("../common/utils/isValidEmail");

/**
 * @description Gets Catalogue etablissments informations and insert in etablissement collection.
 * @returns {Promise<void>}
 */
const syncEtablissementsAndFormations = async ({ etablissements, widgetParameters }) => {
  logger.info("Cron #syncEtablissementsAndFormations started.");

  const batchSize = 50;
  let response;

  do {
    const page = response?.pagination?.page ? Number(response?.pagination?.page) + 1 : 1;

    logger.debug(`Fetch catalogue page: ${page}`);
    response = await getFormations({}, page, batchSize, false);

    await Promise.all(
      response.formations.map(async (formation) => {
        const [widgetParameter, etablissement] = await Promise.all([
          widgetParameters.findOne({
            cle_ministere_educatif: formation.cle_ministere_educatif,
          }),
          etablissements.findOne({ siret_formateur: formation.etablissement_formateur_siret }),
        ]);

        // Activate opt_out referrers
        const referrersToActivate = [];
        if (etablissement?.opt_out_activated_at) {
          referrersToActivate.push(referrers.LBA.code);
          referrersToActivate.push(referrers.ONISEP.code);
          referrersToActivate.push(referrers.PFR_PAYS_DE_LA_LOIRE.code);
        }

        // Activate premium referrers
        if (etablissement?.premium_activated_at) {
          referrersToActivate.push(referrers.PARCOURSUP.code);
        }

        if (widgetParameter) {
          let emailRdv = widgetParameter.email_rdv;

          // Don't override "email_rdv" if this field is true
          if (!widgetParameter?.is_custom_email_rdv) {
            emailRdv = isValidEmail(formation.email) ? formation.email : widgetParameter.email_rdv;
          }

          await widgetParameters.updateMany(
            { id_rco_formation: formation.id_rco_formation },
            {
              id_catalogue: formation._id,
              email_rdv: isValidEmail(emailRdv) ? emailRdv : null,
              id_parcoursup: formation.parcoursup_id,
              cle_ministere_educatif: formation.cle_ministere_educatif,
              etablissement_raison_sociale: formation.etablissement_formateur_entreprise_raison_sociale,
              formation_cfd: formation.cfd,
              code_postal: formation.code_postal,
              formation_intitule: formation.intitule_long,
              referrers: isValidEmail(emailRdv) ? referrersToActivate : [],
              etablissement_siret: formation.etablissement_formateur_siret,
              catalogue_published: formation.published,
              id_rco_formation: formation.id_rco_formation,
              last_catalogue_sync: dayjs().format(),
              etablissement_formateur_adresse: formation.etablissement_formateur_adresse,
              etablissement_formateur_code_postal: formation.etablissement_formateur_code_postal,
              etablissement_formateur_nom_departement: formation.etablissement_formateur_nom_departement,
              etablissement_formateur_localite: formation.etablissement_formateur_localite,
              lieu_formation_adresse: formation.lieu_formation_adresse,
              etablissement_formateur_siret: formation.etablissement_formateur_siret,
              etablissement_gestionnaire_siret: formation.etablissement_gestionnaire_siret,
              cfd: formation.cfd,
              localite: formation.localite,
            }
          );
        } else {
          await widgetParameters.createParameter({
            id_catalogue: formation._id,
            email_rdv: formation.email || null,
            id_parcoursup: formation.parcoursup_id,
            cle_ministere_educatif: formation.cle_ministere_educatif,
            etablissement_raison_sociale: formation.etablissement_formateur_entreprise_raison_sociale,
            formation_cfd: formation.cfd,
            code_postal: formation.code_postal,
            formation_intitule: formation.intitule_long,
            referrers: isValidEmail(formation.email) ? referrersToActivate : [],
            etablissement_siret: formation.etablissement_formateur_siret,
            catalogue_published: formation.published,
            id_rco_formation: formation.id_rco_formation,
            last_catalogue_sync: dayjs().format(),
            etablissement_formateur_adresse: formation.etablissement_formateur_adresse,
            etablissement_formateur_code_postal: formation.etablissement_formateur_code_postal,
            etablissement_formateur_nom_departement: formation.etablissement_formateur_nom_departement,
            etablissement_formateur_localite: formation.etablissement_formateur_localite,
            lieu_formation_adresse: formation.lieu_formation_adresse,
            etablissement_formateur_siret: formation.etablissement_formateur_siret,
            etablissement_gestionnaire_siret: formation.etablissement_gestionnaire_siret,
            cfd: formation.cfd,
            localite: formation.localite,
          });
        }

        let emailDecisionnaire = etablissement?.email_decisionnaire;
        if (
          formation.etablissement_gestionnaire_courriel &&
          isValidEmail(formation.etablissement_gestionnaire_courriel)
        ) {
          emailDecisionnaire = formation.etablissement_gestionnaire_courriel.toLowerCase();
        }

        // Update etablissement model (upsert)
        return etablissements.updateMany(
          {
            siret_formateur: formation.etablissement_formateur_siret,
          },
          {
            siret_formateur: formation.etablissement_formateur_siret,
            siret_gestionnaire: formation.etablissement_gestionnaire_siret,
            email_decisionnaire: emailDecisionnaire,
            raison_sociale: formation.etablissement_formateur_entreprise_raison_sociale,
            etablissement_formateur_courriel: formation.etablissement_formateur_courriel,
            adresse: formation.etablissement_formateur_adresse,
            code_postal: formation.etablissement_formateur_code_postal,
            localite: formation.etablissement_formateur_localite,
            last_catalogue_sync: dayjs().format(),
          }
        );
      })
    );
  } while (Number(response.pagination.page) !== response?.pagination.nombre_de_page);

  logger.info(`Formations upserted: ${response.pagination.nombre_de_page}`);
  logger.info("Cron #syncEtablissementsAndFormations done.");
};

module.exports = {
  syncEtablissementsAndFormations,
};
