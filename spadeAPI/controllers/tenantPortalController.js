const user = require("../models/user");
const sendMail = require('../sendmail/sendmail.js');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const fs = require('fs');
const Path = require('path');
const imageToDelete = require('./../middleware/deleteImage.js')
const { serialize } = require('cookie');
const {
  selectQuery,
  deleteQuery,
  getAllInvoiceTenantQuery
} = require("../constants/queries");
const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const { file } = require("googleapis/build/src/apis/file");
const config = process.env;

 




    //  ############################# View All Invoices Tenant Start ############################################################
    exports.getAllInvoicesTenant = async (req, res) => {
        try {
        // const {userId} = req.user; 
        const {userId} = req.body; 
          const getAllInvoicesResult = await queryRunner(getAllInvoiceTenantQuery, [userId]);
          console.log(getAllInvoicesResult[0])
          if (getAllInvoicesResult[0].length > 0) {
            for (let i = 0; i < getAllInvoicesResult[0].length; i++){
                const invoiceID = getAllInvoicesResult[0][i].invoiceID;
                const invoicelineitemsResult = await queryRunner(selectQuery("invoicelineitems", "invoiceID"), [invoiceID]);
                // console.log(invoicelineitemsResult[0])
                
                if (invoicelineitemsResult[0].length > 0) {
                    const memo = invoicelineitemsResult[0].map((desc)=>({memo:desc.memo, category:desc.category, amount:desc.amount}))
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
    
    