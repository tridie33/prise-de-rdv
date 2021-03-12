const express = require("express");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const { getFormations } = require("../../utils/catalogue");

/**
 * @description Catalogue router.
 */
module.exports = () => {
  const router = express.Router();

  /**
   * @description Proxify catalogue's requests.
   */
  router.get(
    "/formations",
    tryCatch(async (req, res) => {
      const qs = req.query;
      const query = qs && qs.query ? JSON.parse(qs.query) : {};
      const page = qs && qs.page ? parseInt(qs.page, 10) : 1;
      const limit = qs && qs.limit ? parseInt(qs.limit, 10) : 50;

      const response = await getFormations(query, page, limit);

      return res.send(response);
    })
  );

  return router;
};
