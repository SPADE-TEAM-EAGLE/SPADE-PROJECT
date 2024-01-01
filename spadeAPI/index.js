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

// Define multiple allowed origins
const allowedOrigins = ["https://admin.socket.io", "https://app.spaderent.com", "https://backend.app.spaderent.com","https://admin.spaderent.com"]; // Add your allowed origins

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

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

module.exports = app;

