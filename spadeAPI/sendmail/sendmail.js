const nodemailer = require("nodemailer");
const { createTransporter } = require("../helper/googleAuth");
const codeHTML = require("./codeHTML");
const { queryRunner } = require("../helper/queryRunner");
const { selectQuery } = require("../constants/queries");
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
  landlordName,
  id
) => {
  try {
    console.log(id)
    const islandlordNotify = await queryRunner(selectQuery("notification", "landlordID"), [
      id
    ]);
    console.log(islandlordNotify[0])
    if (islandlordNotify[0][0].emailNotification === "no") {
      console.log("email notification is off");
      return;
    }

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
  mailSubject,
  dueDays,
  landlordName,
  taskName,
  assignedTo,
  priority,
  companyName,
  contactLandlord,
  id,
  email
) => {
  try {
    // const selectResult = await queryRunner(selectQuery("property", "id"), [
    //   property,
    // ]);
    // const landLordUser = selectResult[0][0].landlordID
    // const landlordUser = await queryRunner(selectQuery("users", "id"), [
    //   landLordUser
    // ]);
    const islandlordNotify = await queryRunner(selectQuery("notification", "landlordID"), [
      id
    ]);
    console.log(islandlordNotify[0])
    if (islandlordNotify[0][0].emailNotification === "no") {
      console.log("email notification is off");
      return;
    }
    let transpoter = await createTransporter();
    var mailOptions = {
      from: constants.EMAIL_HOST,
      to: email,
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
