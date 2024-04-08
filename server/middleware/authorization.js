const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../config");

// Middleware to authorize JWT token - ref: https://dev.to/franciscomendes10866/using-cookies-with-jwt-in-node-js-8fn
const authorization = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, SECRET_KEY);
    req.userId = data.id;
    req.userRole = data.role;
    return next();
  } catch (e) {
    console.error(`Error while verifying token: ${e}`);
    return res.sendStatus(403);
  }
};

module.exports = authorization;
