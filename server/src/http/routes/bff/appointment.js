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

  motivations: Joi.string().required(),
  centreId: Joi.string().required(),
  trainingId: Joi.string().required(),
  referrer: Joi.string().required(),
});

const appointmentItemSchema = Joi.object({
  appointmentId: Joi.string().required(),
  cfaAPrisContact: Joi.boolean().optional(),
  champsLibreStatut: Joi.string().optional().allow(""),
  champsLibreCommentaires: Joi.string().optional().allow(""),
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
      const paramsTrainingId = { educ_nat_code: req.query.trainingId };

      const responseCentre = await axios.get(`${endpointCentre}`, { params: { query: paramsCentreId } });
      const responseTraining = await axios.get(`${endpointTraining}`, { params: { query: paramsTrainingId } });

      if (responseCentre.data && responseTraining.data) {
        res.json({
          centre: responseCentre.data,
          training: responseTraining.data,
        });
      } else {
        res.json({ message: `no data centre or no data training` });
      }
    })
  );

  router.post(
    "/edit",
    tryCatch(async (req, res) => {
      await appointmentItemSchema.validateAsync(req.body, { abortEarly: false });
      const paramsAppointementItem = req.body;

      await appointements.updateAppointment(paramsAppointementItem.appointmentId, paramsAppointementItem);
      res.json({});
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
      const createdAppointement = await appointements.createAppointment({
        candidatId: createdUser._id,
        centreId,
        trainingId,
        motivations,
        referrer,
      });
      if (!createdAppointement) {
        throw Boom.badRequest("something went wrong during db operation");
      }

      // Récupération des données sur le centre, la formation et le candidat pour l'afficher sur le mail de récapitulation.
      const centreIdFromFoundAppointment = { uai: createdAppointement.etablissement_id };
      const foundCentre = await axios.get(`${endpointCentre}`, {
        params: { query: centreIdFromFoundAppointment },
      });
      const trainingIdFromFoundAppointment = { educ_nat_code: createdAppointement.formation_id };
      const foundTraining = await axios.get(`${endpointTraining}`, {
        params: { query: trainingIdFromFoundAppointment },
      });

      // Envoi d'un mail au candidat
      await mailer.sendEmail(
        createdUser.email,
        `[Mail Candidat ${config.env} Prise de rendez-vous] Nous allons vous rappeler`,
        getEmailTemplate("mail-candidat"),
        {
          appointmentId: createdAppointement._id,
          user: {
            firstname: createdUser.firstname,
            lastname: createdUser.lastname,
            phone: createdUser.phone,
          },
          centre: {
            name: foundCentre.data.entreprise_raison_sociale,
            address: foundCentre.data.adresse,
            postalCode: foundCentre.data.code_postal,
            email: foundCentre.data.ds_questions_email,
          },
          training: {
            intitule: foundTraining.data.intitule,
          },
          appointment: {
            referrerLink: createdAppointement.referrer_link,
            referrer: createdAppointement.referrer === "LBA" ? "La Bonne Alternance" : createdAppointement.referrer,
          },
          images: {
            people: `${config.publicUrl}/assets/people.png?raw=true`,
            school: `${config.publicUrl}/assets/school.png?raw=true`,
            map: `${config.publicUrl}/assets/map.png?raw=true`,
            third: `${config.publicUrl}/api/bff/appointment/${createdAppointement._id}/candidat`,
          },
        }
      );

      // Envoi d'un mail au cfa
      //TODO: Récupérer email du cfa depuis Api Catalogue ou flux S.
      await mailer.sendEmail(
        createdUser.email,
        `[Mail Centre ${config.env} Prise de rendez-vous] Nous allons vous rappeler`,
        getEmailTemplate("mail-centre"),
        {
          appointmentId: createdAppointement._id,
          user: {
            firstname: createdUser.firstname,
            lastname: createdUser.lastname,
            phone: createdUser.phone,
          },
          centre: {
            name: foundCentre.data.entreprise_raison_sociale,
            address: foundCentre.data.adresse,
            postalCode: foundCentre.data.code_postal,
            email: foundCentre.data.ds_questions_email,
          },
          training: {
            intitule: foundTraining.data.intitule,
          },
          appointment: {
            referrerLink: createdAppointement.referrer_link,
            referrer: createdAppointement.referrer === "LBA" ? "La Bonne Alternance" : createdAppointement.referrer,
          },
          images: {
            people: `${config.publicUrl}/assets/people.png?raw=true`,
            school: `${config.publicUrl}/assets/school.png?raw=true`,
            map: `${config.publicUrl}/assets/map.png?raw=true`,
            third: `${config.publicUrl}/api/bff/appointment/${createdAppointement._id}/centre`,
          },
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
    "/context/recap",
    tryCatch(async (req, res) => {
      const paramsAppointmentId = req.query.appointmentId;
      const foundAppointment = await appointements.getAppointmentById(paramsAppointmentId);

      // Récupération des données sur le centre et le candidat pour l'afficher sur l'écran de récapitulation
      const centreIdFromFoundAppointment = { uai: foundAppointment.etablissement_id };
      const foundCentre = await axios.get(`${endpointCentre}`, {
        params: { query: centreIdFromFoundAppointment },
      });
      const foundUser = await users.getUserById(foundAppointment.candidat_id);
      if (foundUser && foundCentre.data) {
        res.json({
          user: foundUser._doc,
          centre: {
            ...foundCentre.data,
            email: foundCentre.data.ds_questions_email,
          },
        });
      } else {
        res.json({ message: `no data centre or no data training` });
      }
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
