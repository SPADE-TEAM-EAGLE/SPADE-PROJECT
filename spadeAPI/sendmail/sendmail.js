const nodemailer = require("nodemailer");
const { createTransporter } = require("../helper/googleAuth");
const codeHTML = require("./codeHTML");
const constants = process.env;

exports.sendMail = async (email, mailSubject, random, name) => {
  try {
    let transpoter = await createTransporter();
    var mailOptions = {
      from: constants.EMAIL_HOST,
      to: email,
      // to:"aj8706786@gmail.com",
      subject: mailSubject,

      html:
        mailSubject == "Spade Welcome Email"
          ? codeHTML.welcomeHTML(email, random, name)
          : codeHTML.codeHTML(name, random),
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

// Invoice email
exports.invoiceSendMail = async (
  tenantName,
  tenantEmail,
  mailSubject,
  dueDays,
  invoiceID,
  landlordName
) => {
  try {
    let transpoter = await createTransporter();
    var mailOptions = {
      from: constants.EMAIL_HOST,
      to: tenantEmail,
      // to:"aj8706786@gmail.com",
      subject: mailSubject,

      html: codeHTML.invoiceHTML(tenantName, dueDays, invoiceID, landlordName),
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
  tenantEmail,
  mailSubject,
  dueDays,
  landlordName,
  taskName,
  assignedTo,
  priority,
  companyName,
  contactLandlord
) => {
  try {
    let transpoter = await createTransporter();
    var mailOptions = {
      from: constants.EMAIL_HOST,
      to: tenantEmail,
      // to:"aj8706786@gmail.com",
      subject: mailSubject,

      html: codeHTML.taskHTML(
        mailSubject,
        tenantName,
        dueDays,
        taskName,
        assignedTo,
        priority,
        landlordName,
        companyName,
        contactLandlord
      ),
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
