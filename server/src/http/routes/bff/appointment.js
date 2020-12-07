const axios = require("axios");
const express = require("express");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const path = require("path");
const Joi = require("joi");
const Boom = require("boom");
const config = require("config");

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

module.exports = ({ users, appointements, mailer }) => {
  const router = express.Router();
  const catalogueHost = "https://c7a5ujgw35.execute-api.eu-west-3.amazonaws.com/prod";
  const endpointCentre = `${catalogueHost}/etablissement`;
  const endpointTraining = `${catalogueHost}/formation`;

  router.get(
    "/context/create",
    tryCatch(async (req, res) => {
      const paramsCentreId = { uai: req.query.centreId };
      const paramsTrainingId = { uai: req.query.trainingId };

      //const responseCentreId = await axios.get(`${endpointCentre}`, { params: { query: paramsCentreId } });
      //const responseTrainingId = await axios.get(`${endpointTraining}`, { params: { query: paramsTrainingId } });
      const responseCentreId = {
        data: {
          entreprise_raison_sociale: "CEPROC",
          address: "45 rue Jean-Baptiste Charcot",
          postalCode: "92000 Massy",
        },
      };
      const responseTrainingId = {
        data: {
          intitule: "CAP Cuisine",
        },
      };

      if (responseCentreId.data && responseTrainingId.data) {
        res.json({
          data: {
            centre: responseCentreId.data,
            training: responseTrainingId.data,
          },
        });
      } else {
        res.json({ message: `no data centre or no data training` });
      }
    })
  );

  router.post(
    "/validate",
    tryCatch(async (req, res) => {
      await userRequestSchema.validateAsync(req.body, { abortEarly: false });
      const paramsAppointement = req.body;

      // Création d'un utilisateur pour le candidat
      const { firstname, lastname, phone, email, role } = paramsAppointement;
      const createdUser = await users.createUser(email, "NA", {
        firstname,
        lastname,
        phone,
        email,
        role,
      });
      if (!createdUser) {
        throw Boom.badRequest("something went wrong during db operation");
      }

      // Création d'une demande de rendez-vous
      const { centreId, trainingId, motivations, referrer } = paramsAppointement;
      const createdAppointement = await appointements.create({
        candidatId: createdUser._id,
        centreId,
        trainingId,
        motivations,
        referrer,
      });
      if (!createdAppointement) {
        throw Boom.badRequest("something went wrong during db operation");
      }

      // Envoi d'un mail au candidat
      await mailer.sendEmail(
        createdUser.email,
        `[Mail Candidat ${config.env} Prise de rendez-vous] Demande de prise de rendez-vous`,
        getEmailTemplate("mail-candidat"),
        {
          appointmentId: createdAppointement._id.toString(),
          user: createdUser,
          nomFormation: "CAP Cuisine",
          nomCFA: "CEPROC",
        }
      );

      // Envoi d'un mail au cfa
      //TODO: Récupérer email du cfa depuis Api Catalogue ou flux S.
      await mailer.sendEmail(
        createdUser.email,
        `[Mail Centre ${config.env} Prise de rendez-vous] Demande de prise de rendez-vous`,
        getEmailTemplate("mail-centre"),
        {
          appointmentId: createdAppointement._id.toString(),
          user: createdUser,
          nomFormation: "CAP Cuisine",
          referrer: "Parcoursup",
        }
      );

      // Mise à jour des statuts de la demande
      await appointements.updateStatusReceived(createdAppointement._id);

      res.json({
        user: createdUser,
        appointment: createdAppointement,
      });
    })
  );

  router.get(
    "/:id/candidat",
    tryCatch(async (req, res) => {
      const itemId = req.params.id;
      await appointements.updateStatusMailOpenedByCandidat(itemId);
      res.json("OK");
    })
  );

  router.get(
    "/:id/centre",
    tryCatch(async (req, res) => {
      const itemId = req.params.id;
      await appointements.updateStatusMailOpenedByCentre(itemId);
      res.json("OK");
    })
  );

  return router;
};

// TODO move to HELPERS file
const getEmailTemplate = (type = "mail-candidat") => {
  return path.join(__dirname, `../../../assets/templates/${type}.mjml.ejs`);
};
