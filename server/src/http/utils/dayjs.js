const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * @description Formats date.
 * @param {string} date
 * @returns {string|void}
 */
const formatDate = (date) => {
  if (!date) {
    return;
  }

  return dayjs.tz(date, "Europe/Paris").format("YYYY-MM-DD HH:mm:ss");
};

module.exports = {
  dayjs,
  formatDate,
};
