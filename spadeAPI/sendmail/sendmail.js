const nodemailer = require("nodemailer");
const { createTransporter } = require("../helper/googleAuth");
const codeHTML = require("./codeHTML");
const tenantMail = require("./tenantInviteMail.js");
const invoiceMail = require("./invoiceMail.js");
const taskMail = require("./taskMail.js");
const paymentMails = require("./paymentMail.js");
const propertyMails = require("./propertyMails.js");
const { queryRunner } = require("../helper/queryRunner");
const { selectQuery } = require("../constants/queries");
const constants = process.env;

exports.sendMail = async (email, mailSubject, random, name, emailTemplate) => {
  if(mailSubject == "Spade Welcome Email"){

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

      subject: mailSubject,
      html: emailHTML,



    };
    transpoter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error occur to send email" + error);
      } else {

        console.log("email send sucessfully");
      }
    });
  } catch (error) {

    console.log(error);
  }
};

exports.sendMailLandlord = async (email, mailSubject , name) => {
  try {
    let transpoter = await createTransporter();
    var mailOptions = {
      from: constants.EMAIL_HOST,
      to: email,

      subject: mailSubject,
      html: codeHTML.welcomeHTMLLANDLORD(email , name) ,
    };
    transpoter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error occur to send email" + error);
      } else {

        console.log("email send sucessfully");
      }
    });
  } catch (error) {

    console.log(error);
  }
};


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

      var emailHTML = invoiceMail.invoiceHTML0(tenantName,address,dueDate,terms,additionalNotes,lineItems,totalAmount,LandlordName,LandlordPhone,BusinessAddress)




    let transpoter = await createTransporter();
    var mailOptions = {
      from: constants.EMAIL_HOST,
      to: tenantEmail,

      subject: mailSubject,
      html: emailHTML,
    };
    transpoter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error occur to send email" + error);
      } else {

        console.log("email send sucessfully");
      }
    });
  } catch (error) {

    console.log(error);
  }
};

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






      var emailHTML = taskMail.taskHTML0(tenantName,dueDays,taskName,assignedTo,priority,landlordName,companyName,contactLandlord)


    

    let transpoter = await createTransporter();
    var mailOptions = {
      from: constants.EMAIL_HOST,
      to: email,

      subject: mailSubject,

      html: emailHTML,











    };
    transpoter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error occur to send email" + error);
      } else {

        console.log("email send sucessfully");
      }
    });
  } catch (error) {

    console.log(error);
  }
};


exports.paymentMail = async (
  Name,subscriptionDate,Amount,email,planName,mailSubject
) => {
  try {
      var emailHTML = paymentMails.paymentHTML(Name,subscriptionDate,Amount,planName)
    let transpoter = await createTransporter();
    var mailOptions = {
      from: constants.EMAIL_HOST,
      to: email,

      subject: mailSubject,
      html: emailHTML,
    };
    transpoter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error occur to send email" + error);
      } else {

        console.log("email send sucessfully");
      }
    });
  } catch (error) {

    console.log(error);
  }
};


exports.propertyMail = async (
  propertyName,pAddress,propertyType,propertySQFT,units,userName,mailSubject,email
) => {
  try {
      var emailHTML = propertyMails.propertyHTML(propertyName,pAddress,propertyType,propertySQFT,units,userName)
    let transpoter = await createTransporter();
    var mailOptions = {
      from: constants.EMAIL_HOST,
      to: email,

      subject: mailSubject,
      html: emailHTML,
    };
    transpoter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error occur to send email" + error);
      } else {

        console.log("email send sucessfully");
      }
    });
  } catch (error) {

    console.log(error);
  }
};
