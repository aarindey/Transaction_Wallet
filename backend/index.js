const express = require("express");
const connect = require("./services/database.js");
const cors = require("cors");
const User = require("./models/User.js");
const rootRouter = require("./routes/index.js");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", rootRouter);
// Connect to the database and start the server if the connection is successful
connect().then(() =>
  app.listen(3000, () => {
    console.log("App is listening at port 3000");
  })
);
