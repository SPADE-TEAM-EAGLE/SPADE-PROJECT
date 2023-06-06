const user = require("../models/user");
const sendMail = require('../sendmail/sendmail.js');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const fs = require('fs');
const Path = require('path');
const imageToDelete = require('./../middleware/deleteImage.js')
const { serialize } = require('cookie');
const {
    insertInvoice,
    insertLineItems,
    insertInvoiceImage
} = require("../constants/queries");
const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const config = process.env;


//  ############################# Create Invoice Start ############################################################

exports.createInvoice = async (req, res) => {
    const {
        tenantID,
        invoiceType,
        startDate,
        endDate,
        frequency,
        dueDays,
        repeatTerms,
        terms,
        additionalNote,
        lineItems
 } = req.body;
    // const { userId } = req.user;
    const { userId } = req.body;
    try {
        const currentDate = new Date();
        const invoiceResult = await queryRunner(insertInvoice, [userId, tenantID, invoiceType, startDate, endDate, frequency, dueDays, repeatTerms, terms,additionalNote,"Unpaid",currentDate]);
      if (invoiceResult.affectedRows === 0) {
        res.status(400).send('Error occur in creating invoice');
      } else {
        const invoiceID = invoiceResult[0].insertId;
        if(lineItems){
        for (let i = 0; i < lineItems.length; i++) {
            const category = lineItems[i].category;
        const property = lineItems[i].property;
        const memo = lineItems[i].memo;
        const amount = lineItems[i].amount;
          const invoiceLineItemsResult = await queryRunner(insertLineItems, [invoiceID, category, property, memo, amount])
          if (invoiceLineItemsResult.affectedRows === 0) {
            res.send('Error2');
            return;
          }
          }
          }
          if(req.files){ 

          const fileNames = req.files.map((file) => file.filename);
          for (let i = 0; i < fileNames.length; i++) {
            const img = fileNames[i];
            const invoiceImageResult = await queryRunner(insertInvoiceImage, [invoiceID, img])
            if (invoiceImageResult.affectedRows === 0) {
              res.send('Error3');
              return;
            }
          } //sss
        }  
        
        res.status(200).json({
          message: " Invoice created successful"
        });
      }
    } catch (error) {
      console.log(error)
      res.status(400).send("Error")
    }
  }
  //  ############################# Create Invoice END ############################################################
  