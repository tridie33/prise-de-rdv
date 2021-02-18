module.exports = {
  processors: ["stylelint-processor-styled-components"],
  extends: ["stylelint-config-recommended", "stylelint-config-styled-components"],
  rules: {
    "color-no-invalid-hex": true,
    "value-list-comma-space-after": "always",
    "length-zero-no-unit": true,
  },
};
