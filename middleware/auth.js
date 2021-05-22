const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");
const jwtSecret = process.env.jwtSecret || config.get("jwtSecret");

const auth = async (req, res, next) => {
  if (!req.header("Authorization")) {
    return res
      .status(401)
      .json({ errors: [{ msg: "No token, authorization denied" }] });
  }
  const token = req.header("Authorization").split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ errors: [{ msg: "No token, authorization denied" }] });
  }

  // verify token
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ errors: [{ msg: "Invalid token" }] });
    }
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(401).json({ errors: [{ msg: "Token is invalid" }] });
  }
};

module.exports = auth;
