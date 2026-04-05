const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    default: "Admin",
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL of the image
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  tags: [String],
});

module.exports = mongoose.model("Blog", blogSchema);
