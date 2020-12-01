const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const Joi = require("joi");
const { Request } = require("../../common/model/index");
const logger = require("../../common/logger");
const Boom = require("boom");
const config = require("config");
const path = require("path");

/**
 * Schema for validation
 */
const userRequestSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required(),
  role: Joi.string().required(),

  motivations: Joi.string().default(""),
  centreId: Joi.string().required(),
  trainingId: Joi.string().required(),
  referrer: Joi.string().required(),
});

const getEmailTemplate = (type = "mail-candiat") => {
  return path.join(__dirname, `../../assets/templates/${type}.mjml.ejs`);
};

module.exports = ({ users, mailer }) => {
  const router = express.Router();

  router.post(
    "/",
    tryCatch(async (req, res) => {
      await userRequestSchema.validateAsync(req.body, { abortEarly: false });

      const item = req.body;
      logger.info("Adding new user and new request: ", item);

      const { firstname, lastname, phone, email, role } = item;

      const user = await users.createUser(email, "NA", {
        firstname,
        lastname,
        phone,
        email,
        role,
      });

      if (!user) {
        throw Boom.badRequest("something went wrong during db operation");
      }

      const { motivations, centreId: etablissement_id, trainingId: formation_id, referrer } = item;

      const request = new Request({
        candidat_id: user._id,
        motivations,
        etablissement_id,
        formation_id,
        referrer,
      });
      await request.save();

      await mailer.sendEmail(
        user.email,
        `[${config.env} Prise de rendez-vous] Demande de prise de rendez-vous`,
        getEmailTemplate("mail-candiat"),
        {} // Payload
      );

      res.json({
        ...user._doc,
        ...request._doc,
      });
    })
  );
  return router;
};
