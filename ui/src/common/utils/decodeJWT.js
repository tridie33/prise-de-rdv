const jwt = require("jsonwebtoken");

const Token = (token) => {
  return {
    token,
    ...jwt.decode(token),
  };
};

export default Token;
