const user = require("../models/user");
const { sendMail, taskSendMail } = require("../sendmail/sendmail");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const fs = require('fs');
const Path = require('path');
const imageToDelete = require('./../middleware/deleteImage.js')
const { serialize } = require('cookie');
const {
  selectQuery,
  deleteQuery,
  getAllInvoiceTenantQuery,
  AlltasksTenantsQuery,
  getTenantsById,
  getTenantTotalAmountUnpaid,
  getTenantTotalAmountPaid,
  getTenantTotalAmount,
  addTasksQuerytenant,
  insertInTaskImage,
  addVendorList,
  taskByIDQuery
} = require("../constants/queries");
const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const { file } = require("googleapis/build/src/apis/file");
const config = process.env;

 




    //  ############################# View All Invoices Tenant Start ############################################################
    exports.getAllInvoicesTenant = async (req, res) => {
        try {
          // console.log("1");
        const {userId} = req.user; 
        // const {userId,userName} = req.user;
        // console.log(userId,userName) 
          const getAllInvoicesResult = await queryRunner(getAllInvoiceTenantQuery, [userId]);
          // console.log(getAllInvoicesResult[0])
          // console.log("2");

          if (getAllInvoicesResult[0].length > 0) {
            for (let i = 0; i < getAllInvoicesResult[0].length; i++){
                const invoiceID = getAllInvoicesResult[0][i].invoiceID;
                const invoicelineitemsResult = await queryRunner(selectQuery("invoicelineitems", "invoiceID"), [invoiceID]);
                if (invoicelineitemsResult[0].length > 0) {
                    const memo = invoicelineitemsResult[0].map((desc)=>({memo:desc.memo, category:desc.category, amount:desc.amount,property:desc.property}))
                    getAllInvoicesResult[0][i].memo = memo
                } else {
                    getAllInvoicesResult[0][i].memo = ["No memo"]
                }
            }
            res.status(200).json({
              data: getAllInvoicesResult,
              message: 'All Invoice get successful'
            })
          } else {
            res.status(200).json({
              message: 'No data found'
            })
          }
        } catch (error) {
          console.log(error)
          res.send('Error in All Invoice ' , error)
        }
      }
      //  ############################# View All Invoice Tenant End ############################################################
    
    
      //  #############################Invoice By ID Start ############################################################
    //   getByIdInvoices from invoiceController file
      //  #############################Invoice By ID END  ############################################################


      //  ############################# Get ALL Task Start ############################################################
exports.getAllTaskTenant = async (req, res) => {
    // const { userId } = req.user;
    const { userId } = req.user;
    try {
      // get data from task table by landlordID
      const allTaskResult = await queryRunner(AlltasksTenantsQuery, [userId]);
      // if data found then\
      if (allTaskResult.length > 0) {
        // loop through all task result
        for (let i = 0; i < allTaskResult[0].length; i++) {
          // get task id from task table
          const taskID = allTaskResult[0][i].id;
          // get data from taskassignto table by taskID
          const assignToResult = await queryRunner(
            selectQuery("taskassignto", "taskId"),
            [taskID]
          );
          // if data found then get vendor id from taskassignto table
          const vendorIDs = assignToResult[0].map((vendor) => vendor.vendorId);
  
          const vendorData = [];
        //  loop through vendor id 
          for (let j = 0; j < vendorIDs.length; j++) {
            // get data from vendor table by vendor id
            const vendorResult = await queryRunner(
              selectQuery("vendor", "id"),
              [vendorIDs[j]]
            );
            // if data found then push data in vendorData array
            if (vendorResult[0].length > 0) {
              const vendor = {
                ID : vendorResult[0][0].id || "N/A",
                name: vendorResult[0][0].firstName + " "+ vendorResult[0][0].lastName || "N/A",
                email: vendorResult[0][0].email || "N/A",
                vendorPhone:vendorResult[0][0].phone || "N/A"
              };
              vendorData.push(vendor);
            }
          }
          // assign vendorData array to assignTo property of allTaskResult
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
      res.send("Error Get Tasks" + error);
    }
  };
// get tenant dashboard data
exports.getTenantDashboardData = async (req, res) => {
  try {
    const { userId } = req.user;
    const totalAmount = await queryRunner(getTenantTotalAmount, [
      userId
    ]);
    const totalAmountUnpaid = await queryRunner(getTenantTotalAmountUnpaid, [
      userId
    ]);
    const totalAmountPaid = await queryRunner(getTenantTotalAmountPaid, [
      userId
    ]);
    res.status(200).json({
      totalAmount: totalAmount[0][0],
      totalAmountUnpaid: totalAmountUnpaid[0][0],
      totalAmountPaid: totalAmountPaid[0][0],
    })
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}
// get tenant dashboard data
  // exports.getAllLoggedInTenantTask = async (req, res) => {
  //   const { userId } = req.user;
  //   try {
  //     // get data from task table by landlordID
  //     const allTaskResult = await queryRunner(AlltasksTenantsQuery, [userId]);
  //     // if data found then
  //     if (allTaskResult.length > 0) {
  //       // loop through all task result
  //       for (let i = 0; i < allTaskResult[0].length; i++) {
  //         // get task id from task table
  //         const taskID = allTaskResult[0][i].id;
  //         // get data from taskassignto table by taskID
  //         const assignToResult = await queryRunner(
  //           selectQuery("taskassignto", "taskId"),
  //           [taskID]
  //         );
  //         // if data found then get vendor id from taskassignto table
  //         const vendorIDs = assignToResult[0].map((vendor) => vendor.vendorId);
  
  //         const vendorData = [];
  //       //  loop through vendor id 
  //         for (let j = 0; j < vendorIDs.length; j++) {
  //           // get data from vendor table by vendor id
  //           const vendorResult = await queryRunner(
  //             selectQuery("vendor", "id"),
  //             [vendorIDs[j]]
  //           );
  //           // if data found then push data in vendorData array
  //           if (vendorResult.length > 0) {
  //             const vendor = {
  //               ID : vendorResult[0][0].id,
  //               name: vendorResult[0][0].firstName + " "+ vendorResult[0][0].lastName,
  //               email: vendorResult[0][0].email,
  //               vendorPhone:vendorResult[0][0].phone
  //             };
  //             vendorData.push(vendor);
  //           }
  //         }
  //         // assign vendorData array to assignTo property of allTaskResult
  //         allTaskResult[0][i].AssignTo = vendorData;
  //       }
  //       res.status(200).json({
  //         data: allTaskResult,
  //         message: "All Tasks",
  //       });
  //     } else {
  //       res.status(400).json({
  //         message: "No Tasks data found",
  //       });
  //     }
  //   } catch (error) {
  //     console.log("Error:", error);
  //     res.send("Error Get Tasks");
  //   }
  // };

  exports.getTenantByID = async (req, res) => {
    try {
      // con
      // const { userId } = req.user;
      const { userId } = req.body;
      console.log(userId)
      const TenantsByIDResult = await queryRunner(getTenantsById, [userId])
      if (TenantsByIDResult[0].length > 0) {
        const data = JSON.parse(JSON.stringify(TenantsByIDResult))
        // console.log(data[0][0])
        res.status(200).json({
          data: data[0][0],
          message: 'Tenants By ID'
        })
      } else {
        res.status(400).json({
          message: 'No data found'
        })
      }
    } catch (error) {
      res.send('Error Get Tenants By ID')
      console.log(error)
    }
  }
  //  ############################# Get ALL Task End ############################################################

  //  #############################  ADD TASK Start HERE ##################################################
exports.addTasksTenant = async (req, res) => {
  const {
    task,
    status,
    priority,
    note,
    notifyLandlord,
    images,
    
  } = req.body;
  
  // const { userId, userName, landlordID,phoneNumber, email } = req.user;
  const { userId, userName, landlordID,phoneNumber, email } = req.user;
  const currentDate = new Date();
  
  try {
    // console.log(1);
    const addTasksCheckResult = await queryRunner(
      selectQuery("task", "taskName", "tenantID"),
      [task, userId]
    );
    if (addTasksCheckResult[0].length > 0) {
      return res.send("Task already exists");
    } else {
      const TasksResult = await queryRunner(addTasksQuerytenant, [
        task,
        userId,
        "Not Set",
        status,
        priority,
        note,
        notifyLandlord,
        currentDate,
        "Tenant",
        landlordID,
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
        const propertyImageResult = await queryRunner(insertInTaskImage, [
          tasksID,
          image_url,
          image_key
        ]);
        if (propertyImageResult.affectedRows === 0) {
          throw new Error("data doesn't inserted in property image table");
        }
      }
      }
      //   //  add vendor
        const Vendorid = "Not Assigned";
        const vendorResults = await queryRunner(addVendorList, [
          tasksID,
          Vendorid,
        ]);
        if (vendorResults.affectedRows === 0) {
          return res.send("Error2");
        }
        const landlordCheckResult = await queryRunner(selectQuery("users", "id"),[landlordID]);
        // if()
      const landlordName = landlordCheckResult[0][0].FirstName + " " + landlordCheckResult[0][0].LastName;
      const landlordEmail = landlordCheckResult[0][0].Email;
      const CompanyName = landlordCheckResult[0][0].BusinessName || "N/A";
      // const landlordName = landlordCheckResult[0][0].FirstName + " " + landlordCheckResult[0][0].LastName;
      // const landlordContact = landlordCheckResult[0][0].Phone;
      // const vendorNames = vendorNamearr.toString();
      if (notifyLandlord.toLowerCase() === "yes") {
        await taskSendMail(
          landlordName,
          "Property Maintenance: " + task,
          "Not Set",
          userName,
          task,
          "Not Assigned",
          priority,
          CompanyName,
          phoneNumber,
          userId,
          landlordEmail,
        );
      }
    }
    return res.send("Task Created Successfully");
  } catch (error) {
    console.log(error)
    res.status(400).send(error);
  }
};
//  #############################  ADD TASK ENDS HERE ##################################################

//  ############################# Task By ID Tenant Start ############################################################
exports.taskByIDTenant = async (req, res) => {
  // const { Id } = req.body;
  const { Id } = req.user;
  try {
    const taskByIDResult = await queryRunner(taskByIDQuery, [Id]);
    if (taskByIDResult.length > 0) {
      const TaskImagesResult = await queryRunner(selectQuery("taskimages", "taskID"), [Id]);
      if (TaskImagesResult[0].length > 0) {
        const taskImages = TaskImagesResult[0].map((image) => image.Image);
        taskByIDResult[0][0].taskImages = taskImages;
      } else {
        taskByIDResult[0][0].taskImages = ["No Task Images Found"];
      }
      const TaskAssignToResult = await queryRunner(
        selectQuery("taskassignto", "taskId"),
        [Id]
      );
      if (TaskAssignToResult[0].length > 0) {
      const vendorIDs = TaskAssignToResult[0].map((vendorID) => vendorID.vendorId);
      const vendorData = [];
      for (let i = 0; i < vendorIDs.length; i++) {
        const vID = vendorIDs[i];
        const vendorResult = await queryRunner(
          selectQuery("vendor", "id"),
          [vID]
        );
        if (vendorResult[0].length > 0) {
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
      }else{
        taskByIDResult[0][0].vendor = ["No vendor data found"];
      }

      
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
    res.send("Error Get Tasks",error);
  }
};

//  ############################# Task By ID Tenant End ############################################################
