const axios = require("axios");
const express = require("express");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const path = require("path");
const Joi = require("joi");
const Boom = require("boom");
const config = require("../../../../config/index");
const { candidat } = require("../../../common/roles");
const { logger } = require("../../../common/logger");

const userRequestSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required(),

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

module.exports = ({ users, appointments, mailer }) => {
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
    "/validate",
    tryCatch(async (req, res) => {
      await userRequestSchema.validateAsync(req.body, { abortEarly: false });
      const { firstname, lastname, phone, email, centreId, trainingId, motivations, referrer } = req.body;

      let createdOrFoundUser = null;
      let createdAppointement = null;

      // Création / Récupération candidat
      try {
        createdOrFoundUser =
          (await users.getUser(email)) ??
          (await users.createUser(email, "NA", {
            firstname,
            lastname,
            phone,
            email,
            role: candidat,
          }));
      } catch (err) {
        throw Boom.badRequest("something went wrong during candidat retrieval / creation");
      }

      // Création d'une demande de rendez-vous
      createdAppointement = await appointments.createAppointment({
        candidatId: createdOrFoundUser._id,
        centreId,
        trainingId,
        motivations,
        referrer,
      });
      if (!createdAppointement) {
        throw Boom.badRequest("something went wrong during appointment creation");
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
      try {
        await mailer.sendEmail(
          createdOrFoundUser.email,
          `[Mail Candidat ${config.env} Prise de rendez-vous] Nous allons vous rappeler`,
          getEmailTemplate("mail-candidat"),
          {
            appointmentId: createdAppointement._id,
            user: {
              firstname: createdOrFoundUser.firstname,
              lastname: createdOrFoundUser.lastname,
              phone: createdOrFoundUser.phone,
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
              third: `${config.publicUrl}/api/appointment/${createdAppointement._id}/candidat`,
            },
          }
        );
      } catch (err) {
        logger.error(err);
        throw Boom.badRequest("something went wrong during mailing");
      }

      // Envoi d'un mail au cfa
      // TODO: Récupérer email du cfa depuis Api Catalogue ou flux S.
      // await mailer.sendEmail(
      //   createdUser.email,
      //   `[Mail Centre ${config.env} Prise de rendez-vous] Nous allons vous rappeler`,
      //   getEmailTemplate("mail-centre"),
      //   {
      //     appointmentId: createdAppointement._id,
      //     user: {
      //       firstname: createdUser.firstname,
      //       lastname: createdUser.lastname,
      //       phone: createdUser.phone,
      //     },
      //     centre: {
      //       name: foundCentre.data.entreprise_raison_sociale,
      //       address: foundCentre.data.adresse,
      //       postalCode: foundCentre.data.code_postal,
      //       email: foundCentre.data.ds_questions_email,
      //     },
      //     training: {
      //       intitule: foundTraining.data.intitule,
      //     },
      //     appointment: {
      //       referrerLink: createdAppointement.referrer_link,
      //       referrer: createdAppointement.referrer === "LBA" ? "La Bonne Alternance" : createdAppointement.referrer,
      //     },
      //     images: {
      //       people: `${config.publicUrl}/assets/people.png?raw=true`,
      //       school: `${config.publicUrl}/assets/school.png?raw=true`,
      //       map: `${config.publicUrl}/assets/map.png?raw=true`,
      //       third: `${config.publicUrl}/api/appointment/${createdAppointement._id}/centre`,
      //     },
      //   }
      // );

      // Mise à jour des statuts de la demande
      await appointments.updateStatusMailsSend(createdAppointement._id);

      res.json({
        userId: createdOrFoundUser._id,
        appointment: createdAppointement,
      });
    })
  );

  router.post(
    "/edit",
    tryCatch(async (req, res) => {
      await appointmentItemSchema.validateAsync(req.body, { abortEarly: false });
      const paramsAppointementItem = req.body;

      await appointments.updateAppointment(paramsAppointementItem.appointmentId, paramsAppointementItem);
      res.json({});
    })
  );

  router.get(
    "/context/recap",
    tryCatch(async (req, res) => {
      const paramsAppointmentId = req.query.appointmentId;
      const foundAppointment = await appointments.getAppointmentById(paramsAppointmentId);

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
      await appointments.updateStatusMailOpenedByCandidat(itemId);
      res.json("OK");
    })
  );

  router.get(
    "/:id/centre",
    tryCatch(async (req, res) => {
      const itemId = req.params.id;
      await appointments.updateStatusMailOpenedByCentre(itemId);
      res.json("OK");
    })
  );

  return router;
};

// TODO move to HELPERS file
const getEmailTemplate = (type = "mail-candidat") => {
  return path.join(__dirname, `../../../assets/templates/${type}.mjml.ejs`);
};
