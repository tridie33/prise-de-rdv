const express = require("express");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const { referrers } = require("../../../common/model/constants/referrers");

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
    tryCatch((req, res) => res.send({ referrers: Object.values(referrers) }))
  );

  return router;
};
