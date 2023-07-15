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
  insertInvoice,
  insertLineItems,
  insertInvoiceImage,
  updateInvoiceStatus,
  getAllInvoicesquery,
  getByIdInvoicesQuery,
  updateInvoice,
  resendEmailQuery,
  delteImageForInvoiceImages
} = require("../constants/queries");
const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const { deleteImageFromS3 } = require("../helper/S3Bucket");
const config = process.env;


//  ############################# Create Invoice Start ############################################################

exports.createInvoice = async (req, res) => {
  const {
    tenantID,
    invoiceType,
    startDate,
    endDate,
    frequency,
    dueDate,
    dueDays,
    repeatTerms,
    terms,
    additionalNotes,
    lineItems,
    sendmails,
    totalAmount,
    images
  } = req.body;
  try {
    const { userId } = req.user;
    console.log(req.body)
    // console.log(userId)
    // if (!tenantID || !invoiceType || !startDate || !endDate || !frequency || !dueDate || !dueDays || !repeatTerms || !terms || !additionalNotes || !lineItems || !sendmails || !totalAmount) {
    //   throw new Error("Please fill all the fields");
    // }
    const currentDate = new Date();
    const invoiceResult = await queryRunner(insertInvoice, [userId, tenantID, invoiceType, startDate, endDate, frequency, dueDate, dueDays, repeatTerms, terms, additionalNotes, "Unpaid", currentDate, totalAmount]);
    if (invoiceResult.affectedRows === 0) {
      res.status(400).send('Error occur in creating invoice');
    } else {
      // select tenants 
      const invoiceID = invoiceResult[0].insertId;
      console.log(invoiceID, "invoiceID")
      const selectTenantsResult = await queryRunner(selectQuery('users', 'id'), [userId])
      if (selectTenantsResult[0].length > 0) {
        const landlordEmail = selectTenantsResult[0][0].Email;
        const landlordName = selectTenantsResult[0][0].FirstName + " " + selectTenantsResult[0][0].LastName;
        // send mail to tenant from landlord company
        const mailSubject = invoiceID + " From " + frequency;
        sendMail.invoiceSendMail(landlordName, landlordEmail, mailSubject, dueDays, invoiceID, frequency, userId);
      }

      if (lineItems) {
        for (let i = 0; i < lineItems.length; i++) {
          if (Object.keys(lineItems[i]).length >= 1) {
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
      }
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const { image_url } = images[i];
          const { image_key } = images[i];
          const propertyImageResult = await queryRunner(insertInvoiceImage, [
            invoiceID,
            image_url,
            image_key
          ]);
          // if property image data not inserted into property image table then throw error
          if (propertyImageResult.affectedRows === 0) {
            throw new Error("data doesn't inserted in property image table");
          }
        }
      }
      // if (req.files) {
      //   const fileNames = req.files.map((file) => file.filename);
      //   for (let i = 0; i < fileNames.length; i++) {
      //     const img = fileNames[i];
      //     const invoiceImageResult = await queryRunner(insertInvoiceImage, [invoiceID, img])
      //     if (invoiceImageResult.affectedRows === 0) {
      //       res.send('Error3');
      //       return;
      //     }
      //   } //sss
      // }

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


//  ############################# update Invoice Status Start ############################################################
exports.putInvoiceStatusUpdates = async (req, res) => {
  try {
    const { id, status, note } = req.body
    // console.log(req)
    // const { userId } = req.user; 
    const { userId } = req.user;
    // console.log(req.body,userId)
    const currentDate = new Date();
    const invoiceUpdateStatusResult = await queryRunner(updateInvoiceStatus, [
      status,
      note,
      currentDate,
      id,
      userId,
    ])
    if (invoiceUpdateStatusResult[0].affectedRows > 0) {
      res.status(200).json({
        data: invoiceUpdateStatusResult,
        message: 'Invoice status updated successful'
      })
    } else {
      res.status(400).json({
        message: 'No data found'
      })
    }
  } catch (error) {
    console.log(error)
    res.send('Error Invoice Status update')
  }
}
//  ############################# update Invoice Status End ############################################################




//  ############################# View All Invoices Start ############################################################
exports.getAllInvoices = async (req, res) => {
  try {
    // const { userId } = req.user; 
    // console.log(111)
    const { userId } = req.user;
    // console.log(userId)
    const getAllInvoicesResult = await queryRunner(getAllInvoicesquery, [userId]);
    // console.log(getAllInvoicesResult[0])
    if (getAllInvoicesResult[0].length > 0) {
      for (let i = 0; i < getAllInvoicesResult[0].length; i++) {
        const invoiceID = getAllInvoicesResult[0][i].invoiceID;
        const invoicelineitemsResult = await queryRunner(selectQuery("invoicelineitems", "invoiceID"), [invoiceID]);
        // console.log(invoicelineitemsResult[0])

        if (invoicelineitemsResult[0].length > 0) {
          const memo = invoicelineitemsResult[0].map((desc) => ({ memo: desc.memo, category: desc.category, amount: desc.amount, property: desc.property }))
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
//  ############################# View All Invoice  End ############################################################



//  #############################Invoice By ID Start ############################################################
exports.getByIdInvoices = async (req, res) => {
  try {
    const { invoiceId } = req.body;
    const getAllInvoicesResult = await queryRunner(getByIdInvoicesQuery, [invoiceId]);
    if (getAllInvoicesResult[0].length > 0) {
      const invoicelineitemsResult = await queryRunner(selectQuery("invoicelineitems", "invoiceID"), [invoiceId]);
      if (invoicelineitemsResult[0].length > 0) {
        const memo = invoicelineitemsResult[0].map((desc) => ({
          category: desc.category,
          property: desc.property,
          memo: desc.memo,
          amount: desc.amount
        }))
        // const memo = invoicelineitemsResult[0].map((desc)=> desc.memo )
        getAllInvoicesResult[0][0].memo = memo
      } else {
        getAllInvoicesResult[0][0].memo = ["No memo"]
      }




      const invoiceImagesResult = await queryRunner(selectQuery("invoiceimages", "invoiceID"), [invoiceId]);
      if (invoiceImagesResult[0].length > 0) {
        const Image = invoiceImagesResult[0].map((img) => img.InvoiceImage)
        // const memo = invoicelineitemsResult[0].map((desc)=> desc.memo )
        getAllInvoicesResult[0][0].image = Image
      } else {
        getAllInvoicesResult[0][0].image = ["No Image"]
      }
      res.status(200).json({
        data: getAllInvoicesResult,
        message: ' Invoice By ID successful'
      })
    } else {
      res.status(400).json({
        message: 'No data found'
      })
    }
  } catch (error) {
    console.log(error)
    res.send('Error occur in Invoice by ID');
  }
}
//  ############################# Invoice By ID End ############################################################







//  ############################# Update Invoice Start ############################################################

exports.UpdateInvoice = async (req, res) => {
  const {
    tenantID,
    invoiceID,
    invoiceType,
    startDate,
    endDate,
    frequency,
    dueDate,
    dueDays,
    repeatTerms,
    terms,
    totalAmount,
    additionalNotes,
    lineItems,
    sendmails,
    existingImages,
    images
  } = req.body;
  try {
    const { userId } = req.user
    // console.log(req.body)
    const currentDate = new Date();
    const invoiceUpdatedResult = await queryRunner(updateInvoice, [
      tenantID,
      invoiceType,
      startDate,
      endDate,
      frequency,
      dueDate,
      dueDays,
      repeatTerms,
      terms,
      totalAmount,
      additionalNotes,
      currentDate,
      invoiceID,
      userId
    ]);
    const selectTenantsResult = await queryRunner(selectQuery('tenants', 'id'), [tenantID]);
    // if select tenants result is not empty then send mail to tenant 
    if (selectTenantsResult[0].length > 0) {
      const tenantEmail = selectTenantsResult[0][0].email;
      const tenantName = selectTenantsResult[0][0].firstName + " " + selectTenantsResult[0][0].lastName;

        const mailSubject = invoiceID + " From " + frequency;
        sendMail.invoiceSendMail(tenantName, tenantEmail, mailSubject, dueDays, invoiceID, frequency, userId);
    }
    //  if line items is not empty then delete line items and insert new line items
    if (lineItems) {
      // delete line items
      const deleteLineItemsResult = await queryRunner(deleteQuery("invoicelineitems", "invoiceID"), [invoiceID]);

      if (deleteLineItemsResult[0].affectedRows > 0) {
        for (let i = 0; i < lineItems.length; i++) {
          const category = lineItems[i].category;
          const property = lineItems[i].property;
          const memo = lineItems[i].memo;
          const amount = lineItems[i].amount;

          const invoiceLineItemsResult = await queryRunner(insertLineItems, [invoiceID, category, property, memo, amount]);

          if (invoiceLineItemsResult.affectedRows === 0) {
            return res.send('Error occurred while inserting invoice line items');
          }
        }
      } else {
        return res.send('Error occurred while deleting invoice line items');
      }
    }
    let invoiceCheckResult;
    if (images.length > 0) {
      invoiceCheckResult = await queryRunner(
        selectQuery("invoiceimages", "invoiceID"),
        [invoiceID]
      );
      // console.log(images, propertycheckresult[0])

      // Extract the image keys from propertycheckresult
      const propertyImageKeys = invoiceCheckResult[0].map(image => image.ImageKey);
      console.log(invoiceCheckResult[0])
      console.log(propertyImageKeys)
      // Find the images to delete from S3 (present in propertycheckresult but not in images)
      const imagesToDelete = invoiceCheckResult[0].filter(image => !images.some(img => img.imageKey === image.ImageKey));
      console.log(imagesToDelete)
      // Delete images from S3
      for (let i = 0; i < imagesToDelete.length; i++) {
        await deleteImageFromS3(imagesToDelete[i].ImageKey);
        await queryRunner(delteImageForInvoiceImages, [imagesToDelete[i].ImageKey]);
      }

      // Find the images to insert into the database (present in images but not in propertycheckresult)
      const imagesToInsert = images.filter(image => !propertyImageKeys.includes(image.imageKey));

      for (let i = 0; i < imagesToInsert.length; i++) {
        const { image_url, image_key, Image, imageKey } = imagesToInsert[i];
        const imageUrl = image_url || Image;
        const imageKeyVal = image_key || imageKey;

        const propertyImageResult = await queryRunner(insertInvoiceImage, [
          invoiceID,
          imageUrl,
          imageKeyVal
        ]);
        // if property image data not inserted into property image table then throw error
        if (propertyImageResult.affectedRows === 0) {
          throw new Error("data doesn't inserted in property image table");
        }
      }
      // if (invoiceCheckResult[0].length > 0 && invoiceCheckResult.length > 0) {
      //   const invoiceImages = invoiceCheckResult[0].map((image) => image.InvoiceImage);
      //   const existingImg = existingImages.split(",");
      //   const imagesToDelete = invoiceImages.filter(
      //     (element) => !existingImg.includes(element)
      //   );

      //   imageToDelete(imagesToDelete);

      //   if (imagesToDelete.length > 0) {
      //     for (let i = 0; i < imagesToDelete.length; i++) {
      //       await queryRunner(
      //         deleteQuery("invoiceimages", "invoiceID", "InvoiceImage"),
      //         [invoiceID, imagesToDelete[i]]
      //       );
      //     }
      //   }
      // }

      // const fileNames = req.files.map((file) => file.filename);

      // for (let i = 0; i < fileNames.length; i++) {
      //   const img = fileNames[i];
      //   const invoiceImageResult = await queryRunner(insertInvoiceImage, [invoiceID, img]);

      //   if (invoiceImageResult.affectedRows === 0) {
      //     return res.send('Error occurred while inserting invoice images');
      //   }
      // }

      return res.status(200).json({
        message: "Invoice updated successfully"
      });
    }

    return res.status(400).json({
      message: "No tenants found"
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error occurred while updating invoice");
  }
};

//  ############################# Update Invoice END ############################################################



//  ############################# Delete invoice Start ############################################################
exports.invoiceDelete = async (req, res) => {
  try {
    const { id } = req.body;
    const invoiceDeleteResult = await queryRunner(
      deleteQuery("invoice", "id"),
      [id]
    );
    if (invoiceDeleteResult[0].affectedRows > 0) {
      const invoiceImagecheckresult = await queryRunner(
        selectQuery("invoiceimages", "invoiceID"),
        [id]
      );
      if (invoiceImagecheckresult[0].length > 0) {
        invoiceImages = invoiceImagecheckresult[0].map((image) => image.InvoiceImage);
        // delete folder images
        imageToDelete(invoiceImages);
        // delete folder images
        const invoiceDeleteresult = await queryRunner(
          deleteQuery("invoiceimages", "invoiceID"),
          [id]
        );
      }
      const DeletelineItemsResult = await queryRunner(
        deleteQuery("invoicelineitems", "invoiceID"),
        [id]
      );

      res.status(200).json({
        message: " Invoice deleted successfully",
      });

    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.send("Error from delete Property ");
    console.log(error);
  }
};
//  ############################# Delete invoice End ############################################################



//  ############################# Create Invoice Start ############################################################

exports.resendEmail = async (req, res) => {
  const { invoiceID } = req.query;
  const { userId } = req.user;
  // console.log(req)
  try {
    const resendEmailResult = await queryRunner(resendEmailQuery, [invoiceID])
    // console.log(111)
    // console.log(resendEmailResult);
    if (resendEmailResult[0].length > 0) {
      const tenantEmail = resendEmailResult[0][0].email;
      const dueDays = resendEmailResult[0][0].dueDate;
      const frequency = resendEmailResult[0][0].frequency;
      const tenantName = resendEmailResult[0][0].firstName + " " + resendEmailResult[0][0].lastName;
      const mailSubject = invoiceID + " From " + frequency;
      sendMail.invoiceSendMail(tenantName, tenantEmail, mailSubject, dueDays, invoiceID, frequency, userId);
    }
    res.status(200).json({
      message: " Resend Email successful"
    });
  } catch (error) {
    console.log(error)
    res.status(400).send("Error")
  }
}
//  ############################# Resend Email Invoice END ############################################################
// ############################# create invoice categories ############################################################
exports.createInvoiceCategories = async (req, res) => {
  try {
    const { category } = req.body;
    const { userId } = req.user;
    const createInvoiceCategoriesResult = await queryRunner(createInvoiceCategories, [userId, category]);
    if (createInvoiceCategoriesResult[0].affectedRows > 0) {
      res.status(200).json({
        message: "Invoice Categories created successfully"
      });
    } else {
      res.status(400).json({
        message: "No data found"
      });
    }
  } catch (error) {
    console.log(error)
    res.send("Error from create invoice categories");
  }
};
// update categories text 
exports.updateInvoiceCategories = async (req, res) => {
  try {
    const { setTaxes, catId } = req.body;
    const { userId } = req.user;
    const updateInvoiceCategoriesResult = await queryRunner(updateInvoiceCategories, [setTaxes, catId, userId]);
    if (updateInvoiceCategoriesResult[0].affectedRows > 0) {
      res.status(200).json({
        message: "Invoice Categories updated successfully"
      });
    } else {
      res.status(400).json({
        message: "No data found"
      });
    }
  } catch (error) {
    console.log(error)
    res.send("Error from update invoice categories");
  }
};