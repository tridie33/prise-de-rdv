const express = require("express");
const Joi = require("joi");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const { WidgetParameter } = require("../../../common/model");
const logger = require("../../../common/logger");
const { getReferrerById } = require("../../../common/model/constants/referrers");

const widgetParameterSchema = Joi.object({
  etablissement_siret: Joi.string().required(),
  etablissement_raison_sociale: Joi.string().required(),
  formation_intitule: Joi.string().required(),
  formation_cfd: Joi.string().required(),
  code_postal: Joi.string().required(),
  email_rdv: Joi.string().required(),
  referrers: Joi.array().items(Joi.number()),
  id_rco_formation: Joi.string().required(),
});

const widgetParameterReferrerUpdateBatchSchema = Joi.object({
  referrers: Joi.array().items(Joi.number()).required(),
});

/**
 * Sample entity route module for GET
 */
module.exports = ({ widgetParameters }) => {
  const router = express.Router();

  /**
   * Get all widgetParameters widgetParameters GET
   * */
  router.get(
    "/parameters",
    tryCatch(async (req, res) => {
      let qs = req.query;
      const query = qs && qs.query ? JSON.parse(qs.query) : {};
      const page = qs && qs.page ? qs.page : 1;
      const limit = qs && qs.limit ? parseInt(qs.limit, 10) : 50;

      const allData = await WidgetParameter.paginate(query, { page, limit });

      const parameters = allData.docs.map((parameter) => ({
        ...parameter._doc,
        referrers: parameter.referrers.map(getReferrerById),
      }));

      return res.send({
        parameters,
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
   * Get all widgetParameters widgetParameters/count GET
   */
  router.get(
    "/parameters/count",
    tryCatch(async (req, res) => {
      let qs = req.query;
      const query = qs && qs.query ? JSON.parse(qs.query) : {};
      const total = await WidgetParameter.countDocuments(query);

      res.send({ total });
    })
  );

  /**
   * Get widgetParameter widgetParameters / GET
   */
  router.get(
    "/",
    tryCatch(async (req, res) => {
      let qs = req.query;
      const query = qs && qs.query ? JSON.parse(qs.query) : {};
      const retrievedData = await WidgetParameter.findOne(query);
      if (retrievedData) {
        res.send(retrievedData);
      } else {
        res.send({ message: `Item doesn't exist` });
      }
    })
  );

  /**
   * Get widgetParameters by id getWidgetParametersById /{id} GET
   */
  router.get(
    "/:id",
    tryCatch(async (req, res) => {
      const itemId = req.params.id;
      const retrievedData = await WidgetParameter.findById(itemId);
      if (retrievedData) {
        res.send(retrievedData);
      } else {
        res.send({ message: `Item ${itemId} doesn't exist` });
      }
    })
  );

  /**
   * Add/Post an item validated by schema createParameter /widgetParameter POST
   */
  router.post(
    "/",
    tryCatch(async ({ body }, res) => {
      await widgetParameterSchema.validateAsync(body, { abortEarly: false });
      logger.info("Adding new ACL Rule : ", body);
      const result = await widgetParameters.createParameter(body);
      res.send(result);
    })
  );

  /**
   * Updates all widgetParameter referrers.
   */
  router.put(
    "/referrers",
    tryCatch(async ({ body }, res) => {
      await widgetParameterReferrerUpdateBatchSchema.validateAsync(body, { abortEarly: false });
      logger.info("Updating items: ", body);

      // Throw an error if referrer code isn't existing
      body.referrers.map(getReferrerById);

      const parameters = await widgetParameters.updateMany({
        where: { referrers: { $ne: [] } },
        body: { $set: { referrers: body.referrers } },
      });

      res.send(parameters);
    })
  );

  /**
   * Update an item validated by schema updateParameter updateParameter/{id} PUT
   */
  router.put(
    "/:id",
    tryCatch(async ({ body, params }, res) => {
      await widgetParameterSchema.validateAsync(body, { abortEarly: false });
      logger.info("Updating new item: ", body);
      const result = await widgetParameters.updateParameter(params.id, body);
      res.send(result);
    })
  );

  /**
   * Delete an item by id deleteParameter widgetParameter/{id} DELETE
   */
  router.delete(
    "/:id",
    tryCatch(async ({ params }, res) => {
      logger.info("Deleting new item: ", params.id);
      await widgetParameters.deleteParameter(params.id);
      res.send({ message: `Item ${params.id} deleted !` });
    })
  );

  return router;
};
