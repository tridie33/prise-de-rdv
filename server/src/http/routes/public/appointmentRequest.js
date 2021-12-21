const express = require("express");
const path = require("path");
const Joi = require("joi");
const Boom = require("boom");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const config = require("../../../../config");
const { getReferrerById, getReferrerByKeyName, referrers } = require("../../../common/model/constants/referrers");
const { candidatFollowUpType, mailType } = require("../../../common/model/constants/appointments");
const { getFormationsByIdRcoFormations, getFormationsByIdParcoursup } = require("../../utils/catalogue");
const { candidat } = require("../../../common/roles");
const { getIdRcoFormationThroughIdActionFormation } = require("../../utils/mappings/onisep");
const { dayjs } = require("../../utils/dayjs");

const contextCreateSchema = Joi.alternatives().try(
  Joi.object().keys({
    idParcoursup: Joi.string().required(),
    idRcoFormation: Joi.string().allow(""),
    idActionFormation: Joi.string().allow(""),
    idCleMinistereEducatif: Joi.string().allow(""),
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
    idCleMinistereEducatif: Joi.string().allow(""),
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
    idActionFormation: Joi.string().required(),
    idRcoFormation: Joi.string().allow(""),
    idParcoursup: Joi.string().allow(""),
    idCleMinistereEducatif: Joi.string().allow(""),
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
    idCleMinistereEducatif: Joi.string().required(),
    idRcoFormation: Joi.string().allow(""),
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
  // Temporary for LBA during "idCleMinistereEducatif" migration
  Joi.object().keys({
    idCleMinistereEducatif: Joi.string().required(),
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

const appointmentIdFollowUpSchema = Joi.object({
  action: Joi.string().valid(candidatFollowUpType.CONFIRM, candidatFollowUpType.RESEND).required(),
});

module.exports = ({ users, appointments, mailer, widgetParameters, etablissements }) => {
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
        form_url: `${config.publicUrl}/form?referrer=${referrer}&idRcoFormation=${encodeURIComponent(
          formation.id_rco_formation
        )}`,
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
          phone: user.phone.match(/.{1,2}/g).join("."),
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
          peopleLaptop: `${config.publicUrl}/assets/girl_laptop.png?raw=true`,
          info: `${config.publicUrl}/assets/info.png?raw=true`,
          message: `${config.publicUrl}/assets/message.png?raw=true`,
          school: `${config.publicUrl}/assets/school.png?raw=true`,
          map: `${config.publicUrl}/assets/map.png?raw=true`,
          third: `${config.publicUrl}/api/appointment/${createdAppointement._id}/candidat`,
        },
      };

      // Sends email to "candidate" and "formation"
      const [emailCandidat, emailCfa] = await Promise.all([
        mailer.sendEmail(
          user.email,
          `Le centre de formation a bien reçu votre demande de contact`,
          path.join(__dirname, `../../../assets/templates/mail-candidat-confirmation-rdv.mjml.ejs`),
          mailData
        ),
        mailer.sendEmail(
          widgetParameter.email_rdv,
          `[RDV via ${referrerObj.full_name}] Un candidat souhaite être contacté`,
          path.join(__dirname, `../../../assets/templates/mail-cfa-demande-de-contact.mjml.ejs`),
          mailData
        ),
      ]);

      await appointments.updateAppointment(createdAppointement._id, {
        email_premiere_demande_candidat_message_id: emailCandidat.messageId,
        email_premiere_demande_cfa_message_id: emailCfa.messageId,
        email_cfa: widgetParameter.email_rdv,
        email_premiere_demande_cfa_date: dayjs().format(),
        email_premiere_demande_candidat_date: dayjs().format(),
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

      const [widgetParameter, user, catalogueFormations] = await Promise.all([
        widgetParameters.getParameterByIdRcoFormation({ idRcoFormation: appointment.id_rco_formation }),
        users.getUserById(appointment.candidat_id),
        getFormationsByIdRcoFormations({ idRcoFormations: appointment.id_rco_formation }),
      ]);

      const [formationCatalogue] = catalogueFormations.formations;

      res.json({
        appointment: {
          ...appointment,
          referrer: getReferrerById(appointment.referrer),
        },
        user: user._doc,
        etablissement: {
          email: widgetParameter.email_rdv,
          intitule_long: formationCatalogue.intitule_long,
          etablissement_formateur_entreprise_raison_sociale:
            formationCatalogue.etablissement_formateur_entreprise_raison_sociale,
        },
      });
    })
  );

  router.get(
    "/:id/candidat/follow-up",
    tryCatch(async (req, res) => {
      const appointment = await appointments.findOne({ _id: req.params.id });

      if (!appointment) {
        return res.sendStatus(400);
      }

      const etablissement = await etablissements.findOne({ siret_formateur: appointment.etablissement_id });

      // Check if the RESEND action has already been triggered
      const cfaMailResendExists = appointment.cfa_mailing.find(
        (mail) => mail.campaign === mailType.CFA_REMINDER_RESEND_APPOINTMENT
      );

      res.send({
        formAlreadySubmit: !!(appointment.candidat_contacted_at || cfaMailResendExists),
        appointment: {
          candidat_contacted_at: appointment.candidat_contacted_at,
        },
        etablissement: {
          raison_sociale: etablissement.raison_sociale,
          adresse: etablissement.adresse,
          code_postal: etablissement.code_postal,
          localite: etablissement.localite,
        },
      });
    })
  );

  router.post(
    "/:id/candidat/follow-up",
    tryCatch(async (req, res) => {
      const { action } = await appointmentIdFollowUpSchema.validateAsync(req.body, { abortEarly: false });

      const appointment = await appointments.findOne({ _id: req.params.id });

      if (!appointment) {
        return res.sendStatus(400);
      }

      // Check if the RESEND action has already been triggered
      const cfaMailResendExists = appointment.cfa_mailing.find(
        (mail) => mail.campaign === mailType.CFA_REMINDER_RESEND_APPOINTMENT
      );

      if (appointment.candidat_contacted_at || cfaMailResendExists) {
        return res.sendStatus(400);
      }

      const [user, widgetParameter, catalogueResponse] = await Promise.all([
        users.findOne({ _id: appointment.candidat_id }),
        widgetParameters.findOne({ id_rco_formation: appointment.id_rco_formation }),
        getFormationsByIdRcoFormations({ idRcoFormations: appointment.id_rco_formation }),
      ]);

      if (action === candidatFollowUpType.CONFIRM) {
        await appointment.update({ candidat_contacted_at: dayjs().toDate() });
      }

      if (action === candidatFollowUpType.RESEND) {
        const referrerObj = getReferrerById(appointment.referrer);

        const [formation] = catalogueResponse.formations;

        const { messageId } = await mailer.sendEmail(
          widgetParameter.email_rdv,
          `[RDV via ${referrerObj.full_name}] Relance - Un candidat souhaite être contacté`,
          path.join(__dirname, `../../../assets/templates/mail-cfa-demande-de-contact.mjml.ejs`),
          {
            user: {
              firstname: user.firstname,
              lastname: user.lastname,
              phone: user.phone.match(/.{1,2}/g).join("."),
              email: user.email,
              motivations: appointment.motivations,
            },
            etablissement: {
              name: formation.etablissement_formateur_entreprise_raison_sociale,
              address: formation.lieu_formation_adresse,
              postalCode: formation.code_postal,
              ville: formation.localite,
            },
            formation: {
              intitule: formation.intitule_long,
            },
            appointment: {
              referrerLink: referrerObj.url,
              referrer: referrerObj.full_name,
            },
            images: {
              peopleLaptop: `${config.publicUrl}/assets/girl_laptop.png?raw=true`,
            },
          }
        );

        await appointments.findOneAndUpdate(
          { _id: appointment._id },
          {
            $push: {
              cfa_mailing: {
                campaign: mailType.CFA_REMINDER_RESEND_APPOINTMENT,
                status: null,
                message_id: messageId,
                email_sent_at: dayjs().toDate(),
              },
            },
          }
        );
      }

      res.sendStatus(200);
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
