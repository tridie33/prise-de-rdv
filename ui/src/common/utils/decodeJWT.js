const jwt = require("jsonwebtoken");

// eslint-disable-next-line import/no-anonymous-default-export
export default (token) => {
  return {
    token,
    ...jwt.decode(token),
  };
};
