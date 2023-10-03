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
    insertInUsers,
    insertInUserPermissionUsers,
    updateUserPermissionUsers
} = require("../constants/queries");

const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const config = process.env;



exports.createUserPermissionUser = async function (req, res) {
    const { firstName, lastName, email, phone, password, Ustatus, role } = req.body;
    const { userId } = req.user;
    // const { userId } = req.body;
    const currentDate = new Date();
    console.log(userId, email,);
    try {
        console.log("userId, email,");
        const selectResult = await queryRunner(selectQuery("userPUsers","llnalordId" ,"UEmail"), [
            userId,
            email,
        ]);
        if (selectResult[0].length > 0) {
            return res.status(201).send("Email already exists");
        } 
        const hashPassword = await hashedPassword(password);
        // generate a unique identifier for the user
        const salt = bcrypt.genSaltSync(10);
        const id = bcrypt
            .hashSync(lastName + new Date().getTime().toString(), salt)
            .substring(0, 10); 
        const insertResult = await queryRunner(insertInUserPermissionUsers, [
            userId,
            firstName,
            lastName,
            email,
            phone,
            hashPassword,
            Ustatus,
            role,
            currentDate,
        ]); 
        const name = firstName + " " + lastName;
        const mailSubject = "Spade Welcome Email";
        if (insertResult[0].affectedRows > 0) {
console.log(email + " " + mailSubject + " " + name)
            await sendMailLandlord(email, mailSubject, name);
            return res.status(200).json({ message: "Users Permission User added successfully" });
        } else {
            return res.status(500).send("Failed to add User Permission User");
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};



// User Check Email
exports.userCheckEmail = async function (req, res) {
    const { email } = req.query;
    const { userId } = req.user;;
    try {
      const selectResult = await queryRunner(selectQuery("userPUsers","llnalordId" ,"UEmail"), [
        userId,
        email,
    ]);
      if (selectResult[0].length > 0) {
        return res.status(201).json({
            message: "Email already exists",
          data: selectResult,
        });
      } else {
        res.status(200).json({
                   message: "New user",
        });
      }
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  };

  // User get By Id
exports.userPermissionGetById = async function (req, res) {
    const { id } = req.query;
    // const { userId } = req.user;;
    try {
      const selectResult = await queryRunner(selectQuery("userPUsers","id"), [
        id,
    ]);
      if (selectResult[0].length > 0) {
        return res.status(200).json({
          data: selectResult[0][0],
        });
      } else {
        res.status(200).json({
                   message: "No user Found",
        });
      }
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  };

// update User 
exports.updateUserPermissionUsers = async function (req, res) {
    const { firstName, lastName, email, phone, Ustatus, role, id } = req.body;
    const currentDate = new Date();
    try {
        const insertResult = await queryRunner(updateUserPermissionUsers, [
            firstName,
            lastName,
            email,
            phone,
            Ustatus,
            role,
            currentDate,
            id,
        ]); 
        if (insertResult[0].affectedRows > 0) {
            return res.status(200).json({ message: " User Updated Successfully" });
        } else {
            return res.status(500).send("Failed to Update User Permission User");
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

  // User Permission Delete
  exports.userPermissionUsersDelete = async function (req, res) {
    const { id } = req.body;
    try {
      const selectResult = await queryRunner(deleteQuery("userPUsers","id"), [
        id,
    ]);
      if (selectResult[0].affectedRows > 0) {
        return res.status(200).json({
            message : "User Deleted Successsful"
        });
      } else {
        res.status(200).json({
                   message: "No user Found",
        });
      }
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  };

    // Get User Roles
exports.userPermissionRoles = async function (req, res) {
    try {
      const selectResult = await queryRunner(selectQuery("userRoles"));
      if (selectResult[0].length > 0) {
        return res.status(200).json({
          data: selectResult[0][0],
        });
      } else {
        res.status(200).json({
                   message: "No User Roles Found",
        });
      }
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  };