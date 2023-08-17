const user = require("../models/user");
const { sendMail } = require("../sendmail/sendmail.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const Path = require("path");
const imageToDelete = require("./../middleware/deleteImage.js");
const { serialize } = require("cookie");
const {
  selectQuery,
  deleteQuery,
  updatePassword,
  updatePasswordTenantSetting
} = require("../constants/queries");
const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const config = process.env;
 
  //  ############################# Update Setting Password Start ############################################################ 
exports.changePasssword = async function (req, res) {
    // const {currentPassword, NewPassword } = req.query;
    const {currentPassword, NewPassword } = req.body;
    // const {userId}=req.user
    // console.log(req.query,req.body)
    const {userId}=req.user
    const currentDate = new Date();

    try {
        const selectResult = await queryRunner(selectQuery("users", "id"), [userId]);
        if (selectResult[0].length === 0) {
          res.status(400).send("User Not Found");
        } else if (
          await bcrypt.compare(currentPassword, selectResult[0][0].Password)
        ) {
            const hashPassword = await hashedPassword(NewPassword);
            const updateResult = await queryRunner(updatePassword, [hashPassword,currentDate,userId]);
              if (updateResult[0].affectedRows === 0) {
                res.status(401).json({ error: "Incorrect Password" });
              } else {
                const email = selectResult[0][0].Email;
                const token = jwt.sign({ email, NewPassword }, config.JWT_SECRET_KEY, {
                  expiresIn: "3h",
                });
                res.status(200).json({
                  token: token,
                    message: "Successful password Change",
                  });
              }
        } else {
          res.status(401).json({ error: "Incorrect Password" });
        }  
    } catch (error) {
      res.status(400).send(error.message);
    }
  };
  //  ############################# Update Setting Password END ############################################################
 
 
 

    //  ############################# Update Setting tennant Password Start ############################################################ 
exports.changePasswordTenant = async function (req, res) {
  // const {currentPassword, NewPassword } = req.query;
  const {currentPassword, NewPassword } = req.body;
  // const {userId}=req.user
  const {userId}=req.user
  const currentDate = new Date();

  try {
    
      const selectResult = await queryRunner(selectQuery("tenants", "id"), [userId]);
      if (selectResult[0].length === 0) {
        res.status(400).send("User Not Found");
      } else if (
        await bcrypt.compare(currentPassword, selectResult[0][0].tenantPassword)
      ) {
          const hashPassword = await hashedPassword(NewPassword);
          const updateResult = await queryRunner(updatePasswordTenantSetting, [hashPassword,currentDate,userId]);
            if (updateResult[0].affectedRows === 0) {
              
              res.status(400).send("Error");
            } else {
              const email = selectResult[0][0].email;
              const token = jwt.sign({ email, NewPassword }, config.JWT_SECRET_KEY, {
                expiresIn: "3h",
              });
              res.status(200).json({
                token: token,
                  message: "Successful password Change",
                });
            }
      } else {
        res.status(400).send("Incorrect Password");
      }  
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};
//  ############################# Update Setting tennant Password END ############################################################
