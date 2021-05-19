const Topic = require("../models/Topic");
const Card = require("../models/Card");

const deleteTopic = async (id) => {
  try {
    await Card.deleteMany({ topic: id });
    const topics = await Topic.find({ parent: id });
    for (let i = 0; i < topics.length; i++) {
      await deleteTopic(topics[i]._id.toString());
    }
    await Topic.findByIdAndDelete(id);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = deleteTopic;
