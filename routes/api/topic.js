const express = require("express");
const { body, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Topic = require("../../models/Topic");
const Card = require("../../models/Card");
const deleteTopic = require("../../utils/deleteTopic");

const router = express.Router();

// @route     GET api/topic
// @desc      Get all topics for a user
// @access    Private
router.get("/", auth, async (req, res) => {
  try {
    const topics = await Topic.find({ user: req.userId, parent: null });
    res.json({ topics });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

// @route     GET api/topic/:topicId
// @desc      Get all subtopics & cards for a topic
// @access    Private
router.get("/:topicId", auth, async (req, res) => {
  try {
    const topics = await Topic.find({ parent: req.params.topicId });
    const cards = await Card.find({ topic: req.params.topicId });
    res.json({ topics, cards });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

// @route     POST api/topic
// @desc      Add root level topic
// @access    Private
router.post(
  "/",
  auth,
  [body("title", "Title is required").not().isEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const topic = new Topic({
        title: req.body.title,
        user: req.userId,
      });

      await topic.save();

      res.json({ topic });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

// @route     POST api/topic
// @desc      Add child topic
// @access    Private
router.post(
  "/:parentId",
  auth,
  [body("title", "Title is required").not().isEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const parent = await Topic.findById(req.params.parentId);

      if (!parent) {
        return res.status(400).json({ errors: [{ msg: "Parent not found" }] });
      }

      const topic = new Topic({
        title: req.body.title,
        user: req.userId,
        parents: [...parent.parents],
        parent: req.params.parentId,
      });
      topic.parents.push(req.params.parentId);

      await topic.save();

      res.json({ topic });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

// @route     PATCH api/topic/:id
// @desc      Update topic
// @access    Private
router.patch(
  "/:id",
  auth,
  [body("title", "Title is required").not().isEmpty()],
  async (req, res) => {
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

      topic.title = req.body.title;
      await topic.save();
      res.json({ topic });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

// @route     DELETE api/topic/:id
// @desc      Delete topic
// @access    Private
router.delete("/:id", auth, async (req, res) => {
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
    // delete all cards belonging to this topic
    await deleteTopic(req.params.id);
    res.json({ msg: "Topic deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

module.exports = router;
