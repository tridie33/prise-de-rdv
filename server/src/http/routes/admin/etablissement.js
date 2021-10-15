const express = require("express");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const { Etablissement } = require("../../../common/model");
const { enableAllEtablissementFormations } = require("../../../http/utils/optIn");
const { optMode } = require("../../../common/model/constants/etablissement");
const { referrers } = require("../../../common/model/constants/referrers");

/**
 * @description Etablissement Router.
 */
module.exports = ({ etablissements }) => {
  const router = express.Router();

  /**
   * Gets all etablissements
   * */
  router.get(
    "/",
    tryCatch(async (req, res) => {
      let qs = req.query;
      const query = qs && qs.query ? JSON.parse(qs.query) : {};
      const page = qs && qs.page ? qs.page : 1;
      const limit = qs && qs.limit ? parseInt(qs.limit, 50) : 50;

      const allData = await Etablissement.paginate(query, { page, limit });

      return res.send({
        etablissements: allData.docs,
        pagination: {
          page: allData.page,
          resultats_par_page: limit,
          nombre_de_page: allData.pages,
          total: allData.total,
        },
      });
    })
  );

  /**
   * Gets an etablissement from its siret_formateur.
   */
  router.get(
    "/siret-formateur/:siret",
    tryCatch(async ({ params }, res) => {
      const etablissement = await etablissements.findOne({ siret_formateur: params.siret });

      if (!etablissement) {
        return res.sendStatus(404);
      }

      return res.send(etablissement);
    })
  );

  /**
   * Gets an etablissement from its id.
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
   * Creates one or multiple etablissements.
   */
  router.post(
    "/",
    tryCatch(async ({ body }, res) => {
      const { etablissements } = body;

      let output;
      if (etablissements) {
        output = await Promise.all(etablissements.map((etablissement) => etablissements.create(etablissement)));
      } else {
        output = await etablissements.create(body);
      }

      return res.send(output);
    })
  );

  /**
   * Updates an etablissement.
   */
  router.put(
    "/:id",
    tryCatch(async ({ body, params }, res) => {
      const etablissement = await etablissements.findById(params.id);

      let output;
      // Enable all formations that have a catalogue email
      if (etablissement?.opt_mode === null && body?.opt_mode === optMode.OPT_IN) {
        await enableAllEtablissementFormations(
          etablissement.siret_formateur,
          Object.values(referrers).map((referrer) => referrer.code)
        );
        output = await etablissements.findById(params.id);
      } else {
        output = await etablissements.findByIdAndUpdate(params.id, body, { new: true });
      }

      return res.send(output);
    })
  );

  /**
   * Deletes an etablissement.
   */
  router.delete(
    "/:id",
    tryCatch(async ({ params }, res) => {
      await etablissements.findByIdAndDelete(params.id);

      return res.sendStatus(204);
    })
  );

  return router;
};
