const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const Joi = require("joi");
const { Request, Candidat } = require("../../common/model/index");
const logger = require("../../common/logger");
const moment = require("moment");

/**
 * Schema for validation
 */
const userRequestSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required(),

  requestFoncId: Joi.string(),
  motivations: Joi.string().default(""),
  centreId: Joi.string().required(),
  trainingId: Joi.string().required(),
  referrer: Joi.string().required(),
});

module.exports = () => {
  const router = express.Router();
  router.post(
    "/",
    tryCatch(async (req, res) => {
      await userRequestSchema.validateAsync(req.body, { abortEarly: false });

      const item = req.body;
      logger.info("Adding new user and new request: ", item);

      const candidatToAdd = new Candidat({
        firstname: item.firstname,
        lastname: item.lastname,
        phone: item.phone,
        email: item.email,
      });
      const candidatIsAdded = await candidatToAdd.save();

      if (candidatIsAdded !== null) {
        const requestToAdd = new Request({
          candidatId: candidatIsAdded._id,

          requestFoncId: "1",
          motivations: item.motivations,
          centreId: item.centreId,
          trainingId: item.trainingId,
          referrer: item.referrer,
          createdAt: moment(),

          answerCentreAt: "",
          statusRequest: "",
          statusCandidatIsContactedByCentre: false,
          statusMailIsReceivedByCentre: false,
          statusMailIsReceivedByCandidat: false,
          statusMailIsOpenedByCandidat: false,
          statusMailIsOpenedByCentre: false,
        });
        await requestToAdd.save();

        // return updated list
        res.json(candidatIsAdded, requestToAdd);
      }

      // return updated list
      res.json("error");
    })
  );
  return router;
};
