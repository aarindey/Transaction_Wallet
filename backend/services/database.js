// database.js
const mongoose = require("mongoose");

const connect = async () => {
  await mongoose.connect("mongodb://localhost:27017").then(() => {
    console.log("Database is connected");
  });
};

module.exports = connect;
