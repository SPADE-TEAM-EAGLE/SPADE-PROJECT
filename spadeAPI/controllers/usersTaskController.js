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
  insertInUserTaskimages, 
  checkUserTaskid,
  addUserTasksQuery,
  addUserList
} = require("../constants/queries");
const { queryRunner } = require("../helper/queryRunner");
const { deleteImageFromS3 } = require("../helper/S3Bucket");




exports.addUsersTask = async (req, res) => {
  const {
    task,
    assignee,
    property,
    propertyUnit,
    dueDate,
    status,
    priority,
    note,
    notifyVendor,
    images,

    // created_at,
    // created_by,
  } = req.body;
  console.log("usertaskController");
  // console.log(req.body);
  const userID = assignee;
  const { userId, userName,taskEmail, idPattern,email } = req.user;
  // const { userId, userName,taskEmail } = req.body;

  const currentDate = new Date();
  try {
    // console.log(1);
    const addTasksCheckResult = await queryRunner(
      selectQuery("user_task", "taskName", "propertyId"),
      [task, property]
    );
    if (addTasksCheckResult[0].length > 0) {
      return res.send("Task already exists");
    } else {
      const taskIdCheckresult = await queryRunner(checkUserTaskid, [userId]);
      let taskId;
      if (taskIdCheckresult[0].length > 0) {
        taskId = taskIdCheckresult[0][0].cTaskId.split("-");
        let lastPart = parseInt(taskId[taskId.length - 1], 10) + 1;
        lastPart = lastPart.toString().padStart(4, '0');
        taskId = `SR-${idPattern}-TASK-${lastPart}`;
      } else {
        taskId = `SR-${idPattern}-TASK-0001`;
      }

      const TasksResult = await queryRunner(addUserTasksQuery, [
        task,
        property,
        propertyUnit,
        dueDate,
        status,
        priority,
        note,
        notifyVendor,
        currentDate,
        userName,
        userId,
        taskId
      ]);
      if (TasksResult.affectedRows === 0) {
        return res.status(400).send("Error1");
      }
      // else {
        const tasksID = TasksResult[0].insertId;
        if(images){
      for (let i = 0; i < images.length; i++) {
        const { image_url } = images[i];
        const { image_key } = images[i];
        const propertyImageResult = await queryRunner(insertInUserTaskimages, [
          tasksID,
          image_url,
          image_key,
        ]);
        // if property image data not inserted into property image table then throw error
        if (propertyImageResult.affectedRows === 0) {
          throw new Error("data doesn't inserted in property image table");
        }
      }
    }
      //   //  add vendor
      for (let i = 0; i < userID.length; i++) {
        const { Vendorid } = userID[i];
        const { Vendorrole } = userID[i];
        const vendorResults = await queryRunner(addUserList, [
          tasksID,
          Vendorid,
          Vendorrole,
        ]);
        if (vendorResults.affectedRows === 0) {
          return res.send("Error2");
        }
      }
      // // get data from database for email send
      // const tenantLandlordResult = await queryRunner(getLandlordTenant, [
      //   userId,
      //   property,
      // ]);
      // let userEmailarr = [];
      // let userNamearr = [];
      // let userCheckResult;
      // let vendorCheckResult;
      // for (let i = 0; i < userID.length; i++) {
      //   if(userId==userID[i]){
      //     userCheckResult = await queryRunner(
      //       selectQuery("users", "id"),
      //       [userID[i]]
      //     );
      //     if(userCheckResult.length>0){
      //       if(userCheckResult[0][0].email==email){

      //       }
      //     }
      //   }else{
      //     vendorCheckResult = await queryRunner(
      //       selectQuery("userPUsers", "id"),
      //       [userID[i]]
      //     );
      //     if (vendorCheckResult.length > 0) {
      //       let vendorName =
      //         vendorCheckResult[0][0].UFirstName +
      //         " " +
      //         vendorCheckResult[0][0].ULastName;
      //       let vendorEmail = vendorCheckResult[0][0].UEmail;
      //       userNamearr.push(vendorName);
      //       userEmailarr.push(vendorEmail);
      //     } 
      //     else {
      //       return res.send("Vendor not found");
      //     }
      //   }
        
        
      // }
      // // console.log(tenantLandlordResult[0])
      // // const tenantName =
      // //   tenantLandlordResult[0][0].firstName +
      // //   " " +
      // //   tenantLandlordResult[0][0].lastName;
      // // const tenantEmail = tenantLandlordResult[0][0].email;
      // // const CompanyName = tenantLandlordResult[0][0].companyName;
      // // const landlordName =
      // //   tenantLandlordResult[0][0].FirstName +
      // //   " " +
      // //   tenantLandlordResult[0][0].LastName;
      // // const landlordContact = tenantLandlordResult[0][0].Phone;

      // // const vendorNames = vendorNamearr.toString();

      // // if (notifyTenant.toLowerCase() === "yes") {
      // // await taskSendMail(
      // //   tenantName,
      // //   "Property Maintenance: " + task,
      // //   dueDate,
      // //   landlordName,
      // //   task,
      // //   vendorNames,
      // //   priority,
      // //   CompanyName,
      // //   landlordContact,
      // //   userId,
      // //   tenantEmail,
      // //   taskEmail
      // // );
      // // }
      // if (notifyVendor.toLowerCase() === "yes") {
      // for (let i = 0; i < vendorEmailarr.length > 0; i++) {
      //   // console.log("vendor2");
      //   await taskSendMail(
      //     tenantName,
      //     "Property Maintenance: " + task,
      //     dueDate,
      //     landlordName,
      //     task,
      //     vendorNames,
      //     priority,
      //     CompanyName,
      //     landlordContact,
      //     userId,
      //     vendorEmailarr[i],
      //     taskEmail
      //   );
      //   }
      // }
    }
    return res.status(200).json({message : "User task created"});
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server Error",
      error: error.message,
  });
  }
};





//  ############################# Get ALL users Task Start ############################################################
// exports.getAllUserTask = async (req, res) => {
//     const { userId } = req.user;
//     // const { userId } = req.user;
//     try {
//       const allTaskResult = await queryRunner(Alltasks, [userId]);
  
//       if (allTaskResult.length > 0) {
//         for (let i = 0; i < allTaskResult[0].length; i++) {
//           const taskID = allTaskResult[0][i].id;
//           const assignToResult = await queryRunner(
//             selectQuery("taskassignto", "taskId"),
//             [taskID]
//           );
//           const vendorIDs = assignToResult[0].map((vendor) => vendor.vendorId);
  
//           const vendorData = [];
  
//           for (let j = 0; j < vendorIDs.length; j++) {
//             const vendorResult = await queryRunner(selectQuery("vendor", "id"), [
//               vendorIDs[j],
//             ]);
  
//             if (vendorResult[0].length > 0) {
//               const vendor = {
//                 ID: vendorResult[0][0].id,
//                 name:
//                   vendorResult[0][0].firstName +
//                   " " +
//                   vendorResult[0][0].lastName,
//                 email: vendorResult[0][0].email,
//                 vendorPhone: vendorResult[0][0].phone,
//               };
//               vendorData.push(vendor);
//             }
//           }
//           allTaskResult[0][i].AssignTo = vendorData;
//         }
//         // console.log(allTaskResult)
//         res.status(200).json({
//           data: allTaskResult,
//           message: "All Tasks",
//         });
//       } else {
//         res.status(400).json({
//           message: "No Tasks data found",
//         });
//       }
//     } catch (error) {
//       return res.status(500).json({
//         message: "Internal server Error",
//         error: error.message,
//     });
//     }
//   };
  //  ############################# Get ALL users Task End ############################################################
  