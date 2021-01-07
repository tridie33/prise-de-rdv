const express = require("express");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const { Request, User } = require("../../../common/model");
const logger = require("../../../common/logger");

module.exports = ({ users }) => {
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

      // TODO : check user -> if existant get id / if not adding & getting id
      // Then add Request

      // const
      // const userFound = User.findOne({ email: body.email });
      // if(userFound){

      // }

      // Adding or retrieving user
      const userFound = await users.getUser(body.email);
      // const userFound = User.findOne({ email: body.email });
      //   const candidateToAdd = new User({
      //     email: "j.doe@gmail.com",
      //     firstname: "John",
      //     lastname: "Doe",
      //     phone: "1234567890",
      //   });
      //   await candidateToAdd.save();
      // }

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
