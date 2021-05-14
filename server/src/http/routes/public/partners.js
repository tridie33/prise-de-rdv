const express = require("express");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const { idParcoursupCatalogueList } = require("../../utils/parcoursup");

/**
 * @description Partners router.
 */
module.exports = () => {
  const router = express.Router();

  /**
   * @description Proxify catalogue's requests.
   */
  router.get(
    "/parcoursup/formations",
    tryCatch(async (req, res) => {
      return res.send({ ids: idParcoursupCatalogueList });
    })
  );

  return router;
};
