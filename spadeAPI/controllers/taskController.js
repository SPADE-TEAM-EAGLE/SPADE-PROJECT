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
  addVendor,
  addTasksQuery,
  insertInTaskImage,
  selectEmailQuery,
  selectNameQuery,
  selectAnyQuery,
  addVendorList,
  getLandlordTenant,
  Alltasks
} = require("../constants/queries");
const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const { file } = require("googleapis/build/src/apis/file");
const e = require("express");
const config = process.env;

//  #############################  ADD VENDOR ##################################################
exports.addVendors = async (req, res) => {
  const {
    firstName,
    lastName,
    businessName,
    streetAddress,
    city,
    state,
    zipCode,
    workNumber,
    mobileNumber,
    email,
    categoryID,
  } = req.body;

  try {
    const vendorCheckResult = await queryRunner(
      selectQuery("vendor", "mobileNumber", "email"),
      [mobileNumber, email]
    );

    if (vendorCheckResult[0].length > 0) {
      return res.send("Vendor already exists");
    } else {
      const vendorResult = await queryRunner(addVendor, [
        firstName,
        lastName,
        businessName,
        streetAddress,
        city,
        state,
        zipCode,
        workNumber,
        mobileNumber,
        email,
        categoryID,
      ]);
      if (vendorResult.affectedRows === 0) {
        return res.status(400).send("Error1");
      }
    }
    
    res.status(200).json({
      message: " Vendor created successful",
    });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
//  #############################  ADD VENDOR ENDS HERE ##################################################


//  #############################  All VENDOR Start HERE ##################################################
exports.getAllVendors = async (req, res) => {
  const { ID } = req.body;
  try {
    const getVendorAPI = await queryRunner(
      selectQuery("vendor", "landlordID"),
      [ID]
    );

    if (getVendorAPI[0].length > 0) {
      res.status(200).json({
        data: getVendorAPI,
        message: "All vendor retrieved successfully",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while retrieving Vendor.",
      error: error.message,
    });
  }
};
//  #############################  All VENDOR ENDS HERE ##################################################





//  #############################  ADD TASK Start HERE ##################################################
exports.addTasks = async (req, res) => {
  const {
    taskName,
    vendorID,
    tenantID,
    dueDate,
    status,
    priority,
    notes,
    notifyTenant,
    notifyVendor,
    created_at,
    updated_at,
    created_by,
  } = req.body;
  //   const { userId } = req.user
  const { userId } = req.body;
  try {
    // console.log(1);
    const addTasksCheckResult = await queryRunner(
      selectQuery("task", "taskName", "tenantID"),
      [taskName, tenantID]
    );
    // console.log(addTasksCheckResult);
    if (addTasksCheckResult[0].length > 0) {
      return res.send("Task already exists");
    } else {
      const TasksResult = await queryRunner(addTasksQuery, [
        taskName,
        tenantID,
        dueDate,
        status,
        priority,
        notes,
        notifyTenant,
        notifyVendor,
        created_at,
        updated_at,
        created_by,
      ]);
      if (TasksResult.affectedRows === 0) {
        return res.status(400).send("Error1");
      } 
      // else {
        const tasksID = TasksResult[0].insertId;
        if(req.files){ 
        const fileNames = req.files.map((file) => file.filename);
        for (let i = 0; i < fileNames.length; i++) {
          const taskImages = fileNames[i];
          const taskImageResult = await queryRunner(insertInTaskImage, [
            tasksID,
            taskImages,
          ]);
          if (taskImageResult.affectedRows === 0) {
            return res.send("Error2");
          }
        }
      }
      //   //  add vendor
        for (let i = 0; i < vendorID.length; i++) {
          const Vendorid = vendorID[i];
          const vendorResults = await queryRunner(addVendorList, [
            tasksID,
            Vendorid,
          ]);
          if (vendorResults.affectedRows === 0) {
            return res.send("Error2");
          }
        }
      //   //  add vendor
        const tenantLandlordResult = await queryRunner(getLandlordTenant, [userId,tenantID]);
        let vendorEmailarr = [];
        let vendorNamearr = [];
        for(let i = 0; i < vendorID.length; i++){
          const vendorCheckResult = await queryRunner( selectQuery("vendor", "id"), [vendorID[i]] );
          if(vendorCheckResult.length > 0){
            let vendorName = vendorCheckResult[0][0].firstName + " " + vendorCheckResult[0][0].lastName;
            let vendorEmail = vendorCheckResult[0][0].email;
            vendorNamearr.push(vendorName);
            vendorEmailarr.push(vendorEmail);

          }else{
            return res.send("Vendor not found");
          }
        }
        const tenantName = tenantLandlordResult[0][0].firstName + " " + tenantLandlordResult[0][0].lastName; 
        const tenantEmail = tenantLandlordResult[0][0].email;
        const CompanyName = tenantLandlordResult[0][0].companyName;
        const landlordName = tenantLandlordResult[0][0].FirstName + " " + tenantLandlordResult[0][0].LastName;
        const landlordContact = tenantLandlordResult[0][0].Phone;
        const landlordEmail = tenantLandlordResult[0][0].Email;

        const vendorNames = vendorNamearr.toString();

        if (notifyTenant.toLowerCase() === "yes") {
          await taskSendMail(
            tenantName,
            tenantEmail,
            "Property Maintenance: " + taskName,
            dueDate,
            landlordName,
            taskName,
            vendorNames,
            priority,
            CompanyName,
            landlordContact
          );
        }
        if (notifyVendor.toLowerCase() === "yes") {
          console.log("vendor1");
        for(let i = 0; i < vendorEmailarr.length > 0; i++){
          console.log("vendor2");
          await taskSendMail(
            tenantName,
            vendorEmailarr[i],
            "Property Maintenance: " + taskName,
            dueDate,
            landlordName,
            taskName,
            vendorNames,
            priority,
            CompanyName,
            landlordContact
          );
        }
        console.log("vendor3");
        }

    }
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
}; 
//  #############################  ADD TASK ENDS HERE ##################################################


//  ############################# Get ALL Task Start ############################################################
exports.getAllTask = async (req, res) => {
  const { userId } = req.body;
  try {
    const allTaskResult = await queryRunner(Alltasks, [userId]);

    if (allTaskResult.length > 0) {
      for (let i = 0; i < allTaskResult[0].length; i++) {
        const taskID = allTaskResult[0][i].id;
        const assignToResult = await queryRunner(
          selectQuery("taskassignto", "taskId"),
          [taskID]
        );
        const vendorIDs = assignToResult[0].map((vendor) => vendor.vendorId);

        const vendorData = [];

        for (let j = 0; j < vendorIDs.length; j++) {
          const vendorResult = await queryRunner(
            selectQuery("vendor", "id"),
            [vendorIDs[j]]
          );

          if (vendorResult.length > 0) {
            const vendor = {
              name: vendorResult[0][0].firstName,
              email: vendorResult[0][0].email,
            };
            vendorData.push(vendor);
          }
        }

        allTaskResult[0][i].AssignTo = vendorData;
      }

      res.status(200).json({
        data: allTaskResult,
        message: "All Tasks",
      });
    } else {
      res.status(400).json({
        message: "No Tasks data found",
      });
    }
  } catch (error) {
    console.log("Error:", error);
    res.send("Error Get Tasks");
  }
};
//  ############################# Get ALL Task End ############################################################
