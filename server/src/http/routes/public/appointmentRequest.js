const express = require("express");
const path = require("path");
const Joi = require("joi");
const Boom = require("boom");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const config = require("../../../../config");
const { getReferrerById, getReferrerByKeyName } = require("../../../common/model/constants/referrers");
const { getFormationsByIdRcoFormation } = require("../../utils/catalogue");
const { candidat } = require("../../../common/roles");

const userRequestSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required(),
  motivations: Joi.string().allow(null, ""),
  idRcoFormation: Joi.string().required(),
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
   * @description Creates and returns formation context.
   * @param {Request} req
   * @param {Response} res
   */
  router.post(
    "/context/create",
    tryCatch(async (req, res) => {
      const { idRcoFormation, referrer } = req.body;

      const referrerObj = getReferrerByKeyName(referrer);

      const isWidgetVisible = await widgetParameters.isWidgetVisible({
        idRcoFormation,
        referrer: referrerObj.code,
      });

      if (!isWidgetVisible) {
        return res.send(notAllowedResponse);
      }

      const { formations } = await getFormationsByIdRcoFormation({ idRcoFormation });
      const [formation] = formations;

      if (!formation) {
        throw Boom.notFound("Formation introuvable.");
      }

      res.send({
        etablissement_formateur_entreprise_raison_sociale: formation.etablissement_formateur_entreprise_raison_sociale,
        intitule_long: formation.intitule_long,
        lieu_formation_adresse: formation.lieu_formation_adresse,
        code_postal: formation.code_postal,
        etablissement_formateur_siret: formation.etablissement_formateur_siret,
        cfd: formation.cfd,
        localite: formation.localite,
        id_rco_formation: formation.id_rco_formation,
        form_url: `${config.publicUrl}/form?referrer=${referrer}&idRcoFormation=${idRcoFormation}`,
      });
    })
  );

  router.post(
    "/validate",
    tryCatch(async (req, res) => {
      await userRequestSchema.validateAsync(req.body, { abortEarly: false });

      let { firstname, lastname, phone, email, siret, cfd, motivations, referrer, idRcoFormation } = req.body;

      email = email.toLowerCase();

      const referrerObj = getReferrerByKeyName(referrer);

      const isWidgetVisible = await widgetParameters.isWidgetVisible({
        idRcoFormation,
        referrer: referrerObj.code,
      });

      if (!isWidgetVisible) {
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
        id_rco_formation: idRcoFormation,
      });

      const [catalogueResponse, widgetParameter] = await Promise.all([
        getFormationsByIdRcoFormation({ idRcoFormation }),
        widgetParameters.getParameterByIdRcoFormationReferrer({ idRcoFormation, referrer: referrerObj.code }),
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
          email: user.email,
          motivations: createdAppointement.motivations,
        },
        etablissement: {
          name: formation.etablissement_formateur_entreprise_raison_sociale,
          address: formation.lieu_formation_adresse,
          postalCode: formation.code_postal,
          ville: formation.localite,
          email: widgetParameter.email_rdv,
        },
        formation: {
          intitule: formation.intitule_long,
        },
        appointment: {
          referrerLink: referrerObj.url,
          referrer: referrerObj.full_name,
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
          `Le CFA a bien reçu votre demande de RDV via ${referrerObj.full_name}`,
          getEmailTemplate("mail-candidat"),
          mailData
        ),
        mailer.sendEmail(
          widgetParameter.email_rdv,
          `[RDV via ${referrerObj.full_name}] Un candidat souhaite être recontacté`,
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
        widgetParameters.getParameterByIdRcoFormation({ idRcoFormation: appointment.id_rco_formation }),
        users.getUserById(appointment.candidat_id),
      ]);

      res.json({
        appointment: {
          ...appointment,
          referrer: getReferrerById(appointment.referrer),
        },
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
