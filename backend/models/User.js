const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  Password: String,
  firstname: String,
  lastname: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
