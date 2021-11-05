const nodemailer = require("nodemailer");
const htmlToText = require("nodemailer-html-to-text").htmlToText;
const mjml = require("mjml");
const { promisify } = require("util");
const ejs = require("ejs");
const renderFile = promisify(ejs.renderFile);

/**
 * @description Create transporter.
 * @param {Object} smtp
 * @param {String} smtp.host
 * @param {String} smtp.port
 * @param {Object} smtp.auth
 * @param {String} smtp.user
 * @param {String} smtp.pass
 * @returns {Mail}
 */
const createTransporter = (smtp) => {
  const transporter = nodemailer.createTransport(smtp);

  transporter.use("compile", htmlToText({ ignoreImage: true }));

  return transporter;
};

module.exports = (config, transporter = createTransporter(config.smtp)) => {
  const renderEmail = async (template, data = {}) => {
    const buffer = await renderFile(template, { data });
    const { html } = mjml(buffer.toString(), { minify: true });

    return html;
  };

  return {
    /**
     * @description Process template ejs and mjml tempalte.
     * @returns {string}
     */
    renderEmail,
    /**
     * @description Sends email.
     * @param {string} to
     * @param {string} subject
     * @param {string} template
     * @param {Object} data
     * @param {string} from
     * @returns {Promise<{messageId: string}>}
     */
    sendEmail: async (to, subject, template, data, from = "nepasrepondre@apprentissage.beta.gouv.fr") => {
      return transporter.sendMail({
        from,
        to,
        subject,
        html: await renderEmail(template, data),
        list: {},
      });
    },
  };
};
