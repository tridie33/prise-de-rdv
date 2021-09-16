import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";

dayjs.extend(utc);

/**
 * @description Formats date.
 * @param {string} date
 * @returns {string|void}
 */
const formatDate = (date) => {
  if (!date) {
    return;
  }

  return dayjs(date).format("DD/MM/YYYY HH:mm:ss");
};

export { dayjs, formatDate };
