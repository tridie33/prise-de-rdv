const express = require("express");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const { Appointment } = require("../../../common/model");
const logger = require("../../../common/logger");

/**
 * Sample entity route module for GET
 */
module.exports = () => {
  const router = express.Router();

  /**
   * Get all formations getRequests /requests GET
   * */
  router.get(
    "/appointments",
    tryCatch(async (req, res) => {
      let qs = req.query;
      const query = qs && qs.query ? JSON.parse(qs.query) : {};
      const page = qs && qs.page ? qs.page : 1;
      const limit = qs && qs.limit ? parseInt(qs.limit, 50) : 50;

      const allData = await Appointment.paginate(query, { page, limit });
      return res.json({
        appointments: allData.docs,
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
   * Get countRequests requests/count GET
   */
  router.get(
    "/appointments/count",
    tryCatch(async (req, res) => {
      let qs = req.query;
      const query = qs && qs.query ? JSON.parse(qs.query) : {};
      const retrievedData = await Appointment.countDocuments(query);
      if (retrievedData) {
        res.json(retrievedData);
      } else {
        res.json({ message: `Item doesn't exist` });
      }
    })
  );

  /**
   * Get request getRequest /request GET
   */
  router.get(
    "/",
    tryCatch(async (req, res) => {
      let qs = req.query;
      const query = qs && qs.query ? JSON.parse(qs.query) : {};
      const retrievedData = await Appointment.findOne(query);
      if (retrievedData) {
        res.json(retrievedData);
      } else {
        res.json({ message: `Item doesn't exist` });
      }
    })
  );

  /**
   * Get request by id getRequestById /request/{id} GET
   */
  router.get(
    "/:id",
    tryCatch(async (req, res) => {
      const itemId = req.params.id;
      const retrievedData = await Appointment.findById(itemId);
      if (retrievedData) {
        res.json(retrievedData);
      } else {
        res.json({ message: `Item ${itemId} doesn't exist` });
      }
    })
  );

  /**
   * Add/Post an item validated by schema createRequest /request POST
   */
  router.post(
    "/",
    tryCatch(async ({ body }, res) => {
      const item = body;
      logger.info("Adding new request: ", item);
      const request = new Appointment(body);
      await request.save();
      res.json(request);
    })
  );

  /**
   * Update an item validated by schema updateRequest request/{id} PUT
   */
  router.put(
    "/:id",
    tryCatch(async ({ body, params }, res) => {
      const itemId = params.id;
      logger.info("Updating item: ", body);
      const result = await Appointment.findOneAndUpdate({ _id: itemId }, body, { new: true });
      res.json(result);
    })
  );

  /**
   * Delete an item by id deleteRequest request/{id} DELETE
   */
  router.delete(
    "/:id",
    tryCatch(async ({ params }, res) => {
      const itemId = params.id;
      await Appointment.findByIdAndDelete(itemId);
      res.json({ message: `Item ${itemId} deleted !` });
    })
  );

  return router;
};
