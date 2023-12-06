const { sendMail, invoiceSendMail } = require('../sendmail/sendmail');
const {
  selectQuery,
  deleteQuery,
  recurringInvoice,
  insertInvoice,
  insertLineItems,
  insertInvoiceImage,
  recurringInvoiceCheck,
  updateUserBankRecurring,
  recurringPlan
} = require("../constants/queries");
const { queryRunner } = require("../helper/queryRunner");
const cron = require('node-cron');

const task = cron.schedule('0 9,20 * * *', async () => {

  console.log("run");
  const currentDate = new Date();
  const selectTenantsResult = await queryRunner(recurringInvoice)
  if (selectTenantsResult[0].length > 0) {
    console.log("user is found");
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
      const notify = selectTenantsResult[0][i].notify;

      const recurringInvoiceCheckResult = await queryRunner(recurringInvoiceCheck, [landlordID, tenantID, invoiceType]);

      if (recurringInvoiceCheckResult[0].length > 0) {
        console.log("user Exist")
      }
      else {
        if (frequency == "monthly") {


          const nextDate = new Date(currentDate);
          if (currentDate.getMonth() === 11) {

            nextDate.setFullYear(currentDate.getFullYear() + 1);
            nextDate.setMonth(0); // January (month index 0)
          } else {
            nextDate.setMonth(currentDate.getMonth() + 1);
          }
          const year = nextDate.getFullYear();
          const month = String(nextDate.getMonth() + 1).padStart(2, '0');
          const day = String(nextDate.getDate()).padStart(2, '0');
          const hour = String(nextDate.getHours()).padStart(2, '0');
          const minute = String(nextDate.getMinutes()).padStart(2, '0');
          const second = String(nextDate.getSeconds()).padStart(2, '0');
          const recurringNextDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

          console.log("ready");


          const invoiceResult = await queryRunner(insertInvoice, [landlordID, tenantID, invoiceType, startDate, endDate, frequency, dueDate, dueDays, repeatTerms, terms, additionalNotes, "Unpaid", createdAt, totalAmount, notify, recurringNextDate]);
          if (invoiceResult.affectedRows === 0) {
            res.status(400).send('Error occur in creating invoice');

          } else {



            const invoiceID = invoiceResult[0].insertId;
            const selectTenantsResult = await queryRunner(selectQuery('tenants', 'id'), [tenantID])
            let tenantEmail;
            let tenantName;
            let address;
            let mailSubject;
            let invoiceEmail;
            if (selectTenantsResult[0].length > 0) {
              tenantEmail = selectTenantsResult[0][0].email;
              const landlordID = selectTenantsResult[0][0].landlordID;
              const propertyID = selectTenantsResult[0][0].propertyID;
              tenantName = selectTenantsResult[0][0].firstName + " " + selectTenantsResult[0][0].lastName;

              const selectPropertyResult = await queryRunner(selectQuery('property', 'id'), [propertyID])
              address = selectPropertyResult[0][0].address;
              const selectLandlordResult = await queryRunner(selectQuery('users', 'id'), [landlordID])
              const BusinessName = selectLandlordResult[0][0].BusinessName || "N/A";
              const userName = selectLandlordResult[0][0].FirstName + " " + selectLandlordResult[0][0].LastName;
              invoiceEmail = selectLandlordResult[0][0].invoiceEmail;
              mailSubject = "Invoice From " + userName;




            }
            const lineItemsResult = await queryRunner(selectQuery('invoicelineitems', 'invoiceID'), [PreviousInvoiceID])
            const lineItems = lineItemsResult[0];
            const AddDate = new Date();
            AddDate.setDate(AddDate.getDate() + 5);
            await invoiceSendMail(tenantName, address, AddDate, terms, additionalNotes, lineItems, totalAmount, mailSubject, tenantEmail, invoiceEmail, landlordID);
            if (lineItemsResult[0].length > 0) {
              for (let j = 0; j < lineItemsResult[0].length; j++) {
                const category = lineItemsResult[0][j].category;
                const property = lineItemsResult[0][j].property;
                const memo = lineItemsResult[0][j].memo;
                const amount = lineItemsResult[0][j].amount;
                const invoiceLineItemsResult = await queryRunner(insertLineItems, [invoiceID, category, property, memo, amount])

              }
            }

            const invoiceImagesResult = await queryRunner(selectQuery('invoiceimages', 'invoiceID'), [PreviousInvoiceID])
            if (invoiceImagesResult[0].length > 0) {


              for (let j = 0; j < invoiceImagesResult[0].length; j++) {
                const image_url = invoiceImagesResult[0][j].Image;
                const image_key = invoiceImagesResult[0][j].ImageKey;
                console.log(image_url, image_key);
                const propertyImageResult = await queryRunner(insertInvoiceImage, [invoiceID, image_url, image_key]);

                console.log(image_url, image_key);
              }
            }

          } //invoiceResult else END

        } else if (frequency == "yearly") {


          const nextDate = new Date(currentDate);
          nextDate.setFullYear(currentDate.getFullYear() + 1);
          const year = nextDate.getFullYear();
          const month = String(nextDate.getMonth() + 1).padStart(2, '0');
          const day = String(nextDate.getDate()).padStart(2, '0');
          const hour = String(nextDate.getHours()).padStart(2, '0');
          const minute = String(nextDate.getMinutes()).padStart(2, '0');
          const second = String(nextDate.getSeconds()).padStart(2, '0');
          const recurringNextDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;





          const invoiceResult = await queryRunner(insertInvoice, [landlordID, tenantID, invoiceType, startDate, endDate, frequency, dueDate, dueDays, repeatTerms, terms, additionalNotes, "Unpaid", createdAt, totalAmount, notify, recurringNextDate]);

          console.log(invoiceResult);
          if (invoiceResult.affectedRows === 0) {

            res.status(400).send('Error occur in creating invoice');
          } else {


            const invoiceID = invoiceResult[0].insertId;
            const selectTenantsResult = await queryRunner(selectQuery('tenants', 'id'), [tenantID])
            let tenantEmail;
            let tenantName;
            let address;
            let mailSubject;
            let invoiceEmail;
            if (selectTenantsResult[0].length > 0) {
              tenantEmail = selectTenantsResult[0][0].email;
              tenantName = selectTenantsResult[0][0].firstName + " " + selectTenantsResult[0][0].lastName;
              const propertyID = selectTenantsResult[0][0].propertyID;

              const selectPropertyResult = await queryRunner(selectQuery('property', 'id'), [propertyID])
              address = selectPropertyResult[0][0].address;
              const landlordID = selectTenantsResult[0][0].landlordID;


              const selectLandlordResult = await queryRunner(selectQuery('users', 'id'), [landlordID])
              const BusinessName = selectLandlordResult[0][0].BusinessName || "N/A";
              const userName = selectLandlordResult[0][0].FirstName + " " + selectLandlordResult[0][0].LastName;
              invoiceEmail = selectLandlordResult[0][0].invoiceEmail;
              mailSubject = "Invoice From " + userName;

            }
            const lineItemsResult = await queryRunner(selectQuery('invoicelineitems', 'invoiceID'), [PreviousInvoiceID])
            const lineItems = lineItemsResult[0];
            const AddDate = new Date();
            AddDate.setDate(AddDate.getDate() + 5);
            await invoiceSendMail(tenantName, address, AddDate, terms, additionalNotes, lineItems, totalAmount, mailSubject, tenantEmail, invoiceEmail, landlordID);
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

          } //invoiceResult else END

        }
      }
    }
  } else {
    console.log("No data Found");
    console.log(currentDate);
  }
}, {
  scheduled: false
});


const Plan = cron.schedule('1 0 * * *', async () => {
  console.log("Plan run");
  const currentDate = new Date();
  const selectPlanResult = await queryRunner(recurringPlan);
  if (selectPlanResult[0].length > 0) {
    console.log("user Plan is found");
    for (let i = 0; i < selectPlanResult[0].length; i++) {
      const id = selectPlanResult[0][i].id;
      const fuserNuveiId = selectPlanResult[0][i].fuserNuveiId;
      const fplanId = selectPlanResult[0][i].fplanId;
      const fsubscriptionId = selectPlanResult[0][i].fsubscriptionId;
      const fuserTokenId = selectPlanResult[0][i].fuserTokenId;
      const fsubscriptionCreated_at = selectPlanResult[0][i].fsubscriptionCreated_at;
      const result = await queryRunner(updateUserBankRecurring, [fuserNuveiId, fplanId, fsubscriptionId, fsubscriptionCreated_at, fuserTokenId]);
      if (result[0].affectedRows == 1) {


      }
    }
  }

});
module.exports = task, Plan;