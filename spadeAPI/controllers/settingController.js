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
  updatePasswordTenantSetting,
  updateEmailTemplates,
  updateBusinessLogo,
  addResetToken,
  updateUserEmail
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


//  ############################# Email templates Start ############################################################
exports.emailtemplates = async (req, res) => {
  const { tenantEmail, invoiceEmail, taskEmail, userEmail = 0 } = req.body;
  const { userId } = req.user;
  // const { userId } = req.body;
  try {
    const updateEmailResult = await queryRunner(updateEmailTemplates, [tenantEmail, invoiceEmail, taskEmail, userEmail,userId,]);
    if (updateEmailResult[0].affectedRows > 0) {
      return res.status(200).json({
        Message: "Updated Successful",
        result : updateEmailResult[0]
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
//  ############################# Email templates END ############################################################

//  ############################# Landlord business logo Start ############################################################
exports.updateBusinessLogo = async (req, res) => {
  const { userId } = req.user; 
  const { image, imageKey } = req.body; 
  console.log(req.body);
  try {
      const updateBusinessLogoResult = await queryRunner(updateBusinessLogo, [image, imageKey,userId]);
      if (updateBusinessLogoResult[0].affectedRows > 0) {
        res.status(200).json({
          message: " Business Logo save successful",
          // data : updateBusinessLogoResult[0]
        });        
      }else{
        res.status(400).json({
          message: " Something went wrong in  Business Logo ",
        });        
      }

  } catch (error) {
    res.status(400).send("Error4" + error);
    console.log(error);
  }
};
//  ############################# Landlord business logo End ############################################################

// ####################################### Change Email ##########################################
exports.changeEmail = async (req, res) => { 
  const { email } = req.body;
  const { userId } = req.user;
  if (!email) {
    return res.status(201).json({ message: "Email Not found" });
  }
  const checkUserResult = await queryRunner(selectQuery("users", "Email"),[email]);
  console.log(email);
    if (checkUserResult[0].length > 0) {
      return res.status(201).json({ message: "Email ALready Exist kindly change your Email" });
    }
  const mailSubject = "Spade Email Change Request";
  const random = Math.floor(100000 + Math.random() * 900000);
  try {
    const selectResult = await queryRunner(selectQuery("users", "id"), [userId]);

    if (selectResult[0].length > 0) {
      const name =
        selectResult[0][0].FirstName + " " + selectResult[0][0].LastName;
      // console.log(`Email: ${email}, Subject: ${mailSubject}, Random: ${random}, Name: ${name}`);
      
      sendMail(email, mailSubject, random, name);

      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");

      const updateResult = await queryRunner(addResetToken, [random, formattedDate, userId]);

      if (updateResult[0].affectedRows === 0) {
        return res.status(400).json({ message: "Error in changing Email" });
      } else {
        return res.status(200).json({ message: "Email Sent", id: userId, email : email });
      }
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// ####################################### Change Email ##########################################


// ####################################### Verify token ##########################################
exports.changeEmailVerifyToken = async (req, res) => { 
  // console.log(req);
  const { token,email } = req.body;
  // console.log(token + " " + email)
  const { userId } = req.user;
  try {
    
    const currentDate = new Date();
    const selectResult = await queryRunner(selectQuery("users", "id", "token"),[userId,token]);
    if (selectResult[0].length > 0) {
      // const token = selectResult[0][0].token;

      const updateResult = await queryRunner(updateUserEmail, [email, currentDate, userId]);

      if (updateResult[0].affectedRows === 0) {
        return res.status(400).json({ message: "Error in verify token" });
      } else {
        return res.status(200).json({ message: "Email updated Successful", id: userId, email : email });
      }
    } else {
      res.status(201).json({
        message: "Cannot Validate!!!",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error",error : error });
  }
};
// ####################################### Change Email ##########################################







