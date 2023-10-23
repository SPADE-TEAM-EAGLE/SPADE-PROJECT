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
  // const task = cron.schedule('* * * * *', async () => {
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
      const recurringInvoiceCheckResult = await queryRunner(recurringInvoiceCheck, [landlordID, tenantID, invoiceType]);

      if (recurringInvoiceCheckResult[0].length > 0) {
        console.log("user Exist")
      }

      else {
        if (frequency == "monthly") {
          // Calculate the next date
          const nextDate = new Date(currentDate);
          if (currentDate.getMonth() === 11) {
            // If current month is December, move to January of the next year
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
          // ############################################################# MONthly Rest of the code remains the same...
          // Recurring Next Date END 
          const invoiceResult = await queryRunner(insertInvoice, [landlordID, tenantID, invoiceType, startDate, endDate, frequency, dueDate, dueDays, repeatTerms, terms, additionalNotes, "Unpaid", createdAt, totalAmount, recurringNextDate]);
          if (invoiceResult.affectedRows === 0) {
            res.status(400).send('Error occur in creating invoice');
            // console.log("object");
          } else {
            // console.log("object2")

            // Invoice Email Start
            const invoiceID = invoiceResult[0].insertId;
            const selectTenantsResult = await queryRunner(selectQuery('tenants', 'id'), [tenantID])
            if (selectTenantsResult[0].length > 0) {
              const tenantEmail = selectTenantsResult[0][0].email;
              const landlordID = selectTenantsResult[0][0].landlordID;
              const tenantName = selectTenantsResult[0][0].firstName + " " + selectTenantsResult[0][0].lastName;
              // console.log("1234")
              const selectLandlordResult = await queryRunner(selectQuery('users', 'id'), [landlordID])
              const BusinessName = selectLandlordResult[0][0].BusinessName || "N/A";
              const userName = selectLandlordResult[0][0].FirstName + " " + selectLandlordResult[0][0].LastName;
              const invoiceEmail = selectLandlordResult[0][0].invoiceEmail;
              const mailSubject = "Invoice From " + userName;
              await invoiceSendMail(tenantName, tenantEmail, mailSubject, dueDays, invoiceID, userName, landlordID, BusinessName, invoiceEmail);

              // console.log("1234222")
              // console.log(tenantName, tenantEmail, mailSubject, dueDays, invoiceID, frequency)
            }
            const lineItemsResult = await queryRunner(selectQuery('invoicelineitems', 'invoiceID'), [PreviousInvoiceID])
            if (lineItemsResult[0].length > 0) {
              for (let j = 0; j < lineItemsResult[0].length; j++) {
                const category = lineItemsResult[0][j].category;
                const property = lineItemsResult[0][j].property;
                const memo = lineItemsResult[0][j].memo;
                const amount = lineItemsResult[0][j].amount;
                const invoiceLineItemsResult = await queryRunner(insertLineItems, [invoiceID, category, property, memo, amount])
                // console.log("line item");
              }
            }

            const invoiceImagesResult = await queryRunner(selectQuery('invoiceimages', 'invoiceID'), [PreviousInvoiceID])
            if (invoiceImagesResult[0].length > 0) {
              // console.log("invoice Image 2 ");

              for (let j = 0; j < invoiceImagesResult[0].length; j++) {
                const image_url = invoiceImagesResult[0][j].Image;
                const image_key = invoiceImagesResult[0][j].ImageKey;
                console.log(image_url, image_key);
                const propertyImageResult = await queryRunner(insertInvoiceImage, [invoiceID, image_url, image_key]);

                console.log(image_url, image_key);
              }
            }

          } //invoiceResult else END
          // ############################################################# MONthly Rest of the code remains the same...
        } else if (frequency == "yearly") {
          // Calculate the next date
          const nextDate = new Date(currentDate);
          nextDate.setFullYear(currentDate.getFullYear() + 1);
          const year = nextDate.getFullYear();
          const month = String(nextDate.getMonth() + 1).padStart(2, '0');
          const day = String(nextDate.getDate()).padStart(2, '0');
          const hour = String(nextDate.getHours()).padStart(2, '0');
          const minute = String(nextDate.getMinutes()).padStart(2, '0');
          const second = String(nextDate.getSeconds()).padStart(2, '0');
          const recurringNextDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
          //   ################################################# Yearly Rest of the code remains the same...
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
              const landlordID = selectTenantsResult[0][0].landlordID;
              // const mailSubject = invoiceID + " From " + frequency;
              // const mailSubject = "Invoice From " + userName;
              const selectLandlordResult = await queryRunner(selectQuery('users', 'id'), [landlordID])
              const BusinessName = selectLandlordResult[0][0].BusinessName || "N/A";
              const userName = selectLandlordResult[0][0].FirstName + " " + selectLandlordResult[0][0].LastName;
              const invoiceEmail = selectLandlordResult[0][0].invoiceEmail;
              const mailSubject = "Invoice From " + userName;
              await invoiceSendMail(tenantName, tenantEmail, mailSubject, dueDays, invoiceID, userName, landlordID, BusinessName, invoiceEmail);
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
          //   ################################################# Yearly Rest of the code remains the same...
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

// Plan check 
const Plan = cron.schedule('1 0 * * *', async () => {
  console.log("Plan run");
  const currentDate = new Date();
  const selectPlanResult = await queryRunner(recurringPlan);
  if (selectPlanResult[0].length > 0) {
    console.log("user Plan is found");
    for (let i = 0; i < selectPlanResult[0].length; i++) {
      const fuserNuveiId = selectPlanResult[0][i].fuserNuveiId;
      const fplanId = selectPlanResult[0][i].fplanId;
      const fsubscriptionId = selectPlanResult[0][i].fsubscriptionId;
      const fuserTokenId = selectPlanResult[0][i].fuserTokenId;
      const fsubscriptionCreated_at = selectPlanResult[0][i].fsubscriptionCreated_at;
      // console.log(fuserNuveiId, fplanId, fsubscriptionId, fsubscriptionCreated_at, fuserTokenId);
      const result = await queryRunner(updateUserBankRecurring, [fuserNuveiId, fplanId, fsubscriptionId, fsubscriptionCreated_at, fuserTokenId]);
      if (result[0].affectedRows == 1) {
        console.log("Plan user Exist");
      }
    }
  }

});
module.exports = task, Plan;