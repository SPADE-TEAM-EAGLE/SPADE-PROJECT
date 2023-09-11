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
    addProspectusQuery,
    getProspectusByIdQuery
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
    const { userId } = req.user;
    // const { userId } = req.body;
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
    // const { prospectusId } = req.body;
    const { userId } = req.user;

    try {

        const getProspectusResult = await queryRunner(selectQuery("prospectus", "landlordId"), [prospectusId]);
        if (getProspectusResult[0].length === 0) {
            return res.status(404).json({  
                message: "No Prospectus Data Found",
                data: null,  
            });
        }

        const prospectusDataArray = [];
        for (let i = 0; i < getProspectusResult[0].length; i++) {
            const propertyInfo = getProspectusResult[0][i].propertyInfo;
            const unitInfo = getProspectusResult[0][i].unitInfo;
console.log(propertyInfo + " " + unitInfo);
            const getPropertyResult = await queryRunner(selectQuery("property", "id"), [propertyInfo]);
            const property = getPropertyResult[0].length > 0 ? getPropertyResult[0][0] : null; 

            const getPropertyunitResult = await queryRunner(selectQuery("propertyunits", "id"), [unitInfo]);
            const propertyunit = getPropertyunitResult[0].length > 0 ? getPropertyunitResult[0][0] : null;  

            const prospectusData = {
                ...getProspectusResult[0][i],
                property,
                unit: propertyunit,
            };

            prospectusDataArray.push(prospectusData); 
        }

        res.status(200).json({
            message: "Get prospectus",
            data: prospectusDataArray,  
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
//  #############################  GET prospectus END ##################################################


//  #############################  GET prospectus By ID START ##################################################
exports.getProspectusByID = async (req, res) => {
    const { prospectusId } = req.body;
    try {
        // Fetch prospectus data
        const getProspectusResult = await queryRunner(selectQuery("prospectus", "id"), [prospectusId]);

        // Check if prospectus data was found
        if (getProspectusResult[0].length === 0) {
            return res.status(404).json({
                message: "No Prospectus Data Found",
                data: null,
            });
        }

        const prospectusDataArray = [];
        
        // Assuming you want to process only the first result
        const firstProspectusResult = getProspectusResult[0][0];
        const propertyInfo = firstProspectusResult.propertyInfo;
        const unitInfo = firstProspectusResult.unitInfo;
        
        // Fetch property and related data
        const getPropertyResult = await queryRunner(getProspectusByIdQuery, [propertyInfo, unitInfo]);

        // Create a prospectus object with property and prospectus data
        const prospectusData = {
            prospectus: firstProspectusResult,
            property: getPropertyResult[0][0],
        };

        prospectusDataArray.push(prospectusData);
        
        res.status(200).json({
            message: "Get prospectus",
            data: prospectusDataArray,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
//  #############################  GET prospectus By ID END ##################################################

//  #############################  GET prospectus END ##################################################