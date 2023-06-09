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
      ]);
      if (TasksResult.affectedRows === 0) {
        return res.status(400).send("Error1");
      } else {
        const fileNames = req.files.map((file) => file.filename);
        const tasksID = TasksResult[0].insertId;
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
        //  add vendor
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
        //  add vendor
        const tenantResult = await queryRunner(selectQuery("tenants", "id"), [
          tenantID,
        ]);
        const vendorResult = await queryRunner(selectQuery("vendor", "id"), [
          vendorID,
        ]);
        const landlordResult = await queryRunner(selectQuery("users", "id"), [
          userId,
        ]);

        const tenantName =
          tenantResult[0][0].firstName + " " + tenantResult[0][0].lastName;

        const tenantEmail = tenantResult[0][0].email;

        // const vendorLists = req.body.map((vendor) => vendor.vendorID);
        // console.log(vendorLists);

        const vendorName =
          vendorResult[0][0].firstName + " " + vendorResult[0][0].lastName;

        const CompanyName = tenantResult[0][0].companyName;

        const landlordName =
          landlordResult[0][0].FirstName + " " + landlordResult[0][0].LastName;

        const landlordContact = landlordResult[0][0].Phone;
        const landlordEmail = landlordResult[0][0].Email;

        if (notifyTenant.toLowerCase() === "yes") {
          await taskSendMail(
            tenantName,
            tenantEmail,
            "Property Maintenance: " + taskName,
            dueDate,
            landlordName,
            taskName,
            vendorName,
            priority,
            CompanyName,
            landlordContact
          );
        }
        if (notifyVendor.toLowerCase() === "yes") {
          await taskSendMail(
            tenantName,
            landlordEmail,
            "Property Maintenance: " + taskName,
            dueDate,
            landlordName,
            taskName,
            vendorName,
            priority,
            CompanyName,
            landlordContact
          );
        }
        console.log(tenantEmail);
        res.json({ message: "Task added successfully" });
      }
    }
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
}; 
//  #############################  ADD TASK ENDS HERE ##################################################


