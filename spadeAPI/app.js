const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const { connect } = require("./config/connection");
const multer = require("multer");
const AWS = require("aws-sdk");

const app = express();
// const upload = multer(); // config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(upload.any());
app.use(cors());
AWS.config.update({
  accessKeyId: 'AKIA5HKBWH6Q3F2PKPMK',
  secretAccessKey: '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',
});
app.use((req, res, next) => {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", "0");
  next();
});

app.use("/api/spade", userRoutes);
connect();
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
// const options = {
//   key: fs.readFileSync("Certificate/ssl.key"),
//   cert: fs.readFileSync("Certificate/ssl.crt"),
//   ca: fs.readFileSync('Certificate/ca_bundle.pem'),
//   checkServerIdentity: () => undefined
// };

// https.createServer(options, app).listen(process.env.PORT || 5000, () => {
// console.log("Backend server is running!", process.env.PORT);
// });
