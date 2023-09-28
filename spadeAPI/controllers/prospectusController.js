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
    getProspectusByIdQuery,
    UpdateProspectusQuery,
    UpdateProspectusStatusQuery,
    prospectusInsightQD,
    prospectusInsightEN,
    prospectusTimeQuery,
    addProspectusSources
} = require("../constants/queries");
const { queryRunner } = require("../helper/queryRunner");
const { deleteImageFromS3 } = require("../helper/S3Bucket");

//  #############################  ADD prospectus Start ##################################################
exports.addprospectus = async (req, res) => {
    const {
        firstName,
        // middleName,
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
            // middleName,
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
            return res.status(400).send("No data found");
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
    const { userId } = req.user;
    // const { userId } = req.body;
    try {
        const getProspectusResult = await queryRunner(selectQuery("prospectus", "landlordId"), [userId]);
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
            // console.log(propertyInfo + " " + unitInfo);
            const firstProspectusResult = getProspectusResult[0][i];

            const getPropertyResult = await queryRunner(getProspectusByIdQuery, [propertyInfo, unitInfo]);
            const property = getPropertyResult[0].length > 0 ? getPropertyResult[0][0] : [];
            const prospectusData = {
                prospectus: firstProspectusResult,
                property: property,
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
    const { prospectusId } = req.query;
    console.log(req.query)
    try {

        const getProspectusResult = await queryRunner(selectQuery("prospectus", "id"), [prospectusId]);

        if (getProspectusResult[0].length === 0) {
            return res.status(404).json({
                message: "No Prospectus Data Found",
                data: null,
            });
        }

        const prospectusDataArray = [];

        const firstProspectusResult = getProspectusResult[0][0];
        const propertyInfo = firstProspectusResult.propertyInfo;
        const unitInfo = firstProspectusResult.unitInfo;

        const getPropertyResult = await queryRunner(getProspectusByIdQuery, [propertyInfo, unitInfo]);

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




//  #############################  Update prospectus Start ##################################################
exports.updateProspectus = async (req, res) => {
    const {
        firstName,
        // middleName,
        lastName,
        phoneNumber,
        email,
        propertyInfo,
        unitInfo,
        prospectDetails,
        sourceCampaign,
        rentAmount,
        prospectusStatus,
        prospectusid
    } = req.body;
    const currentDate = new Date(); 
    try {

        const prospectusResult = await queryRunner(UpdateProspectusQuery, [
            firstName,
            // middleName,
            lastName,
            phoneNumber,
            email,
            propertyInfo,
            unitInfo,
            prospectDetails,
            sourceCampaign,
            rentAmount,
            prospectusStatus,
            currentDate,
            prospectusid
        ]);
        if (prospectusResult.affectedRows === 0) {
            return res.status(400).send("No data found");
        }
        res.status(200).json({
            message: " prospectus updated successful",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error occur in prospectus",
            error : error.message
        });
    }
};

//  #############################  Update prospectus END ##################################################




//  #############################  Update prospectus Status Start ##################################################
exports.updateProspectusStatus = async (req, res) => {
    
    const {
        prospectusStatus,
        prospectusid
    } = req.body;
    const currentDate = new Date(); 
    try {
        
        const prospectusResult = await queryRunner(UpdateProspectusStatusQuery, [
            prospectusStatus,
            currentDate,
            prospectusid
        ]);
        if (prospectusResult.affectedRows === 0) {
            return res.status(400).send("No data found");
        }
        res.status(200).json({
            message: " prospectus status updated successful",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error occur in prospectus status",
            error : error.message
        });
    }
};

//  #############################  Update prospectus Status END ##################################################



//  #############################  Insight Qualified & disQuilified Start ##################################################
exports.prospectusInsightQD = async (req, res) => {
    
    const {year} = req.params;
    // const { userId } = req.body;
    const { userId } = req.user;
    try {
        
        const prospectusResult = await queryRunner(prospectusInsightQD, [year,userId]);
        if (prospectusResult[0].length === 0) {
            return res.status(400).send("No data found");
        }
        res.status(200).json({
            message: " prospectus Qualified & disQuilified successful",
            data : prospectusResult[0]
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error occur in prospectus Insight Qualified and Disqualified",
            error : error.message
        });
    }
};

//  #############################  Insight Qualified & disQuilified END ##################################################


//  #############################  Insight Count Engaged Nurture Start ##################################################
exports.prospectusInsightEN = async (req, res) => {
    const {startDate,endDate} = req.params;
    // const { userId } = req.body;
    const { userId } = req.user;
    try {
        
        const prospectusResult = await queryRunner(prospectusInsightEN, [
            userId,
            startDate,
            endDate
        ]);
        if (prospectusResult[0].length === 0) {
            return res.status(400).send("No data found");
        }
        res.status(200).json({
            message: " prospectus Engaged and Nurturing get successful",
            data : prospectusResult[0][0]
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            message: "Error occur in prospectus Insight Engaged and Nurturing",
            error : error.message
        });
    }
};

//  #############################  Insight Engaged and Nurturing END ##################################################



//  #############################  Delete prospectus Start HERE ##################################################

exports.deleteProspectus = async (req, res) => {
    try {
      const { prospectusID } = req.params;
    //   console.log(prospectusID);
      const deleteprospectusResult = await queryRunner(deleteQuery("prospectus", "id"), [
        prospectusID,
      ]);
      if (deleteprospectusResult[0].affectedRows > 0) {
        res.status(200).json({
          // data: vendorResult[0],
          message: "prospectus Deleted Successful",
        });
      } else {
        res.status(400).json({
          message: "No prospectus data found",
        });
      }
    } catch (error) {
      res.send("Error Get delete prospectus  ");
      console.log(error);
    }
  };
  //  #############################  Delete prospectus ENDS HERE ##################################################
  



  //  #############################  Prospectus time Start HERE ##################################################
exports.prospectusTime = async (req, res) => {
    try {
      const { startDate, endDate } = req.params;
      const { userId } = req.user;
      const prospectusTimeResult = await queryRunner(prospectusTimeQuery, [
            userId,
            startDate,
            endDate
      ]);
      if (prospectusTimeResult[0].length > 0) {
        res.status(200).json({
          message: "prospectus Get Successful",
        });
      } else {
        res.status(101).json({
          message: "No prospectus data found",
        });
      }
    } catch (error) {
      res.send("Error Get Prospectus time  ");
      console.log(error);
    }
  };
  //  ############################# Prospectus time ENDS HERE ##################################################

  
  //  ############################# Prospectus Sources Campaign Start HERE ##################################################
  
  exports.prospectusSources = async (req, res) => {
    const { Sourcess } = req.body;
    // const { userId } = req.body;
    const { userId } = req.user;
    try {
        const SourcesResult = [];
        const existSourcesResult = [];
        for (let i = 0; i < Sourcess.length; i++) {
            const Sources = Sourcess[i];
            const prospectusSourcesResult = await queryRunner(
                selectQuery("prospectusSources", "landlordId", "sourcesCampaign"),
                [userId, Sources]
            );
            if (prospectusSourcesResult[0].length == 0) {
                const insertedProspectusSourcesResult = await queryRunner(
                    addProspectusSources,
                    [userId,Sources]
                );
                if (insertedProspectusSourcesResult[0].affectedRows > 0) {
                    SourcesResult.push({
                        insertId : insertedProspectusSourcesResult[0].insertId,
                        name : Sources
                    }
                        );
                }
            }else{
                existSourcesResult.push(prospectusSourcesResult[0][0].id);
            }
        }
        if(SourcesResult.length > 0){
            res.status(200).json({
                message: "prospectus Sources added successfully",
                insertedSources: SourcesResult
            });
        }else{
            res.status(200).json({
                message: "prospectus Sources Already Exist",
                insertedSources: existSourcesResult
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};
  //  ############################# Prospectus Sources Campaign END HERE ##################################################
  

  //  ############################# Prospectus Sources Campaign Start HERE ##################################################
  exports.getProspectusSources = async (req, res) => {
    // const { userId } = req.body;
    const { userId } = req.user;
    try {
            const prospectusSourcesResult = await queryRunner(
                selectQuery("prospectusSources", "landlordId"),
                [userId]
            );
            if (prospectusSourcesResult[0].length == 0) {
                res.status(200).json({
                                message: " prospectus data not found",
                            });
               
            }else{
                res.status(200).json({
                                message: " prospectus get successful",
                                data : prospectusSourcesResult[0]
                            });
            }

    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};
  //  ############################# Prospectus Sources Campaign END HERE ##################################################
  

  //  #############################  Insight Sources Start ##################################################
exports.prospectusInsightSources = async (req, res) => {
    const {startDate,endDate} = req.params;
    // const { userId } = req.body;
    const { userId } = req.user;
    try {
        
        const prospectusResult = await queryRunner(prospectusInsightEN, [
            userId,
            startDate,
            endDate
        ]);
        if (prospectusResult[0].length === 0) {
            return res.status(400).send("No data found");
        }
        res.status(200).json({
            message: " prospectus Engaged and Nurturing get successful",
            data : prospectusResult[0][0]
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            message: "Error occur in prospectus Insight Engaged and Nurturing",
            error : error.message
        });
    }
};

//  #############################  Insight Sources END ##################################################