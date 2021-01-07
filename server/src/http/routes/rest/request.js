const express = require("express");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const { Request } = require("../../../common/model");
const logger = require("../../../common/logger");

module.exports = () => {
  const router = express.Router();

  /**
   * Get request getRequest /request GET
   */
  router.get(
    "/",
    tryCatch(async (req, res) => {
      let qs = req.query;
      const query = qs && qs.query ? JSON.parse(qs.query) : {};
      const retrievedData = await Request.findOne(query);
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
      const retrievedData = await Request.findById(itemId);
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
      logger.info("Posting new request: ", item);

      // Adding request
      const request = new Request(body);
      await request.save();

      // return new request
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

      logger.info("Updating new item: ", body);
      const result = await Request.findOneAndUpdate({ _id: itemId }, body, { new: true });
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

      await Request.deleteOne({ id: itemId });
      res.json({ message: `Item ${itemId} deleted !` });
    })
  );

  return router;
};
