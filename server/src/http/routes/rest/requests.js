const express = require("express");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const { Request } = require("../../../common/model");

module.exports = () => {
  const router = express.Router();

  /**
   * Get all requests
   * */
  router.get(
    "/",
    tryCatch(async (req, res) => {
      let qs = req.query;
      const query = qs && qs.query ? JSON.parse(qs.query) : {};
      const page = qs && qs.page ? qs.page : 1;
      const limit = qs && qs.limit ? parseInt(qs.limit, 50) : 50;

      const allData = await Request.paginate(query, { page, limit });
      return res.json({
        requests: allData.docs,
        pagination: {
          page: allData.page,
          resultats_par_page: limit,
          nombre_de_page: allData.pages,
          total: allData.total,
        },
      });
    })
  );

  /**
   * Get countRequests
   */
  router.get(
    "/count",
    tryCatch(async (req, res) => {
      let qs = req.query;
      const query = qs && qs.query ? JSON.parse(qs.query) : {};
      const retrievedData = await Request.countDocuments(query);
      if (retrievedData) {
        res.json(retrievedData);
      } else {
        res.json({ message: `Item doesn't exist` });
      }
    })
  );

  return router;
};
