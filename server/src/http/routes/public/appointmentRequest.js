const express = require("express");
const path = require("path");
const Joi = require("joi");
const Boom = require("boom");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const config = require("../../../../config");
const { getReferrerById, getReferrerByKeyName, referrers } = require("../../../common/model/constants/referrers");
const { getFormationsByIdRcoFormations, getFormationsByIdParcoursup } = require("../../utils/catalogue");
const { candidat } = require("../../../common/roles");
const { getIdRcoFormationThroughIdActionFormation } = require("../../utils/mappings/onisep");
const logger = require("../../../common/logger");

const contextCreateSchema = Joi.alternatives().try(
  Joi.object().keys({
    idRcoFormation: Joi.string().allow(""),
    idActionFormation: Joi.string().allow(""),
    idParcoursup: Joi.string().required(),
    referrer: Joi.string()
      .valid(
        referrers.PARCOURSUP.name.toLowerCase(),
        referrers.LBA.name.toLowerCase(),
        referrers.PFR_PAYS_DE_LA_LOIRE.name.toLowerCase(),
        referrers.ONISEP.name.toLowerCase()
      )
      .required(),
  }),
  Joi.object().keys({
    idRcoFormation: Joi.string().required(),
    idActionFormation: Joi.string().allow(""),
    idParcoursup: Joi.string().allow(""),
    referrer: Joi.string()
      .valid(
        referrers.PARCOURSUP.name.toLowerCase(),
        referrers.LBA.name.toLowerCase(),
        referrers.PFR_PAYS_DE_LA_LOIRE.name.toLowerCase(),
        referrers.ONISEP.name.toLowerCase()
      )
      .required(),
  }),
  Joi.object().keys({
    idRcoFormation: Joi.string().allow(""),
    idActionFormation: Joi.string().required(),
    idParcoursup: Joi.string().allow(""),
    referrer: Joi.string()
      .valid(
        referrers.PARCOURSUP.name.toLowerCase(),
        referrers.LBA.name.toLowerCase(),
        referrers.PFR_PAYS_DE_LA_LOIRE.name.toLowerCase(),
        referrers.ONISEP.name.toLowerCase()
      )
      .required(),
  })
);

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
      await contextCreateSchema.validateAsync(req.body, { abortEarly: false });

      const { idRcoFormation, idParcoursup, idActionFormation, referrer } = req.body;

      const referrerObj = getReferrerByKeyName(referrer);

      let formation;
      let catalogueResponse;
      if (idRcoFormation) {
        catalogueResponse = await getFormationsByIdRcoFormations({ idRcoFormations: idRcoFormation });
      } else if (idParcoursup) {
        catalogueResponse = await getFormationsByIdParcoursup({ idParcoursup });
      } else if (idActionFormation) {
        const idRcoFormationFound = getIdRcoFormationThroughIdActionFormation(idActionFormation);

        if (!idRcoFormationFound) {
          throw Boom.notFound("Formation introuvable.");
        }

        catalogueResponse = await getFormationsByIdRcoFormations({ idRcoFormations: idRcoFormationFound });
      } else {
        throw new Error("Critère de recherche non conforme.");
      }

      [formation] = catalogueResponse.formations;

      if (!formation) {
        throw Boom.notFound("Formation introuvable.");
      }

      const isWidgetVisible = await widgetParameters.isWidgetVisible({
        idRcoFormation: formation.id_rco_formation,
        referrer: referrerObj.code,
      });

      if (!isWidgetVisible) {
        return res.send(notAllowedResponse);
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
        form_url: `${config.publicUrl}/form?referrer=${referrer}&idRcoFormation=${formation.id_rco_formation}`,
      });
    })
  );

  router.post(
    "/validate",
    tryCatch(async (req, res) => {
      await userRequestSchema.validateAsync(req.body, { abortEarly: false });

      let { firstname, lastname, phone, email, motivations, referrer, idRcoFormation } = req.body;

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

      const [catalogueResponse, widgetParameter] = await Promise.all([
        getFormationsByIdRcoFormations({ idRcoFormations: idRcoFormation }),
        widgetParameters.getParameterByIdRcoFormationReferrer({ idRcoFormation, referrer: referrerObj.code }),
      ]);

      const [formation] = catalogueResponse.formations;

      if (!formation) {
        throw Boom.badRequest("Etablissement et formation introuvable.");
      }

      const createdAppointement = await appointments.createAppointment({
        candidat_id: user._id,
        etablissement_id: formation.etablissement_formateur_siret,
        formation_id: formation.cfd,
        motivations,
        referrer: referrerObj.code,
        id_rco_formation: idRcoFormation,
      });

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
          info: `${config.publicUrl}/assets/info.png?raw=true`,
          people: `${config.publicUrl}/assets/people.png?raw=true`,
          school: `${config.publicUrl}/assets/school.png?raw=true`,
          map: `${config.publicUrl}/assets/map.png?raw=true`,
          third: `${config.publicUrl}/api/appointment/${createdAppointement._id}/candidat`,
        },
      };

      // Sends email to "candidate" and "formation"
      const [emailCandidat, emailCfa] = await Promise.all([
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

      logger.info("====================================> EMAIL INFORMATIONS");
      logger.info(JSON.stringify([emailCandidat, emailCfa], null, 2));
      logger.info(emailCandidat.messageId);

      await appointments.updateStatusMailsSend({
        appointmentId: createdAppointement._id,
        candidatMessageId: emailCandidat.messageId,
        cfaMessageId: emailCfa.messageId,
      });

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
