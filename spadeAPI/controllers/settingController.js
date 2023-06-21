const user = require("../models/user");
const sendMail = require('../sendmail/sendmail.js');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const fs = require('fs');
const Path = require('path');
const imageToDelete = require('./../middleware/deleteImage.js')
const { serialize } = require('cookie');
const {
    selectQuery,
    deleteQuery,
    updatePassword
} = require("../constants/queries");
const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const config = process.env;

  //  ############################# Update Setting Password Start ############################################################ 
exports.changePasssword = async function (req, res) {
    // const {currentPassword, NewPassword } = req.query;
    const {currentPassword, NewPassword } = req.body;
    // const {userId}=req.user
    console.log(req.query,req.body)
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
                res.status(200).json({
                    message: "Successful password Change",
                  });
              }
        } else {
          res.status(401).json({ error: "Incorrect Password" });
        }  
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };
  //  ############################# Update Setting Password END ############################################################
