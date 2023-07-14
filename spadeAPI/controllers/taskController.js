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
  selectVendorCategory,
  getVendors,
  delteImageForTaskImages
} = require("../constants/queries");
const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const { file } = require("googleapis/build/src/apis/file");
const e = require("express");
const { deleteImageFromS3 } = require("../helper/S3Bucket");
const config = process.env;

//  #############################  ADD VENDOR ##################################################
exports.addVendors = async (req, res) => {
  const {
    firstName,
    lastName,
    businessName,
    streetAddress,
    city,
    // status,
    zip,
    workPhone,
    phone,
    email,
    categoryID,

  } = req.body;
  const { userId } = req.user
  // console.log(userId)
  try {
    const vendorCheckResult = await queryRunner(
      selectQuery("vendor", "email", "landlordID"),
      [email, userId]
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
        // status,
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
    console.log(error);
    res.status(400).send(error);

  }
};
//  #############################  ADD VENDOR ENDS HERE ##################################################


//  #############################  All VENDOR Start HERE ##################################################
exports.getAllVendors = async (req, res) => {
  const { userId, userName } = req.user;
  // console.log(userId)
  try {
    const getVendorAPI = await queryRunner(
      getVendors, [userId]
    );
    // console.log(getVendorAPI)
    if (getVendorAPI[0].length > 0) {
      res.status(200).json({
        data: getVendorAPI,
        name: userName,
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
    task,
    assignee,
    property,
    dueDate,
    status,
    priority,
    note,
    notifyTenant,
    notifyVendor,
    images
    // created_at,
    // created_by,
  } = req.body;
  console.log(req.body)
  const vendorID = assignee
  //   const { userId } = req.user
  const { userId, userName } = req.user;
  // console.log(userId, userName)
  // console.log(req.body)
  const currentDate = new Date();
  try {
    // console.log(1);
    const addTasksCheckResult = await queryRunner(
      selectQuery("task", "taskName", "tenantID"),
      [task, property]
    );
    // console.log(addTasksCheckResult);
    if (addTasksCheckResult[0].length > 0) {
      return res.send("Task already exists");
    } else {
      const TasksResult = await queryRunner(addTasksQuery, [
        task,
        property,
        dueDate,
        status,
        priority,
        note,
        notifyTenant,
        notifyVendor,
        currentDate,
        userName,
        userId
      ]);
      if (TasksResult.affectedRows === 0) {
        return res.status(400).send("Error1");
      }
      // else {
      const tasksID = TasksResult[0].insertId;
      // console.log(req.files)
      // if (images) {
      //   const fileNames = images;
      //   for (let i = 0; i < fileNames.length; i++) {
      //     const taskImages = fileNames[i].image_url;;
      //     const taskImagesKey = fileNames[i].image_key;
      //     const taskImageResult = await queryRunner(insertInTaskImage, [
      //       tasksID,
      //       taskImages,
      //       taskImagesKey
      //     ]);
      //     if (taskImageResult.affectedRows === 0) {
      //       return res.send("Error2");
      //     }
      //   }
      // }
      for (let i = 0; i < images.length; i++) {
        const { image_url } = images[i];
        const { image_key } = images[i];
        const propertyImageResult = await queryRunner(insertInTaskImage, [
          tasksID,
          image_url,
          image_key
        ]);
        // if property image data not inserted into property image table then throw error
        if (propertyImageResult.affectedRows === 0) {
          throw new Error("data doesn't inserted in property image table");
        }
      }
      //   //  add vendor
      // for (let i = 0; i < vendorID.length; i++) {
      //   const Vendorid = vendorID[i];
      //   const vendorResults = await queryRunner(addVendorList, [
      //     tasksID,
      //     Vendorid,
      //   ]);
      //   if (vendorResults.affectedRows === 0) {
      //     return res.send("Error2");
      //   }
      // }
      // get data from database for email send 
      const tenantLandlordResult = await queryRunner(getLandlordTenant, [userId, property]);
      let vendorEmailarr = [];
      let vendorNamearr = [];
      // for (let i = 0; i < vendorID.length; i++) {
      //   const vendorCheckResult = await queryRunner(selectQuery("vendor", "id"), [vendorID[i]]);
      //   if (vendorCheckResult.length > 0) {
      //     let vendorName = vendorCheckResult[0][0].firstName + " " + vendorCheckResult[0][0].lastName;
      //     let vendorEmail = vendorCheckResult[0][0].email;
      //     vendorNamearr.push(vendorName);
      //     vendorEmailarr.push(vendorEmail);

      //   } else {
      //     return res.send("Vendor not found");
      //   }
      // }
      // console.log(tenantLandlordResult[0])
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
          "Property Maintenance: " + task,
          dueDate,
          landlordName,
          task,
          vendorNames,
          priority,
          CompanyName,
          landlordContact
        );
      }
      if (notifyVendor.toLowerCase() === "yes") {
        console.log("vendor1");
        for (let i = 0; i < vendorEmailarr.length > 0; i++) {
          console.log("vendor2");
          await taskSendMail(
            tenantName,
            vendorEmailarr[i],
            "Property Maintenance: " + task,
            dueDate,
            landlordName,
            task,
            vendorNames,
            priority,
            CompanyName,
            landlordContact
          );
        }
        console.log("vendor3");
      }
    }
    return res.send("Created");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
//  #############################  ADD TASK ENDS HERE ##################################################


//  ############################# Get ALL Task Start ############################################################
exports.getAllTask = async (req, res) => {
  // const { userId } = req.user;
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
              ID: vendorResult[0][0].id,
              name: vendorResult[0][0].firstName + " " + vendorResult[0][0].lastName,
              email: vendorResult[0][0].email,
              vendorPhone: vendorResult[0][0].phone
            };
            vendorData.push(vendor);
          }
        }

        allTaskResult[0][i].AssignTo = vendorData;
      }
      // console.log(allTaskResult)
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
      const TaskImagesResult = await queryRunner(selectQuery("taskimages", "taskID"), [Id]);
      if (TaskImagesResult[0].length > 0) {
        const taskImages = TaskImagesResult[0].map((image) => image.taskImages);
        taskByIDResult[0][0].taskImages = taskImages;
      } else {
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
          } else {
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

//  ############################# Get vendor category End ############################################################
exports.getVendorCategory = async (req, res) => {
  try {
    const categoryResult = await queryRunner(selectQuery("vendorcategory"));
    if (categoryResult[0].length > 0) {
      res.status(200).json({
        data: categoryResult[0],
        message: "ALL vendor category",
      });
    } else {
      res.status(400).json({
        message: "No vendor category data found",
      });
    }
  } catch (error) {
    res.send("Error Get category ");
    console.log(error);
  }
};
//  ############################# Get vendor category End ############################################################


//  #############################  Task Assign to Start HERE ##################################################

exports.getVendorAssignTo = async (req, res) => {
  try {
    const { userId, userName } = req.user
    // const {userId}=req.body
    const vendorResult = await queryRunner(selectQuery("vendor", "LandlordID"), [userId]);
    if (vendorResult[0].length > 0) {
      res.status(200).json({
        user: userName,
        data: vendorResult[0],
        message: "ALL vendor Here",
      });
    } else {
      res.status(400).json({
        message: "No vendor data found",
      });
    }
  } catch (error) {
    res.send("Error Get vendor list ");
    console.log(error);
  }
};
//  #############################  Task Assign to ENDS HERE ##################################################



//  #############################  Update TASK Start HERE ##################################################
exports.updateTasks = async (req, res) => {
  const {
    property,
    taskName,
    // assignee,
    taskID,
    dueDate,
    status,
    priority,
    // notes,
    assignee,
    notifyTenant,
    notifyVendor,
    message,
    images
  } = req.body;

  try {
    const currentDate = new Date();
    const { userId } = req.user;
    const TasksResult = await queryRunner(updateTasksQuery, [
      taskName,
      property,
      dueDate,
      status,
      priority,
      message,
      notifyTenant,
      notifyVendor,
      currentDate,
      taskID
    ]);
    if (TasksResult.affectedRows === 0) {
      throw new Error("data doesn't inserted in task table");
    }
    const propertycheckresult = await queryRunner(
      selectQuery("taskimages", "taskID"),
      [taskID]
    );
    // images working code start here 
    if (propertycheckresult[0].length > 0) {
      const propertyImageKeys = propertycheckresult[0].map(image => image.taskImagesKey);
      // console.log("images" ,images)
      // Find the images to delete from S3 (present in propertycheckresult but not in images)
      const imagesToDelete = propertycheckresult[0].filter(image => !images.some(img => img.imageKey === image.taskImagesKey));
      // Delete images from S3
      for (let i = 0; i < imagesToDelete.length; i++) {
        deleteImageFromS3(imagesToDelete[i].taskImagesKey);
        await queryRunner(delteImageForTaskImages, [imagesToDelete[i].taskImagesKey]);
      }
      // Find the images to insert into the database (present in images but not in propertycheckresult)
      const imagesToInsert = images.filter(image => !propertyImageKeys.includes(image.imageKey));
      for (let i = 0; i < imagesToInsert.length; i++) {
        const { image_url } = imagesToInsert[i];
        const { image_key } = imagesToInsert[i];
        const propertyImageResult = await queryRunner(insertInTaskImage, [
          taskID,
          image_url,
          image_key
        ]);
        // if property image data not inserted into property image table then throw error
        if (propertyImageResult.affectedRows === 0) {
          throw new Error("data doesn't inserted in property image table");
        }
      }
      // for (let i = 0; i < images.length; i++) {
      //   const image = images[i].image_url;
      //   const taskImagesDeleteResult = await queryRunner(deleteQuery("taskimages",), [id, images]);
      // }
      // // // console.log(taskCheckResult)
      // // const taskimages = taskCheckResult[0].map((image) => image.taskImages);
      // // // console.log(taskimages)
      // // let existingImg = existingImages.split(",");
      // // const imagesToDelete = taskimages.filter(
      // //   (element) => !existingImg.includes(element)
      // // );

      // // // Combine the common elements with array2
      // //   // console.log("imagesToDeleted",imagesToDelete)
      // // imageToDelete(imagesToDelete);
      // // let taskDeleteresult = [{ affectedRows: 0 }];
      // // // delete images Data into database
      // // if (imagesToDelete.length > 0) {
      // //   for (let i = 0; i < imagesToDelete.length; i++) {
      // //     taskDeleteresult = await queryRunner(
      // //       deleteQuery("taskimages", "taskImages"),
      // //       [imagesToDelete[i]]
      // //     );
      // //     // console.log(taskDeleteresult)
      // //   }
      // // }

      // const fileNames = images;
      // // existingImg = [...fileNames];
      // // using loop to send new images data into database
      // for (let i = 0; i < fileNames.length; i++) {
      //   // const img = existingImg[i];
      //   const image = images[i].image_url;
      //   const key = images[i].image_key;
      //   const propertyImageResult = await queryRunner(insertInTaskImage, [
      //     taskID,
      //     image,
      //     key,
      //   ]);
      //   if (propertyImageResult.affectedRows === 0) {
      //     return res.send("Error2");
      //   }
      // }
    }

    const taskVendorDeleteResult = await queryRunner(deleteQuery("taskassignto", "taskId"), [taskID]);
    const vendorID = assignee.split(",")
    for (let i = 0; i < vendorID.length; i++) {
      const Vendorid = vendorID[i];
      const vendorResults = await queryRunner(addVendorList, [
        taskID,
        Vendorid,
      ]);
      if (vendorResults.affectedRows === 0) {
        return res.send("Error2");
      }
    }
    // // Email Send
    const tenantLandlordResult = await queryRunner(getLandlordTenant, [userId, property]);
    // console.log(tenantLandlordResult)
    let vendorEmailarr = [];
    let vendorNamearr = [];
    for (let i = 0; i < vendorID.length; i++) {
      const vendorCheckResult = await queryRunner(selectQuery("vendor", "id"), [vendorID[i]]);
      if (vendorCheckResult.length > 0) {
        let vendorName = vendorCheckResult[0][0].firstName + " " + vendorCheckResult[0][0].lastName;
        let vendorEmail = vendorCheckResult[0][0].email;
        vendorNamearr.push(vendorName);
        vendorEmailarr.push(vendorEmail);
      } else {
        // return res.send("Vendor not found");
        throw new Error("Vendor not found");
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
      for (let i = 0; i < vendorEmailarr.length > 0; i++) {
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
    }
    return res.status(200).json({
      message: " task updated successful ",
    });

  } catch (error) {
    console.log()
    res.status(400).json({
      message: error.message,
    });
  }
};
//  #############################  Update TASK ENDS HERE ##################################################




//  #############################  Delete Task Start HERE ##################################################

exports.deleteTask = async (req, res) => {
  try {
    const { taskID } = req.body
    const deleteTaskResult = await queryRunner(deleteQuery("task", "id"), [taskID]);
    if (deleteTaskResult[0].affectedRows > 0) {
      res.status(200).json({
        // data: vendorResult[0],
        message: "task Deleted Successful",
      });
    } else {
      res.status(400).json({
        message: "No task data found",
      });
    }
  } catch (error) {
    res.send("Error Get delete task  ");
    console.log(error);
  }
};
//  #############################  Delete Task ENDS HERE ##################################################