const express = require("express");
const path = require("path");
const Joi = require("joi");
const Boom = require("boom");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const config = require("../../../../config");
const { getReferrer } = require("../../../common/model/constants/referrers");
const { getFormationsBySiretCfd } = require("../../utils/catalogue");
const { candidat } = require("../../../common/roles");

const userRequestSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required(),
  motivations: Joi.string().required(),
  siret: Joi.string().required(),
  cfd: Joi.string().required(),
  referrer: Joi.string().required(),
});

const appointmentItemSchema = Joi.object({
  appointmentId: Joi.string().required(),
  cfaAPrisContact: Joi.boolean().optional(),
  champsLibreStatut: Joi.string().optional().allow(""),
  champsLibreCommentaires: Joi.string().optional().allow(""),
});

module.exports = ({ users, appointments, mailer, widgetParameters }) => {
  const router = express.Router();
  const notAllowedResponse = { error: "Prise de rendez-vous non disponible." };

  /**
   * @description Returns all informations needed to initialize front.
   * @param {Request} req
   * @param {Response} res
   */
  router.get(
    "/context/create",
    tryCatch(async (req, res) => {
      const { siret, cfd, referrer } = req.query;
      const referrerObj = getReferrer(referrer);

      const widgetVisible = await widgetParameters.isWidgetVisible({ siret, cfd, referrer: referrerObj.code });

      if (!widgetVisible) {
        return res.send(notAllowedResponse);
      }

      const { formations } = await getFormationsBySiretCfd({ siret, cfd });
      const [formation] = formations;

      if (!formation) {
        throw Boom.notFound("Etablissement et formation introuvable.");
      }

      res.send({
        etablissement: {
          entreprise_raison_sociale: formation.etablissement_formateur_entreprise_raison_sociale,
        },
        formation: {
          intitule: formation.intitule_long,
          adresse: formation.etablissement_formateur_adresse,
          code_postal: formation.etablissement_formateur_code_postal,
          ville: formation.etablissement_formateur_nom_departement,
        },
      });
    })
  );

  router.post(
    "/validate",
    tryCatch(async (req, res) => {
      await userRequestSchema.validateAsync(req.body, { abortEarly: false });

      const { firstname, lastname, phone, email, siret, cfd, motivations, referrer } = req.body;
      const referrerObj = getReferrer(referrer);

      const widgetVisible = await widgetParameters.isWidgetVisible({ siret, cfd, referrer: referrerObj.code });

      if (!widgetVisible) {
        return res.send(notAllowedResponse);
      }

      let user = await users.getUser(email);

      // Updates firstname and last name if the user already exists
      if (user) {
        user = await users.update(user._id, { firstname, lastname, phone });
      } else {
        user = await users.createUser(email, "NA", {
          firstname,
          lastname,
          phone,
          email,
          role: candidat,
        });
      }

      const createdAppointement = await appointments.createAppointment({
        candidat_id: user._id,
        etablissement_id: siret,
        formation_id: cfd,
        motivations,
        referrer: referrerObj.code,
      });

      const [catalogueResponse, widgetParameter] = await Promise.all([
        getFormationsBySiretCfd({ siret: createdAppointement.etablissement_id, cfd: createdAppointement.formation_id }),
        widgetParameters.getParameterBySiretCfdReferrer({ siret, cfd, referrer: referrerObj.code }),
      ]);

      const [formation] = catalogueResponse.formations;

      if (!formation) {
        throw Boom.badRequest("Etablissement et formation introuvable.");
      }

      const mailData = {
        appointmentId: createdAppointement._id,
        user: {
          firstname: user.firstname,
          lastname: user.lastname,
          phone: user.phone,
          motivations: createdAppointement.motivations,
        },
        etablissement: {
          name: formation.etablissement_formateur_entreprise_raison_sociale,
          address: formation.etablissement_formateur_adresse,
          postalCode: formation.etablissement_formateur_code_postal,
          ville: formation.etablissement_formateur_nom_departement,
          email: widgetParameter.email_rdv,
        },
        formation: {
          intitule: formation.intitule_long,
        },
        appointment: {
          referrerLink: referrerObj.url,
          referrer: referrerObj.fullName,
        },
        images: {
          people: `${config.publicUrl}/assets/people.png?raw=true`,
          school: `${config.publicUrl}/assets/school.png?raw=true`,
          map: `${config.publicUrl}/assets/map.png?raw=true`,
          third: `${config.publicUrl}/api/appointment/${createdAppointement._id}/candidat`,
        },
      };

      // Sends email to "candidate" and "formation"
      await Promise.all([
        mailer.sendEmail(
          user.email,
          `[Mail Candidat ${config.env} Prise de rendez-vous] Nous allons vous rappeler`,
          getEmailTemplate("mail-candidat"),
          mailData
        ),
        mailer.sendEmail(
          widgetParameter.email_rdv,
          `[Mail ${config.env} Prise de rendez-vous] Un candidat souhaite être recontacté`,
          getEmailTemplate("mail-formation"),
          mailData
        ),
      ]);

      await appointments.updateStatusMailsSend(createdAppointement._id);

      res.json({
        userId: user._id,
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
      const { appointmentId } = req.query;

      const appointment = await appointments.getAppointmentById(appointmentId);

      const [widgetParameter, user] = await Promise.all([
        widgetParameters.getParameterBySiretCfd({
          siret: appointment.etablissement_id,
          cfd: appointment.formation_id,
        }),
        users.getUserById(appointment.candidat_id),
      ]);

      res.json({
        appointment,
        user: user._doc,
        etablissement: {
          email: widgetParameter.email_rdv,
        },
      });
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
