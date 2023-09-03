const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, requires: true },
  password: { type: String, requires: true, default: null },
});

module.exports = mongoose.model("User", userSchema);
