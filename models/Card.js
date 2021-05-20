const mongoose = require("mongoose");
const marked = require("marked");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

const Schema = mongoose.Schema;

const CardSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  topic: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "topic",
  },
  text: {
    type: String,
    required: true,
  },
  sanitizedText: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

CardSchema.pre("validate", function (next) {
  if (this.text) {
    this.sanitizedText = dompurify.sanitize(marked(this.text));
  }
  next();
});

module.exports = Card = mongoose.model("card", CardSchema);
