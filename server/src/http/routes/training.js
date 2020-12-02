const axios = require("axios");

const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");

const catalogueHost = "https://c7a5ujgw35.execute-api.eu-west-3.amazonaws.com";
module.exports = () => {
  const router = express.Router();
  const endpoint = `${catalogueHost}/prod/formation`;
  router.get(
    "/",
    tryCatch(async (req, res) => {
      const query = { educ_nat_code: req.query.trainingId };
      const response = await axios.get(`${endpoint}`, { params: { query: query } });
      if (response.data) {
        res.json(response.data);
      } else {
        res.json({ message: `no data training` });
      }
    })
  );

  return router;
};
