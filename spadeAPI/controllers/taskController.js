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
  addVendorList,
  getLandlordTenant,
  Alltasks,
  AlltasksTenantsLandlord,
  taskByIDQuery,
  updateTasksQuery,
  selectVendorCategory,
  getVendors,
  delteImageForTaskImages,
  addVendorCategory,
  updateVendorCategory,
  taskCount,
  updateVendor,
} = require("../constants/queries");
const { queryRunner } = require("../helper/queryRunner");
const { deleteImageFromS3 } = require("../helper/S3Bucket");

//  #############################  ADD VENDOR ##################################################
exports.addVendors = async (req, res) => {
  const {
    firstName,
    lastName,
    businessName,
    streetAddress,
    city,
    zip,
    workPhone,
    phone,
    email,
    categoryID,
  } = req.body;
  const { userId } = req.user;
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
        userId,
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

exports.updateVendor = async (req, res) => {
  const {
    vendId,
    firstName,
    lastName,
    businessName,
    streetAddress,
    city,
    zip,
    workPhone,
    phone,
    email,
    categoryID,
  } = req.body;
  const { userId } = req.user;
  // console.log(userId)
  try {
    const updateVendorResult = await queryRunner(updateVendor, [
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
      vendId,
    ]);
    if (updateVendorResult[0].affectedRows > 0) {
      res.status(200).json({
        message: " Vendor Updated successful",
      });
    }else{
      res.status(400).json({
        message: " Vendor not Updated successful",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
// delete vendor by id
exports.deleteVendor = async (req, res) => {
    try {
      const { vendorID } = req.params;
      const deleteVendorResult = await queryRunner(
        deleteQuery("vendor", "id"),
        [vendorID]
      );
      if (deleteVendorResult[0].affectedRows > 0) {
        res.status(200).json({
          message: "Vendor Deleted successful",
        });
      }else{
        res.status(400).json({
          message: "Vendor not Deleted successful",
        });
      }     
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
}
//  #############################  ADD VENDOR ENDS HERE ##################################################

//  #############################  All VENDOR Start HERE ##################################################
exports.getAllVendors = async (req, res) => {
  const { userId, userName } = req.user;
  // console.log(userId)
  try {
    const getVendorAPI = await queryRunner(getVendors, [userId]);
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
// exports.addTasks = async (req, res) => {
//   const {
//     task,
//     assignee,
//     property,
//     dueDate,
//     status,
//     priority,
//     note,
//     notifyTenant,
//     notifyVendor,
//     images
//     // created_at,
//     // created_by,
//   } = req.body;
//   console.log(req.body)
//   const vendorID = assignee
//   //   const { userId } = req.user
//   const { userId, userName, email } = req.user;
//   // console.log(userId, userName)
//   // console.log(req.user)
//   // find user by email

//   const currentDate = new Date();
//   try {
//     const addTasksCheckResult = await queryRunner(
//       selectQuery("task", "taskName", "tenantID"),
//       [task, property]
//     );
//     if (addTasksCheckResult[0].length > 0) {
//       return res.send("Task already exists");
//     } else {
//       const TasksResult = await queryRunner(addTasksQuery, [
//         task,
//         property,
//         dueDate,
//         status,
//         priority,
//         note,
//         notifyTenant,
//         notifyVendor,
//         currentDate,
//         userName,
//         userId
//       ]);
//       if (TasksResult.affectedRows === 0) {
//         return res.status(400).send("Error1");
//       }
//       if (TasksResult[0].affectedRows > 0) {
//         const mailSubject = "Property Maintenance: " + task;
//         const landlordUser = await queryRunner(selectQuery("users", "id"), [
//           userId
//         ]);
//         console.log(landlordUser[0])
//         const FullName = landlordUser[0][0].FirstName + " " + landlordUser[0][0].LastName;
//         await taskSendMail("tenantName", mailSubject, dueDate, FullName, task, "assignedTo", priority, "companyName", "contactLandlord", landlordUser[0][0].id, landlordUser[0][0].Email);
//       }
//       const tasksID = TasksResult[0].insertId;
//       // console.log(req.files)
//       // if (images) {
//       //   const fileNames = images;
//       //   for (let i = 0; i < fileNames.length; i++) {
//       //     const taskImages = fileNames[i].image_url;;
//       //     const taskImagesKey = fileNames[i].image_key;
//       //     const taskImageResult = await queryRunner(insertInTaskImage, [
//       //       tasksID,
//       //       taskImages,
//       //       taskImagesKey
//       //     ]);
//       //     if (taskImageResult.affectedRows === 0) {
//       //       return res.send("Error2");
//       //     }
//       //   }
//       // }
//       for (let i = 0; i < images.length; i++) {
//         const { image_url } = images[i];
//         const { image_key } = images[i];
//         const propertyImageResult = await queryRunner(insertInTaskImage, [
//           tasksID,
//           image_url,
//           image_key
//         ]);
//         // if property image data not inserted into property image table then throw error
//         if (propertyImageResult.affectedRows === 0) {
//           throw new Error("data doesn't inserted in property image table");
//         }
//       }
//       //   //  add vendor
//       for (let i = 0; i < vendorID.length; i++) {
//         const Vendorid = vendorID[i];
//         const vendorResults = await queryRunner(addVendorList, [
//           tasksID,
//           Vendorid,
//         ]);
//         if (vendorResults.affectedRows === 0) {
//           return res.send("Error2");
//         }
//       }
//       // get data from database for email send
//       const tenantLandlordResult = await queryRunner(getLandlordTenant, [userId, property]);
//       let vendorEmailarr = [];
//       let vendorNamearr = [];
//       // for (let i = 0; i < vendorID.length; i++) {
//       //   const vendorCheckResult = await queryRunner(selectQuery("vendor", "id"), [vendorID[i]]);
//       //   if (vendorCheckResult.length > 0) {
//       //     let vendorName = vendorCheckResult[0][0].firstName + " " + vendorCheckResult[0][0].lastName;
//       //     let vendorEmail = vendorCheckResult[0][0].email;
//       //     vendorNamearr.push(vendorName);
//       //     vendorEmailarr.push(vendorEmail);

//       //   } else {
//       //     return res.send("Vendor not found");
//       //   }
//       // }
//       console.log(tenantLandlordResult[0])
//       if (tenantLandlordResult[0][0]) {
//         const tenantName = tenantLandlordResult[0][0].firstName + " " + tenantLandlordResult[0][0].lastName;
//         const tenantEmail = tenantLandlordResult[0][0].email;
//         const CompanyName = tenantLandlordResult[0][0].companyName;
//         const landlordName = tenantLandlordResult[0][0].FirstName + " " + tenantLandlordResult[0][0].LastName;
//         const landlordContact = tenantLandlordResult[0][0].Phone;
//         const landlordEmail = tenantLandlordResult[0][0].Email;

//         const vendorNames = vendorNamearr.toString();

//         if (notifyTenant.toLowerCase() === "yes") {
//           await taskSendMail(
//             tenantName,
//             tenantEmail,
//             "Property Maintenance: " + task,
//             dueDate,
//             landlordName,
//             task,
//             vendorNames,
//             priority,
//             CompanyName,
//             landlordContact,
//             userId,
//             email
//           );
//         }
//         if (notifyVendor.toLowerCase() === "yes") {
//           // console.log("vendor1");
//           for (let i = 0; i < vendorEmailarr.length > 0; i++) {
//             // console.log("vendor2");
//             await taskSendMail(
//               tenantName,
//               vendorEmailarr[i],
//               "Property Maintenance: " + task,
//               dueDate,
//               landlordName,
//               task,
//               vendorNames,
//               priority,
//               CompanyName,
//               landlordContact
//             );
//           }
//           // console.log("vendor3");
//         }
//       }
//     }
//     //  send responce as a notification message
//     res.status(200).json({
//       message: "Assigned a task",
//     });

//   } catch (error) {
//     res.status(400).send(error);
//     console.log(error);
//   }
// };
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
    images,

    // created_at,
    // created_by,
  } = req.body;
  console.log(req.body);
  const vendorID = assignee;
  const { userId, userName,taskEmail } = req.user;

  const currentDate = new Date();
  try {
    // console.log(1);
    const addTasksCheckResult = await queryRunner(
      selectQuery("task", "taskName", "tenantID"),
      [task, property]
    );
    if (addTasksCheckResult[0].length > 0) {
      return res.send("Task already exists");
    } else {
      // taskName, tenantID, dueDate,status, priority, notes, notifyTenant, notifyVendor, created_at , createdBy,landlordID
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
        userId,
      ]);
      if (TasksResult.affectedRows === 0) {
        return res.status(400).send("Error1");
      }
      // else {
      const tasksID = TasksResult[0].insertId;
      for (let i = 0; i < images.length; i++) {
        const { image_url } = images[i];
        const { image_key } = images[i];
        const propertyImageResult = await queryRunner(insertInTaskImage, [
          tasksID,
          image_url,
          image_key,
        ]);
        // if property image data not inserted into property image table then throw error
        if (propertyImageResult.affectedRows === 0) {
          throw new Error("data doesn't inserted in property image table");
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
      // get data from database for email send
      const tenantLandlordResult = await queryRunner(getLandlordTenant, [
        userId,
        property,
      ]);
      let vendorEmailarr = [];
      let vendorNamearr = [];
      for (let i = 0; i < vendorID.length; i++) {
        const vendorCheckResult = await queryRunner(
          selectQuery("vendor", "id"),
          [vendorID[i]]
        );
        if (vendorCheckResult.length > 0) {
          let vendorName =
            vendorCheckResult[0][0].firstName +
            " " +
            vendorCheckResult[0][0].lastName;
          let vendorEmail = vendorCheckResult[0][0].email;
          vendorNamearr.push(vendorName);
          vendorEmailarr.push(vendorEmail);
        } else {
          return res.send("Vendor not found");
        }
      }
      // console.log(tenantLandlordResult[0])
      const tenantName =
        tenantLandlordResult[0][0].firstName +
        " " +
        tenantLandlordResult[0][0].lastName;
      const tenantEmail = tenantLandlordResult[0][0].email;
      const CompanyName = tenantLandlordResult[0][0].companyName;
      const landlordName =
        tenantLandlordResult[0][0].FirstName +
        " " +
        tenantLandlordResult[0][0].LastName;
      const landlordContact = tenantLandlordResult[0][0].Phone;

      const vendorNames = vendorNamearr.toString();

      if (notifyTenant.toLowerCase() === "yes") {
      await taskSendMail(
        tenantName,
        "Property Maintenance: " + task,
        dueDate,
        landlordName,
        task,
        vendorNames,
        priority,
        CompanyName,
        landlordContact,
        userId,
        tenantEmail,
        taskEmail
      );
      }
      if (notifyVendor.toLowerCase() === "yes") {
      for (let i = 0; i < vendorEmailarr.length > 0; i++) {
        console.log("vendor2");
        await taskSendMail(
          tenantName,
          "Property Maintenance: " + task,
          dueDate,
          landlordName,
          task,
          vendorNames,
          priority,
          CompanyName,
          landlordContact,
          userId,
          vendorEmailarr[i],
          taskEmail
        );
        }
      }
    }
    return res.send("Created");
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
//  #############################  ADD TASK ENDS HERE ##################################################

//  ############################# Get ALL Task Start ############################################################
exports.getAllTask = async (req, res) => {
  const { userId } = req.user;
  // const { userId } = req.user;
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
          const vendorResult = await queryRunner(selectQuery("vendor", "id"), [
            vendorIDs[j],
          ]);

          if (vendorResult[0].length > 0) {
            const vendor = {
              ID: vendorResult[0][0].id,
              name:
                vendorResult[0][0].firstName +
                " " +
                vendorResult[0][0].lastName,
              email: vendorResult[0][0].email,
              vendorPhone: vendorResult[0][0].phone,
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
    res.send("Error Get Tasks" + error);
  }
};
//  ############################# Get ALL Task End ############################################################

//  ############################# Task By ID Start ############################################################
exports.taskByID = async (req, res) => {
  const { Id } = req.body;
  try {
    const taskByIDResult = await queryRunner(taskByIDQuery, [Id]);
    if (taskByIDResult.length > 0) {
      const TaskImagesResult = await queryRunner(
        selectQuery("taskimages", "taskID"),
        [Id]
      );
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
      const vendorIDs = TaskAssignToResult[0].map(
        (vendorID) => vendorID.vendorId
      );
      const vendorData = [];
      for (let i = 0; i < vendorIDs.length; i++) {
        const vID = vendorIDs[i];
        const vendorResult = await queryRunner(selectQuery("vendor", "id"), [
          vID,
        ]);
        if (vendorResult.length > 0) {
          const categoryIDs = vendorResult[0][0].categoryID;
          const VendorCategoryResult = await queryRunner(
            selectQuery("vendorcategory", "id"),
            [categoryIDs]
          );
          if (VendorCategoryResult.length > 0) {
            const vendorDataObject = {
              name:
                vendorResult[0][0].firstName +
                " " +
                vendorResult[0][0].lastName,
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
    // const landlordID = req.userid;
    const { userId } = req.user;
    const categoryResult = await queryRunner(
      selectQuery("vendorcategory", "landLordId"),
      [userId]
    );
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
    const { userId, userName } = req.user;
    // const {userId}=req.body
    const vendorResult = await queryRunner(
      selectQuery("vendor", "LandlordID"),
      [userId]
    );
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
    images,
  } = req.body;

  try {
    const currentDate = new Date();
    const { userId,taskEmail } = req.user;
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
      taskID,
    ]);
    if (TasksResult[0].affectedRows === 0) {
      // throw new Error("data doesn't inserted in task table");
      res.send("Error1");
    }
    const propertycheckresult = await queryRunner(
      selectQuery("taskimages", "taskID"),
      [taskID]
    );
    // images working code start here
    console.log(propertycheckresult[0]);
    if (propertycheckresult[0].length > 0) {
      const propertyImageKeys = propertycheckresult[0].map(
        (image) => image.ImageKey
      );
      // console.log("images" ,images)
      console.log(propertyImageKeys);
      // Find the images to delete from S3 (present in propertycheckresult but not in images)
      const imagesToDelete = propertycheckresult[0].filter(
        (image) => !images.some((img) => img.imageKey === image.ImageKey)
      );
      // Delete images from S3
      console.log(imagesToDelete);
      for (let i = 0; i < imagesToDelete.length; i++) {
        deleteImageFromS3(imagesToDelete[i].ImageKey);
        await queryRunner(delteImageForTaskImages, [
          imagesToDelete[i].ImageKey,
        ]);
      }
      // Find the images to insert into the database (present in images but not in propertycheckresult)
      const imagesToInsert = images.filter(
        (image) => !propertyImageKeys.includes(image.imageKey)
      );
      for (let i = 0; i < imagesToInsert.length; i++) {
        const { image_url } = imagesToInsert[i];
        const { image_key } = imagesToInsert[i];
        const propertyImageResult = await queryRunner(insertInTaskImage, [
          taskID,
          image_url,
          image_key,
        ]);
        // if property image data not inserted into property image table then throw error
        if (propertyImageResult.affectedRows === 0) {
          throw new Error("data doesn't inserted in property image table");
        }
      }
    } else {
      for (let i = 0; i < images.length - 1; i++) {
        const { image_url } = images[i];
        const { image_key } = images[i];
        console.log(taskID, image_url, image_key);

        const propertyImageResult = await queryRunner(insertInTaskImage, [
          taskID,
          image_url,
          image_key,
        ]);
        // if property image data not inserted into property image table then throw error
        if (propertyImageResult.affectedRows === 0) {
          throw new Error("data doesn't inserted in property image table");
        }
      }
    }
    const taskVendorDeleteResult = await queryRunner(
      deleteQuery("taskassignto", "taskId"),
      [taskID]
    );
    const vendorID = assignee;
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
    const tenantLandlordResult = await queryRunner(getLandlordTenant, [
      userId,
      property,
    ]);
    // console.log(tenantLandlordResult)
    let vendorEmailarr = [];
    let vendorNamearr = [];
    for (let i = 0; i < vendorID.length; i++) {
      const vendorCheckResult = await queryRunner(selectQuery("vendor", "id"), [
        vendorID[i],
      ]);
      if (vendorCheckResult.length > 0) {
        let vendorName =
          vendorCheckResult[0][0].firstName +
          " " +
          vendorCheckResult[0][0].lastName;
        let vendorEmail = vendorCheckResult[0][0].email;
        vendorNamearr.push(vendorName);
        vendorEmailarr.push(vendorEmail);
      } else {
        throw new Error("Vendor not found");
      }
    }
    const tenantName =
      tenantLandlordResult[0][0].firstName +
      " " +
      tenantLandlordResult[0][0].lastName;
    const tenantEmail = tenantLandlordResult[0][0].email;
    const CompanyName = tenantLandlordResult[0][0].companyName;
    const landlordName =
      tenantLandlordResult[0][0].FirstName +
      " " +
      tenantLandlordResult[0][0].LastName;
    const landlordContact = tenantLandlordResult[0][0].Phone;
    const landlordEmail = tenantLandlordResult[0][0].Email;

    const vendorNames = vendorNamearr.toString();

    // if (notifyTenant.toLowerCase() === "yes") {
    await taskSendMail(
      tenantName,
      "Property Maintenance: " + taskName,
      dueDate,
      landlordName,
      taskName,
      vendorNames,
      priority,
      CompanyName,
      landlordContact,
      userId,
      tenantEmail,
      taskEmail
    );
    // }
    // if (notifyVendor.toLowerCase() === "yes") {
    for (let i = 0; i < vendorEmailarr.length > 0; i++) {
      console.log("vendor2");
      await taskSendMail(
        tenantName,
        "Property Maintenance: " + taskName,
        dueDate,
        landlordName,
        taskName,
        vendorNames,
        priority,
        CompanyName,
        landlordContact,
        userId,
        vendorEmailarr[i],
        taskEmail
      );
      // }
    }
    return res.status(200).json({
      message: " task updated successful ",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};
//  #############################  Update TASK ENDS HERE ##################################################

//  #############################  Delete Task Start HERE ##################################################

exports.deleteTask = async (req, res) => {
  try {
    const { taskID } = req.body;
    const deleteTaskResult = await queryRunner(deleteQuery("task", "id"), [
      taskID,
    ]);
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

// add vendor category
exports.addVendorCategory = async (req, res) => {
  const categories = req.body;
  const { userId } = req.user;
  try {
    // Extract all unique categoryIds from the request
    // const uniqueCategoryIds = [
    //   ...new Set(categories.map((item) => item.categoryId)),
    // ];

    // Fetch existing categories from the database based on categoryId
    const categoryCheckResult = await queryRunner(
      selectQuery("vendorcategory", "landLordId"),
      [userId]
    );
    const existingCategories = categoryCheckResult[0];

    // Prepare arrays for updates and insertions
    const categoriesToDelete = [];
    
    const categoriesToInsert = [];
    existingCategories.forEach(async(obj1) => {
      // Check if there's a corresponding object in array2 with the same properties
      const obj2 = categories.find((obj) => obj.category.toLowerCase() == obj1.category.toLowerCase());
      if (!obj2) {
        await queryRunner(
          deleteQuery("vendorcategory", "id"),
          [obj1.id]
        );
      }
  });
  categories.forEach(async(obj1) => {
    // Check if there's a corresponding object in array2 with the same properties
    const obj2 = existingCategories.find((obj) => obj.category.toLowerCase() == obj1.category.toLowerCase());

    
    if (!obj2) {
      await queryRunner(addVendorCategory, [
        obj1.category.toLowerCase(),
        userId,
      ]);
    }
});
    res.status(200).json({
      message: "Categories added/updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

// ####################################### Task Count ################################################

exports.taskCount = async (req, res) => {
  try {
    // const { userId } = req.user;
    const { userId } = req.user;
    const { startDate, endDate } = req.body;
    console.log("2");
    const taskCountResult = await queryRunner(taskCount, [
      userId,
      startDate,
      endDate,
    ]);
    console.log("3");

    res.status(200).json({
      data: taskCountResult,
    });
    // }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// ####################################### Task Count ################################################

//  ############################# Get ALL Task Start ############################################################
exports.getAllTaskTenantRequest = async (req, res) => {
  // const { userId } = req.body;
  const { userId } = req.user;
  try {
    const allTaskResult = await queryRunner(AlltasksTenantsLandlord, [userId]);

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
          const vendorResult = await queryRunner(selectQuery("vendor", "id"), [
            vendorIDs[j],
          ]);

          if (vendorResult[0].length > 0) {
            const vendor = {
              ID: vendorResult[0][0].id,
              name:
                vendorResult[0][0].firstName +
                " " +
                vendorResult[0][0].lastName,
              email: vendorResult[0][0].email,
              vendorPhone: vendorResult[0][0].phone,
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
    res.send("Error Get Tasks" + error);
  }
};
//  ############################# Get ALL Task End ############################################################
