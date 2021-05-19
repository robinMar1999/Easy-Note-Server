const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSecret = process.env.jwtSecret || config.get("jwtSecret");

const router = express.Router();

// @route     POST api/auth
// @desc      Login User
// @access    Public
router.post(
  "/",
  [
    body("email", "Email is invalid").isEmail(),
    body("password", "Password is required").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      const isSame = await bcrypt.compare(password, user.password);
      if (!isSame) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        userId: user.id,
      };
      const token = jwt.sign(payload, jwtSecret);
      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

module.exports = router;
