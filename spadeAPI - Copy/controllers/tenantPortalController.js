const user = require("../models/user");
const {sendMail}= require('../sendmail/sendmail.js');
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
  getTenantTotalAmount
} = require("../constants/queries");
const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const { file } = require("googleapis/build/src/apis/file");
const config = process.env;

 




    //  ############################# View All Invoices Tenant Start ############################################################
    exports.getAllInvoicesTenant = async (req, res) => {
        try {
        // const {userId} = req.user; 
        const {userId,userName} = req.user;
        // console.log(userId,userName) 
          const getAllInvoicesResult = await queryRunner(getAllInvoiceTenantQuery, [userId]);
          // console.log(getAllInvoicesResult[0])
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
              message: 'All Invoice successful'
            })
          } else {
            res.status(200).json({
              message: 'No data found'
            })
          }
        } catch (error) {
          console.log(error)
          res.send('All Invoice ')
        }
      }
      //  ############################# View All Invoice Tenant End ############################################################
    
    
      //  #############################Invoice By ID Start ############################################################
    //   getByIdInvoices from invoiceController file
      //  #############################Invoice By ID END  ############################################################


      //  ############################# Get ALL Task Start ############################################################
exports.getAllTaskTenant = async (req, res) => {
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
            if (vendorResult.length > 0) {
              const vendor = {
                ID : vendorResult[0][0].id,
                name: vendorResult[0][0].firstName + " "+ vendorResult[0][0].lastName,
                email: vendorResult[0][0].email,
                vendorPhone:vendorResult[0][0].phone
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
      res.send("Error Get Tasks");
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
      const { userId } = req.user;
      console.log(userId)
      const TenantsByIDResult = await queryRunner(getTenantsById, [userId])
      if (TenantsByIDResult.length > 0) {
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
  
       //  ############################# Task By ID Start ############################################################
    //   getByIdTask from TaskController file
      //  ############################# Task By ID END  ############################################################