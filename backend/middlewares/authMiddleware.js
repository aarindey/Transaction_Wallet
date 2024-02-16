const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(403).json({
      message: "Unauthorized... Missing auth token1!!",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(403).json({
      message: "Unauthorized... Missing auth token2!!",
    });
  }
  //we would decode the token and pass the userId in the request
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    //passing the userId decoded from the token with the request
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    res.status(403).json({
      message: "Unauthorized... Invalid Token3!!",
    });
  }
};

module.exports = authMiddleware;
