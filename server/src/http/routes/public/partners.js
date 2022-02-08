const express = require("express");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const { referrers } = require("../../../common/model/constants/referrers");

/**
 * @description Partners router.
 */
module.exports = ({ widgetParameters }) => {
  const router = express.Router();

  /**
   * @description Returns all available parcoursup ids.
   */
  router.get(
    "/parcoursup/formations",
    tryCatch(async (req, res) => {
      const ids = await widgetParameters.find(
        {
          id_parcoursup: {
            $ne: null,
          },
          referrers: { $in: [referrers.PARCOURSUP.code] },
        },
        { id_parcoursup: 1 }
      );

      return res.send({ ids: ids.map((widgetParameter) => widgetParameter.id_parcoursup) });
    })
  );

  return router;
};
