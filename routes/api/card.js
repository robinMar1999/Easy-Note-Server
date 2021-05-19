const express = require("express");
const { body, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Topic = require("../../models/Topic");
const Card = require("../../models/Card");

const router = express.Router();

// @route     GET api/card/:id
// @desc      Get all Cards
// @access    Private
router.get("/:id", auth, async (req, res) => {
  try {
    // check if topic exists
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ errors: [{ msg: "Topic not found" }] });
    }
    // check if topic belong to user
    if (!topic.user.equals(req.userId)) {
      return res
        .status(401)
        .json({ errors: [{ msg: "Not authorized, access denied" }] });
    }
    const cards = await Card.find({ topic: topic.id });
    res.json({ cards });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

// @route     POST api/card/:id
// @desc      Add Card
// @access    Private
router.post(
  "/:id",
  auth,
  [body("text", "Text is required").not().isEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // check if topic exists
      const topic = await Topic.findById(req.params.id);
      if (!topic) {
        return res.status(404).json({ errors: [{ msg: "Topic not found" }] });
      }
      // check if topic belong to user
      if (!topic.user.equals(req.userId)) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Not authorized, access denied" }] });
      }
      const card = new Card({
        user: req.userId,
        topic: topic.id,
        text: req.body.text,
      });
      await card.save();
      res.json({ card });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

// @route     PATCH api/card/:id
// @desc      Update Card
// @access    Private
router.patch(
  "/:id",
  auth,
  [body("text", "Text is required").not().isEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // check if card exists
      const card = await Card.findById(req.params.id);
      if (!card) {
        return res.status(404).json({ errors: [{ msg: "Card not found" }] });
      }
      // check if card belong to user
      if (!card.user.equals(req.userId)) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Not authorized, access denied" }] });
      }
      card.text = req.body.text;
      await card.save();
      res.json({ card });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

// @route     DELETE api/card/:id
// @desc      Delete Card
// @access    Private
router.delete("/:id", auth, async (req, res) => {
  try {
    // check if card exists
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ errors: [{ msg: "Card not found" }] });
    }
    // check if card belong to user
    if (!card.user.equals(req.userId)) {
      return res
        .status(401)
        .json({ errors: [{ msg: "Not authorized, access denied" }] });
    }
    await card.remove();
    res.json({ msg: "card deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

module.exports = router;
