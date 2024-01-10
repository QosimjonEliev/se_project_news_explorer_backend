const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../errors/UnauthorizedError");
const { AUTHORIZATION_REQUIRED_ERROR_MESSAGE } = require("../utils/constants");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError(AUTHORIZATION_REQUIRED_ERROR_MESSAGE);
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError(AUTHORIZATION_REQUIRED_ERROR_MESSAGE);
  }
  req.user = payload;
  next();
};

module.exports = { auth };
