const user = require("../models/user");
const { sendMail, taskSendMail } = require("../sendmail/sendmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const Path = require("path");
const imageToDelete = require("./../middleware/deleteImage");
const { serialize } = require("cookie");
const {
    selectQuery,
    deleteQuery,
    addProspectusQuery
} = require("../constants/queries");
const { queryRunner } = require("../helper/queryRunner");
const { deleteImageFromS3 } = require("../helper/S3Bucket");

//  #############################  ADD prospectus Start ##################################################
exports.addprospectus = async (req, res) => {
    const {
        firstName,
        middleName,
        lastName,
        phoneNumber,
        email,
        propertyInfo,
        unitInfo,
        prospectDetail,
        sourceCampaign,
        moveDate,
        rentAmount,
        prospectusStatus,
    } = req.body;
    // const { userId } = req.user;
    const { userId } = req.body;
    const currentDate = new Date();
    // console.log(userId)
    try {
        // const prospectusCheckResult = await queryRunner(
        //   selectQuery("prospectus", "email", "landlordID"),
        //   [email, userId]
        // );
        // if (prospectusCheckResult[0].length > 0) {
        //   return res.send("prospectus already exists");
        // } else {
        // console.log(userId)
        const prospectusResult = await queryRunner(addProspectusQuery, [
            userId,
            firstName,
            middleName,
            lastName,
            phoneNumber,
            email,
            propertyInfo,
            unitInfo,
            prospectDetail,
            sourceCampaign,
            moveDate,
            rentAmount,
            prospectusStatus,
            currentDate
        ]);
        if (prospectusResult.affectedRows === 0) {
            return res.status(400).send("Error1");
        }
        //}

        res.status(200).json({
            message: " prospectus created successful",
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};

//  #############################  ADD prospectus END ##################################################


//  #############################  GET prospectus START ##################################################
exports.getProspectus = async (req, res) => {

    const { userId } = req.body;
    try {
    
        const getProspectusResult = await queryRunner(selectQuery("prospectus", "landlordId"), [userId]);
        if (getProspectusResult[0].length == 0) {
            return res.status(200).json({
                message: " No Prospectus Data Found",
            });
        }
        //}

        res.status(200).json({
            message: " Get prospectus",
            data : getProspectusResult[0]
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};
//  #############################  GET prospectus END ##################################################