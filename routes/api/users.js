const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSecret = process.env.jwtSecret || config.get("jwtSecret");

const router = express.Router();

// @route     POST api/users
// @desc      Register User
// @access    Public
router.post(
  "/",
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Email is invalid").isEmail(),
    body("password", "Password must be of 8 or more characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { name, email, password } = req.body;
      const prevEmail = await User.find({ email: email });
      if (prevEmail) {
        res.status(409).json({ errors: [{ msg: "Email already exists" }] });
      }
      const user = new User({
        name,
        email,
        password,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

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
