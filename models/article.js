const mongoose = require("mongoose");
const validator = require("validator");
const { VALID_URL_VALIDATE_MESSAGE } = require("../utils/constants");

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(url) {
        return validator.isURL(url);
      },
      message: VALID_URL_VALIDATE_MESSAGE,
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(url) {
        return validator.isURL(url);
      },
      message: VALID_URL_VALIDATE_MESSAGE,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userSchema",
    required: true,
  },
});

module.exports = mongoose.model("articleItem", articleSchema);
