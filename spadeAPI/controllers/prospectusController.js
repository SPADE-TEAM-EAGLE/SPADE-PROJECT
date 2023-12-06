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
    addProspectusSources,
    sourcesCampaignInsight,
    dashboardProspectusInsight,
    prospectTimeGraphQuery,
    prospectusCount,
    prospectusIdUpdate
} = require("../constants/queries");
const { queryRunner } = require("../helper/queryRunner");
const { deleteImageFromS3 } = require("../helper/S3Bucket");
const { log } = require("console");


exports.addprospectus = async (req, res) => {
    const {
        firstName,
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

    const currentDate = new Date();

    try {
        const prospectusResult = await queryRunner(addProspectusQuery, [
            userId,
            firstName,
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
        const prospectusID = prospectusResult[0].insertId;
        const prospectusCountIdResult = await queryRunner(prospectusCount , [userId]);
        let customProspectusId = prospectusCountIdResult[0][0].count + 1;
        customProspectusId = lastName+customProspectusId;
        const prospectusIdUpdateResult = await queryRunner(prospectusIdUpdate ,[customProspectusId, prospectusID]);
        //}

        res.status(200).json({
            message: " prospectus created successful",
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};





exports.getProspectus = async (req, res) => {
    const { userId } = req.user;

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
            const sourceID = getProspectusResult[0][i].sourceCampaign;
            console.log(sourceID);

            const firstProspectusResult = getProspectusResult[0][i];
const getSourceResult = await queryRunner(selectQuery("prospectusSources", "id"), [sourceID]);
const Source = getSourceResult[0].length > 0 ? getSourceResult[0][0] : [];

            const getPropertyResult = await queryRunner(getProspectusByIdQuery, [propertyInfo, unitInfo]);
            const property = getPropertyResult[0].length > 0 ? getPropertyResult[0][0] : [];
            const prospectusData = {
                prospectus: firstProspectusResult,
                property: property,
                Source: Source,
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




exports.getProspectusByID = async (req, res) => {
    const { prospectusId } = req.query;


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
        const sourceID = firstProspectusResult.sourceCampaign;




const getSourceResult = await queryRunner(selectQuery("prospectusSources", "id"), [sourceID]);
const Source = getSourceResult[0].length > 0 ? getSourceResult[0][0] : [];


        const getPropertyResult = await queryRunner(getProspectusByIdQuery, [propertyInfo, unitInfo]);

        const prospectusData = {
            prospectus: firstProspectusResult,
            property: getPropertyResult[0][0],
            Source: Source,
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






exports.updateProspectus = async (req, res) => {
    const {
        firstName,
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
    console.log(req.body);
    const currentDate = new Date(); 
    try {
        
        console.log(UpdateProspectusQuery);
        const prospectusResult = await queryRunner(UpdateProspectusQuery, [
            firstName,

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
        }else{
        res.status(200).json({
            message: " prospectus updated successful",
        });
    }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error occur in prospectus",
            error : error.message
        });
    }
};







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






exports.prospectusInsightQD = async (req, res) => {
    
    const {year} = req.params;

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





exports.prospectusInsightEN = async (req, res) => {
    const {startDate,endDate} = req.params;

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

        res.status(500).json({
            message: "Error occur in prospectus Insight Engaged and Nurturing",
            error : error.message
        });
    }
};







exports.deleteProspectus = async (req, res) => {
    try {
      const { prospectusID } = req.params;

      const deleteprospectusResult = await queryRunner(deleteQuery("prospectus", "id"), [
        prospectusID,
      ]);
      if (deleteprospectusResult[0].affectedRows > 0) {
        res.status(200).json({

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


  

  
  exports.prospectusSources = async (req, res) => {
    const { Sourcess } = req.body;

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

  


  exports.getProspectusSources = async (req, res) => {
    
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

  


exports.sourcesCampaignInsight = async (req, res) => {
    const {startDate,endDate} = req.params;

    const { userId } = req.user;
    try {
        
        const sourcesCampaignInsightResult = await queryRunner(sourcesCampaignInsight, [
            userId,
            startDate,
            endDate
        ]);
        if (sourcesCampaignInsightResult[0].length === 0) {
            return res.status(201).send("No data found");
        }
        res.status(200).json({
            message: " prospectus Engaged and Nurturing get successful",
            data : sourcesCampaignInsightResult[0]
        });
    } catch (error) {

        res.status(500).json({
            message: "Error occur in prospectus Insight Engaged and Nurturing",
            error : error.message
        });
    }
};






  exports.dashboardProspectusInsight = async (req, res) => {
    const {startDate,endDate} = req.params;

    const { userId } = req.user;
    try {
        
        const dashboardProspectusInsightResult = await queryRunner(dashboardProspectusInsight, [
            userId,
            startDate,
            endDate
        ]);
        if (dashboardProspectusInsightResult[0].length === 0) {
            return res.status(201).send("No data found");
        }
        res.status(200).json({
            message: "  Dashboard prospectus Insight get successful",
            data : dashboardProspectusInsightResult[0]
        });
    } catch (error) {

        res.status(500).json({
            message: "Error occur in Dashboard prospectus Insight",
            error : error.message
        });
    }
};





exports.prospectTimeGraph = async (req, res) => {
    const { startDate, endDate } = req.params;
    const { userId } = req.user;
    try {
        const prospectTimeGraphResult = await queryRunner(prospectTimeGraphQuery, [
            userId,
            startDate,
            endDate,
        ]);
        if (prospectTimeGraphResult[0].length === 0) {
            return res.status(201).send("No data found");
        }
        const prospects = prospectTimeGraphResult[0].map(row => {
            const isAfter15th = new Date(row.createdDate).getDate() > 15;
            const isEndAfter15th = row.updatedDate ? new Date(row.updatedDate).getDate() > 15 : false;

            const prospectDetail = {
              prospect_detail: row,
              startMonth: row.startMonth,
              endMonth: row.updatedDate ? row.endMonth : new Date().toLocaleString('default', { month: 'short' }) + '-' + new Date().getFullYear(),
              createdAfter15th: isAfter15th ? '1/2' : '',
              endAfter15th: isEndAfter15th ? '1/2' : '',
            };
          
            return prospectDetail;
          });
        
        res.status(200).json({
            message: "prospectus time get successful",
            data: prospects,
        });
    } catch (error) {

        res.status(500).json({
            message: "Error occur in prospectus time",
            error: error.message,
        });
    }
}













































    


















