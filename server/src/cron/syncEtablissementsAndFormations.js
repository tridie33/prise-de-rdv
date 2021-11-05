const logger = require("../common/logger");
const { dayjs } = require("../http/utils/dayjs");
const { getFormations } = require("../http/utils/catalogue");
const { optMode } = require("../common/model/constants/etablissement");

/**
 * @description Gets Catalogue etablissments informations and insert in etablissement collection.
 * @returns {Promise<void>}
 */
const syncEtablissementsAndFormations = async ({ etablissements, widgetParameters }) => {
  const batchSize = 1000;
  let response;

  do {
    const page = response?.pagination?.page ? Number(response?.pagination?.page) + 1 : 1;

    logger.debug(`Fetch catalogue page: ${page}`);
    response = await getFormations({}, page, batchSize, false);

    await Promise.all(
      response.formations.map(async (formation) => {
        const [widgetParameter, etablissement] = await Promise.all([
          widgetParameters.getParameterByIdRcoFormation({
            idRcoFormation: formation.id_rco_formation,
          }),
          etablissements.findOne({ siret_formateur: formation.etablissement_formateur_siret }),
        ]);

        if (widgetParameter) {
          // Doesn't update "email_rdv" (if exists) if etablissement has opt_mode == OPT_IN flag
          if (etablissement?.opt_mode === optMode.OPT_IN) {
            await widgetParameters.updateMany(
              { id_rco_formation: formation.id_rco_formation },
              {
                etablissement_raison_sociale: formation.etablissement_formateur_entreprise_raison_sociale,
                formation_cfd: formation.cfd,
                code_postal: formation.code_postal,
                formation_intitule: formation.intitule_long,
                referrers: widgetParameter.referrers,
                etablissement_siret: formation.etablissement_formateur_siret,
                catalogue_published: formation.published,
                id_rco_formation: formation.id_rco_formation,
                email_rdv: widgetParameter.email_rdv || formation.email,
                last_catalogue_sync: dayjs().format(),
              }
            );
          } else {
            await widgetParameters.updateMany(
              { id_rco_formation: formation.id_rco_formation },
              {
                etablissement_raison_sociale: formation.etablissement_formateur_entreprise_raison_sociale,
                formation_cfd: formation.cfd,
                code_postal: formation.code_postal,
                formation_intitule: formation.intitule_long,
                referrers: widgetParameter.referrers,
                etablissement_siret: formation.etablissement_formateur_siret,
                catalogue_published: formation.published,
                id_rco_formation: formation.id_rco_formation,
                email_rdv: formation.email,
                last_catalogue_sync: dayjs().format(),
              }
            );
          }
        } else {
          await widgetParameters.createParameter({
            etablissement_raison_sociale: formation.etablissement_formateur_entreprise_raison_sociale,
            formation_cfd: formation.cfd,
            code_postal: formation.code_postal,
            formation_intitule: formation.intitule_long,
            referrers: [],
            etablissement_siret: formation.etablissement_formateur_siret,
            catalogue_published: formation.published,
            id_rco_formation: formation.id_rco_formation,
            email_rdv: formation.email,
            last_catalogue_sync: dayjs().format(),
          });
        }

        // Update etablissement model
        return etablissements.updateMany(
          {
            siret_formateur: formation.etablissement_formateur_siret,
          },
          {
            siret_formateur: formation.etablissement_formateur_siret,
            siret_gestionnaire: formation.etablissement_gestionnaire_siret,
            raison_sociale: formation.etablissement_formateur_entreprise_raison_sociale,
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
