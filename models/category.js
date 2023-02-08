const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
     required: [true, "product must hve  category"],
  },
});

module.exports = mongoose.model("Category", categorySchema);
