const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const advancedFormat = require("dayjs/plugin/advancedFormat");
const duration = require("dayjs/plugin/duration");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);
dayjs.extend(duration);

/**
 * @description Formats date.
 * @param {string} date
 * @returns {string|void}
 */
const formatDate = (date) => {
  if (!date) {
    return;
  }

  return dayjs.tz(date, "Europe/Paris").format("DD/MM/YYYY");
};

/**
 * @description Formats date.
 * @param {string} date
 * @returns {string|void}
 */
const formatDatetime = (date) => {
  if (!date) {
    return;
  }

  return dayjs.tz(date, "Europe/Paris").format("DD/MM/YYYY HH:mm:ss");
};

module.exports = {
  dayjs,
  formatDate,
  formatDatetime,
};
