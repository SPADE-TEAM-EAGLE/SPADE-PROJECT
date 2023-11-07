const user = require("../models/user");
const {
  sendMail,
  taskSendMail,
  sendMailLandlord,
} = require("../sendmail/sendmail.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const Path = require("path");
const imageToDelete = require("./../middleware/deleteImage.js");
const { serialize } = require("cookie");
const {

  selectQuery,
  deleteQuery,

} = require("../constants/queries");

const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const { fileUpload, deleteImageFromS3 } = require("../helper/S3Bucket");
const { verifyMailCheck } = require("../helper/emailVerify");
const userServices = require("../Services/userServices");
const { log } = require("console");
// const { encryptJwtToken } = require("../helper/EnccryptDecryptToken");
// const { NotificationSocket } = require("../app.js");
const config = process.env;
