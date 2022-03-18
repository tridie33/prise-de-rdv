const joi = require("joi");
const logger = require("../common/logger");
const { dayjs } = require("../http/utils/dayjs");
const { getFormations } = require("../http/utils/catalogue");

const emailJoiSchema = joi.string().email();

/**
 * @description Gets Catalogue etablissments informations and insert in etablissement collection.
 * @returns {Promise<void>}
 */
const syncEtablissementsAndFormations = async ({ etablissements, widgetParameters }) => {
  logger.info("Cron #syncEtablissementsAndFormations started.");

  const batchSize = 300;
  let response;

  do {
    const page = response?.pagination?.page ? Number(response?.pagination?.page) + 1 : 1;

    logger.debug(`Fetch catalogue page: ${page}`);
    response = await getFormations({}, page, batchSize, false);

    await Promise.all(
      response.formations.map(async (formation) => {
        const widgetParameter = await widgetParameters.getParameterByIdRcoFormation({
          idRcoFormation: formation.id_rco_formation,
        });

        if (widgetParameter) {
          let emailRdv = widgetParameter.email_rdv;

          // Don't override "email_rdv" if this field is true
          if (!widgetParameter?.is_custom_email_rdv) {
            emailRdv = emailJoiSchema.validate(formation.email) ? formation.email : widgetParameter.email_rdv;
          }

          await widgetParameters.updateMany(
            { id_rco_formation: formation.id_rco_formation },
            {
              email_rdv: emailJoiSchema.validate(emailRdv) ? emailRdv : null,
              id_parcoursup: formation.parcoursup_id,
              cle_ministere_educatif: formation.cle_ministere_educatif,
              etablissement_raison_sociale: formation.etablissement_formateur_entreprise_raison_sociale,
              formation_cfd: formation.cfd,
              code_postal: formation.code_postal,
              formation_intitule: formation.intitule_long,
              referrers: emailJoiSchema.validate(emailRdv) ? widgetParameter.referrers : [],
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
            email_rdv: formation.email || null,
            id_parcoursup: formation.parcoursup_id,
            cle_ministere_educatif: formation.cle_ministere_educatif,
            etablissement_raison_sociale: formation.etablissement_formateur_entreprise_raison_sociale,
            formation_cfd: formation.cfd,
            code_postal: formation.code_postal,
            formation_intitule: formation.intitule_long,
            referrers: [],
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

        const etablissement = await etablissements.find({ siret_formateur: formation.etablissement_formateur_siret });

        let emailDecisionnaire = etablissement?.email_decisionnaire;
        if (emailJoiSchema.validate(formation.etablissement_gestionnaire_courriel)) {
          emailDecisionnaire = formation.etablissement_gestionnaire_courriel;
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
