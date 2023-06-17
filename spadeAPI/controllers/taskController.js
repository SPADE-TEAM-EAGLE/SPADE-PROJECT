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
  Alltasks,
  taskByIDQuery,
  updateTasksQuery,
  getVendors
  // addVendor
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
    status,
    zip,
    workPhone,
    phone,
    email,
    categoryID,
  } = req.body;
const {userId}=req.user
// console.log(userId)
  try {
    const vendorCheckResult = await queryRunner(
      selectQuery("vendor", "email","landlordID"),
      [email,userId]
    );

    
    if (vendorCheckResult[0].length > 0) {
      return res.send("Vendor already exists");
    } else {
      // console.log(userId)
      const vendorResult = await queryRunner(addVendor, [
        firstName,
        lastName,
        businessName,
        streetAddress,
        city,
        status,
        zip,
        workPhone,
        phone,
        email,
        categoryID,
        userId
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
  const { userId,userName } = req.user;
  try {
    const getVendorAPI = await queryRunner(
      getVendors,[userId]
    );
      
    if (getVendorAPI[0].length > 0) {
      res.status(200).json({
        data: getVendorAPI,
        name:userName,
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
    // created_at,
    // created_by,
  } = req.body;
  //   const { userId } = req.user
  const { userId, userName } = req.user;
  const currentDate = new Date();
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
        currentDate,
        userName,
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
  const { userId } = req.user;
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
              name: vendorResult[0][0].firstName + " "+ vendorResult[0][0].lastName,
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



//  ############################# Task By ID Start ############################################################
exports.taskByID = async (req, res) => {
  const { Id } = req.body;
  try {
    const taskByIDResult = await queryRunner(taskByIDQuery, [Id]);
    if (taskByIDResult.length > 0) {
      const TaskImagesResult = await queryRunner(selectQuery("taskimages", "taskID"),[Id]);
      if(TaskImagesResult[0].length > 0){
        const taskImages = TaskImagesResult[0].map((image) => image.taskImages);
        taskByIDResult[0][0].taskImages = taskImages;
      }else{
        taskByIDResult[0][0].taskImages = ["No Task Images Found"];
      }
      const TaskAssignToResult = await queryRunner(
        selectQuery("taskassignto", "taskId"),
        [Id]
      );
      const vendorIDs = TaskAssignToResult[0].map((vendorID) => vendorID.vendorId);
      const vendorData = [];
      for (let i = 0; i < vendorIDs.length; i++) {
        const vID = vendorIDs[i];
        const vendorResult = await queryRunner(
          selectQuery("vendor", "id"),
          [vID]
        );
        if (vendorResult.length > 0) {
          const categoryIDs = vendorResult[0][0].categoryID;
          const VendorCategoryResult = await queryRunner(
            selectQuery("vendorcategory", "id"),
            [categoryIDs]
          );
          if (VendorCategoryResult.length > 0) {
            const vendorDataObject = {
              name: vendorResult[0][0].firstName + " " + vendorResult[0][0].lastName,
              businessName: vendorResult[0][0].businessName,
              streetAddress: vendorResult[0][0].streetAddress,
              workNumber: vendorResult[0][0].workNumber,
              mobileNumber: vendorResult[0][0].mobileNumber,
              email: vendorResult[0][0].email,
              category: VendorCategoryResult[0][0].category,
            };
            vendorData.push(vendorDataObject);
          }else{
            vendorData.push(["No Vendor Data Found"]);
          }
        }
      }
        taskByIDResult[0][0].vendor = vendorData;
      res.status(200).json({
        data: taskByIDResult,
        message: "Task data retrieved successfully",
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

//  ############################# Task By ID End ############################################################








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
    notifyVendor 
  } = req.body;
  // const { userId,  } = req.body;
  const { userId, userName } = req.user;
  const currentDate = new Date();
  try {
    
      const TasksResult = await queryRunner(updateTasksQuery, [
        taskName,
        tenantID,
        dueDate,
        status,
        priority,
        notes,
        notifyTenant,
        notifyVendor, 
        currentDate,
        userName,
      ]);
      if (TasksResult.affectedRows === 0) {
        return res.status(400).send("Error1");
      } 
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

  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
}; 
//  #############################  ADD TASK ENDS HERE ##################################################
