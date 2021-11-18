const express = require("express");
const Joi = require("joi");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const { dayjs } = require("../../utils/dayjs.js");

const optOutUnsubscribeSchema = Joi.object({
  opt_out_refused_reason: Joi.string().optional(),
});

/**
 * @description Etablissement Router.
 */
module.exports = ({ etablissements }) => {
  const router = express.Router();

  /**
   * @description Returns etablissement from its id.
   */
  router.get(
    "/:id",
    tryCatch(async (req, res) => {
      const etablissement = await etablissements.findById(req.params.id);

      if (!etablissement) {
        return res.sendStatus(404);
      }

      return res.send(etablissement);
    })
  );

  /**
   * @description Unsubscribe to "opt-out".
   */
  router.post(
    "/:id/opt-out/unsubscribe",
    tryCatch(async (req, res) => {
      const { opt_out_refused_reason } = await optOutUnsubscribeSchema.validateAsync(req.body, { abortEarly: false });

      let etablissement = await etablissements.findById(req.params.id);

      if (!etablissement) {
        return res.sendStatus(404);
      }

      if (etablissement.opt_out_refused_at) {
        return res.sendStatus(400);
      }

      await etablissements.findByIdAndUpdate(req.params.id, {
        opt_out_refused_at: dayjs().toDate(),
        opt_out_refused_reason,
      });

      etablissement = await etablissements.findById(req.params.id);

      return res.send(etablissement);
    })
  );

  return router;
};
