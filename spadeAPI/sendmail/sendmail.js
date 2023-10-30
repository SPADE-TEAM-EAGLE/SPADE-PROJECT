const nodemailer = require("nodemailer");
const { createTransporter } = require("../helper/googleAuth");
const codeHTML = require("./codeHTML");
const tenantMail = require("./tenantInviteMail.js");
const invoiceMail = require("./invoiceMail.js");
const taskMail = require("./taskMail.js");
const { queryRunner } = require("../helper/queryRunner");
const { selectQuery } = require("../constants/queries");
const constants = process.env;

exports.sendMail = async (email, mailSubject, random, name, emailTemplate) => {
  if(mailSubject == "Spade Welcome Email"){
    // emailTemplate = '0';
if(emailTemplate == '0'){
  var emailHTML = tenantMail.tenantWelcomeHTML0(email, random, name)
}else{
  var emailHTML = tenantMail.tenantWelcomeHTML1(email, random, name)

}
  }else{
    var emailHTML = codeHTML.codeHTML(name, random)
  }
  try {
    let transpoter = await createTransporter();
    var mailOptions = {
      from: constants.EMAIL_HOST,
      to: email,
      // to:"aj8706786@gmail.com",
      subject: mailSubject,
      html: emailHTML,
        // mailSubject == "Spade Welcome Email"
          // ? codeHTML.welcomeHTML(email, random, name)
          // : codeHTML.codeHTML(name, random),
    };
    transpoter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error occur to send email" + error);
      } else {
        // console.log("email send sucessfully" + info.response);
        console.log("email send sucessfully");
      }
    });
  } catch (error) {
    // console.log("sendmail "+error.message);
    console.log(error);
  }
};
// ################################## Landlord ###########################################
exports.sendMailLandlord = async (email, mailSubject , name) => {
  try {
    let transpoter = await createTransporter();
    var mailOptions = {
      from: constants.EMAIL_HOST,
      to: email,
      // to:"aj8706786@gmail.com",
      subject: mailSubject,
      html: codeHTML.welcomeHTMLLANDLORD(email , name) ,
    };
    transpoter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error occur to send email" + error);
      } else {
        // console.log("email send sucessfully" + info.response);
        console.log("email send sucessfully");
      }
    });
  } catch (error) {
    // console.log("sendmail "+error.message);
    console.log(error);
  }
};
// ################################## Landlord ###########################################
// Invoice email
exports.invoiceSendMail = async (
  tenantName,
  address,
  dueDate,
  terms,
  additionalNotes,
  lineItems,
  totalAmount,
  mailSubject,
  tenantEmail,
  invoiceEmail,
  landlordID
) => {
  try {
    // console.log(id)
    const islandlordNotify = await queryRunner(selectQuery("notification", "landlordID"), [
      landlordID
    ]);
    const landlordResult = await queryRunner(selectQuery("users", "id"), [
      landlordID
    ]);
    const LandlordName = landlordResult[0][0].FirstName + " " + landlordResult[0][0].LastName;
    const LandlordPhone = landlordResult[0][0].Phone;
    let BusinessAddress;
    if (landlordResult[0][0].BusinessAddress == null) {
      BusinessAddress = "Not Available";
    } else {
      BusinessAddress = landlordResult[0][0].BusinessAddress + "," +
        landlordResult[0][0].BACity + "," +
        landlordResult[0][0].BAState + "," +
        landlordResult[0][0].BAZipcode;
    }
    

    if (islandlordNotify[0][0].emailNotification === "no") {
      console.log("email notification is off");
      return;
    }
    // if(invoiceEmail == '1'){
      var emailHTML = invoiceMail.invoiceHTML0(tenantName,address,dueDate,terms,additionalNotes,lineItems,totalAmount,LandlordName,LandlordPhone,BusinessAddress)
    // }
    // else{
    //   var emailHTML = invoiceMail.invoiceHTML1(tenantName,address,dueDate,terms,additionalNotes,lineItems,totalAmount)
    // }
    let transpoter = await createTransporter();
    var mailOptions = {
      from: constants.EMAIL_HOST,
      to: tenantEmail,
      // to:"aj8706786@gmail.com",
      subject: mailSubject,
      html: emailHTML,
    };
    transpoter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error occur to send email" + error);
      } else {
        // console.log("email send sucessfully" + info.response);
        console.log("email send sucessfully");
      }
    });
  } catch (error) {
    // console.log("sendmail "+error.message);
    console.log(error);
  }
};
// Task Invoice email
exports.taskSendMail = async (
  tenantName,
  mailSubject,
  dueDays,
  landlordName,
  taskName,
  assignedTo,
  priority,
  companyName,
  contactLandlord,
  id,
  email,
  taskTemplate
) => {
  try {

    const islandlordNotify = await queryRunner(selectQuery("notification", "landlordID"), [
      id
    ]);
    console.log(islandlordNotify[0])
    // if ( islandlordNotify[0][0] && islandlordNotify[0][0].emailNotification === "no" || assignedTo != "Not Assigned") {

    //   console.log("email notification is off");
    //   return;
    // }
    // if(taskTemplate == '0'){
      var emailHTML = taskMail.taskHTML0(tenantName,dueDays,taskName,assignedTo,priority,landlordName,companyName,contactLandlord)
    // }else{
    //   var emailHTML = taskMail.taskHTML1(tenantName,dueDays,taskName,assignedTo,priority,landlordName,companyName,contactLandlord)
    
    // }
    let transpoter = await createTransporter();
    var mailOptions = {
      from: constants.EMAIL_HOST,
      to: email,
      // to:"aj8706786@gmail.com",
      subject: mailSubject,

      html: emailHTML,
      // html: codeHTML.taskHTML(
      //   mailSubject,
      //   tenantName,
      //   dueDays,
      //   taskName,
      //   assignedTo,
      //   priority,
      //   landlordName,
      //   companyName,
      //   contactLandlord
      // ),
    };
    transpoter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error occur to send email" + error);
      } else {
        // console.log("email send sucessfully" + info.response);
        console.log("email send sucessfully");
      }
    });
  } catch (error) {
    // console.log("sendmail "+error.message);
    console.log(error);
  }
};
