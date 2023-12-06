const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const { connect } = require("./config/connection");
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
const corseOptions={
  credentials:true,
  optionSuccessStatus:200
}
app.use(cors(corseOptions));
app.options("*",cors())
app.use((req, res, next) => {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", "0");
  next();
});
app.use("/api/spade", userRoutes);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
connect();
module.exports = app; // Export the app object
