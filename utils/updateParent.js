const Topic = require("../models/Topic");

const updateParent = async (idx, currId, title) => {
  try {
    const topics = await Topic.find({ parent: currId });
    for (let i = 0; i < topics.length; i++) {
      topics[i].parents[idx].title = title;
      await topics[i].save();
      await updateParent(idx, topics[i]._id.toString(), title);
    }
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = updateParent;
