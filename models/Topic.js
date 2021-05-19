const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TopicSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  parents: [
    {
      type: Schema.Types.ObjectId,
      ref: "topic",
    },
  ],
  parent: {
    type: Schema.Types.ObjectId,
    ref: "topic",
    default: null,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Topic = mongoose.model("topic", TopicSchema);
