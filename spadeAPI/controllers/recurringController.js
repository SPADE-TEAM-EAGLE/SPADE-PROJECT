const sendMail = require('../sendmail/sendmail.js');
const {
  selectQuery,
  deleteQuery,
  recurringInvoice,
  insertInvoice,
  insertLineItems,
  insertInvoiceImage,
  recurringInvoiceCheck,
} = require("../constants/queries");
const { queryRunner } = require("../helper/queryRunner");
const cron = require('node-cron');
const task = cron.schedule('0 9,20 * * *', async () => {
  const currentDate = new Date();
  const selectTenantsResult = await queryRunner(recurringInvoice)
  if (selectTenantsResult[0].length > 0) {
    for (let i = 0; i < selectTenantsResult[0].length; i++) {
      const PreviousInvoiceID = selectTenantsResult[0][i].id;
      const landlordID = selectTenantsResult[0][i].landlordID;
      const tenantID = selectTenantsResult[0][i].tenantID;
      const invoiceType = selectTenantsResult[0][i].invoiceType;
      const startDate = selectTenantsResult[0][i].startDate;
      const endDate = selectTenantsResult[0][i].endDate;
      const frequency = selectTenantsResult[0][i].frequency;
      const dueDate = selectTenantsResult[0][i].dueDate;
      const dueDays = selectTenantsResult[0][i].daysDue;
      const repeatTerms = selectTenantsResult[0][i].repeatTerms;
      const terms = selectTenantsResult[0][i].terms;
      const additionalNotes = selectTenantsResult[0][i].note;
      const totalAmount = selectTenantsResult[0][i].totalAmount;
      const createdAt = new Date();
      const recurringNextDate = selectTenantsResult[0][i].recurringNextDate;
      const created_atPrevious = selectTenantsResult[0][i].created_at;
      const recurringInvoiceCheckResult = await queryRunner(recurringInvoiceCheck, [landlordID, tenantID, invoiceType]);
      if (recurringInvoiceCheckResult[0].length > 0) {
        console.log("user Exist")
      }
      else {
        if (frequency == "monthly") {
          const currentDate = new Date();
          currentDate.setMonth(currentDate.getMonth() + 1);
          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, '0');
          const day = String(currentDate.getDate()).padStart(2, '0');
          const hour = String(currentDate.getHours()).padStart(2, '0');
          const minute = String(currentDate.getMinutes()).padStart(2, '0');
          const second = String(currentDate.getSeconds()).padStart(2, '0');
          const recurringNextDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
          // Recurring Next Date END 
          const invoiceResult = await queryRunner(insertInvoice, [landlordID, tenantID, invoiceType, startDate, endDate, frequency, dueDate, dueDays, repeatTerms, terms, additionalNotes, "Unpaid", createdAt, totalAmount, recurringNextDate]);
          if (invoiceResult.affectedRows === 0) {
            res.status(400).send('Error occur in creating invoice');
          } else {
            // Invoice Email Start
            const invoiceID = invoiceResult[0].insertId;
            const selectTenantsResult = await queryRunner(selectQuery('tenants', 'id'), [tenantID])
            if (selectTenantsResult[0].length > 0) {
              const tenantEmail = selectTenantsResult[0][0].email;
              const tenantName = selectTenantsResult[0][0].firstName + " " + selectTenantsResult[0][0].lastName;
              const mailSubject = invoiceID + " From " + frequency;
              sendMail.invoiceSendMail(tenantName, tenantEmail, mailSubject, dueDays, invoiceID, frequency);
            }
            const lineItemsResult = await queryRunner(selectQuery('invoicelineitems', 'invoiceID'), [PreviousInvoiceID])
            if (lineItemsResult[0].length > 0) {
              for (let j = 0; j < lineItemsResult[0].length; j++) {
                const category = lineItemsResult[0][j].category;
                const property = lineItemsResult[0][j].property;
                const memo = lineItemsResult[0][j].memo;
                const amount = lineItemsResult[0][j].amount;
                const invoiceLineItemsResult = await queryRunner(insertLineItems, [invoiceID, category, property, memo, amount])
                console.log("line item");
              }
            }    // Insert END 
            //Line item END 
            // Invoice Images Start
            console.log("invoice Image");
            const invoiceImagesResult = await queryRunner(selectQuery('invoiceimages', 'invoiceID'), [PreviousInvoiceID])
            if (invoiceImagesResult[0].length > 0) {
              console.log("invoice Image 2 ");

              for (let j = 0; j < invoiceImagesResult[0].length; j++) {
                const image_url = invoiceImagesResult[0][j].Image;
                const image_key = invoiceImagesResult[0][j].ImageKey;
                console.log(image_url, image_key);
                const propertyImageResult = await queryRunner(insertInvoiceImage, [invoiceID, image_url, image_key]);

                console.log(image_url, image_key);
              }
            }
            console.log(image_url, image_key);
            console.log("image_url, image_key");
            // Invoice Images END 
          } //invoiceResult else END
        }
      }
    }
  } else {
    console.log("No data Found");
    console.log(currentDate);
  }
}
  , {
    scheduled: false
  }
);
module.exports = task;