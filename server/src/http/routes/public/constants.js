const express = require("express");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const { referrers } = require("../../../common/model/constants/referrers");
const { optMode } = require("../../../common/model/constants/etablissement");

/**
 * @description Constants router.
 */
module.exports = () => {
  const router = express.Router();

  /**
   * @description Returns all constants.
   */
  router.get(
    "/",
    tryCatch((req, res) => res.send({ referrers: Object.values(referrers), optMode: Object.values(optMode) }))
  );

  return router;
};
