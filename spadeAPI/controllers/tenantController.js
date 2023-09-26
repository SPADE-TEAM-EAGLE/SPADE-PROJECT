const user = require("../models/user");
// const {sendMail} = require('../sendmail/sendmail.js');
const { sendMail, invoiceSendMail } = require("../sendmail/sendmail.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const Path = require("path");
const imageToDelete = require("./../middleware/deleteImage.js");
const {deleteImageFromS3} = require("./../helper/S3Bucket.js")
const { serialize } = require("cookie");
const {
  selectQuery,
  deleteQuery,
  insertTenants,
  UpdateTenants,
  addResetTokenTenants,
  updatePasswordTenant,
  insertincreaseRentData,
  updatePropertyUnitsTenant,
  insertAlternateEmailData,
  insertAlternatePhoneData,
  insertTenantAttachFile,
  getTenantAttachFile,
  updateUnitsTenant,
  getTenantsById,
  updateTenants,
  tenantTaskQuery,
  updateTenantsProfile,
  updateTenantAccountQuery,
  checkTenantInvoicePaidQuery,
  updateAllStatusVacantQuery,
  getLandlordDetailedQuery,
  checkMyAllTenantsInvoicePaidQuerytenant,
  deleteTenantAccountData,
} = require("../constants/queries");
const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const { file } = require("googleapis/build/src/apis/file");

const config = process.env;

//  ############################# Create tenants Start ############################################################
exports.createTenants = async (req, res) => {
  try {
    const {
      // landlordID,
      firstName,
      lastName,
      companyName,
      email,
      phoneNumber,
      address,
      city,
      state,
      zipcode,
      propertyID,
      propertyUnitID,
      rentAmount,
      gross_or_triple_lease,
      baseRent,
      tripleNet,
      leaseStartDate,
      leaseEndDate,
      increaseRent,
      increaseRentData,
      // notify
    } = req.body;
    const { userId } = req.user;
    // console.log(req.body)
    const tenantsCheck = await queryRunner(selectQuery("tenants", "email"), [
      email,
    ]);
    if (tenantsCheck[0].length > 0) {
      res.status(200).json({
        message: `Tenants Already exist on this email ${email} `,
      });
    } else {
      currentDate = new Date();
      const ran = Math.floor(100000 + Math.random() * 900000);
      const tenantPassword = "Spade" + ran;
      const hashPassword = await hashedPassword(tenantPassword);
      const tenantsInsert = await queryRunner(insertTenants, [
        userId,
        firstName,
        lastName,
        companyName,
        email,
        phoneNumber,
        address,
        city,
        state,
        zipcode,
        propertyID,
        propertyUnitID,
        rentAmount,
        gross_or_triple_lease,
        baseRent,
        tripleNet,
        leaseStartDate,
        leaseEndDate,
        increaseRent,
        hashPassword,
        currentDate,
      ]);

      if (tenantsInsert[0].affectedRows > 0) {
        const status = "Occupied";
        const propertyUnitsResult = await queryRunner(
          updatePropertyUnitsTenant,
          [status, propertyUnitID, propertyID]
        );
        if (propertyUnitsResult[0].affectedRows > 0) {
          const selectTenantsResult = await queryRunner(
            selectQuery("users", "id"),
            [userId]
          );
          const landlordEmail = selectTenantsResult[0][0].Email;
          const landlordName = selectTenantsResult[0][0].FirstName + " " + selectTenantsResult[0][0].LastName;
          if (increaseRent == 'No') {
            res.status(200).json({
              message: "Tenants save Successful",
              data: tenantsInsert[0],
              tenantId: tenantsInsert[0].insertId,
            });
          } else {
            const tenantID = tenantsInsert[0].insertId;
            if (
              increaseRentData.length >= 1 &&
              increaseRentData[0].date !== ""
            ) {
              for (let i = 0; i < increaseRentData.length; i++) {
                const increaseDate = increaseRentData[i].date;
                const increaseRentAmount = increaseRentData[i].amount;
                // console.log(increaseDate,increaseRentAmount,propertyID)
                const increaseRentDataResult = await queryRunner(
                  insertincreaseRentData,
                  [tenantID, propertyID, increaseDate, increaseRentAmount]
                );
              }
            }
            res.status(200).json({
              message: " tenant created successful",
              data: tenantsInsert[0],
              tenantId: tenantsInsert[0].insertId,
            });
          }
          // insert increase rent amount END
        } else {
          // console.log(111)
          res.status(400).json({
            message: "Error occur in update tenant property unit",
          });
        }
      } else {
        // console.log(22222)
        res.status(400).json({
          message: "data not save",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.send("Error occurs in creating Tenants  " + error);
  }
};
//  ############################# Create tenants END ############################################################

//  ############################# tenant email send Start  ############################################################

exports.sendInvitationLink = async (req, res) => {
  const { tenantEmail } = req.user;
  const { tenantID} = req.body;
  try {
    const selectTenantResult = await queryRunner(selectQuery("tenants", "id"), [
      tenantID,
    ]);
    if (selectTenantResult[0].length > 0) {
      const name = selectTenantResult[0][0].firstName;
      const email = selectTenantResult[0][0].email;
      const currentDate = new Date();
      const ran = Math.floor(100000 + Math.random() * 900000);
      const tenantPassword = "Spade" + ran;
      const hashPassword = await hashedPassword(tenantPassword);
      const mailSubject = "Spade Welcome Email";

      const tenantsInsert = await queryRunner(UpdateTenants, [
        hashPassword,
        currentDate,
        tenantID,
      ]);
      if (tenantsInsert[0].affectedRows > 0) {
        await sendMail(email, mailSubject, tenantPassword, name, tenantEmail);
        res.status(200).json({
          message: "Tenants Welcome email send Successful",
          data: tenantsInsert[0],
        });
      } else {
        res.status(400).json({
          message: "welcome email not sent to tenant ",
        });
      }
    } else {
      return res.status(400).send("Tenant is not exists");
    }
  } catch (error) {
    res.send("Error occurs in Sending Tenants welcome email " + error.message); // Sending error response
  }
};

//  ############################# tenant email send END  ############################################################

//  ############################# Tenant Reset Email ############################################################
exports.createResetEmailTenant = async (req, res) => {
  const { email } = req.query;
  // const { email } = req.body;
  const mailSubject = "Spade Reset Email";
  const random = Math.floor(100000 + Math.random() * 900000);
  try {
    const selectResult = await queryRunner(selectQuery("tenants", "Email"), [
      email,
    ]);
    if (selectResult[0].length > 0) {
      const userid = selectResult[0][0].id;
      const name =
        selectResult[0][0].firstName + " " + selectResult[0][0].lastName;
      sendMail(email, mailSubject, random, name,"emailTemplate");
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
      const updateResult = await queryRunner(addResetTokenTenants, [
        random,
        formattedDate,
        userid,
      ]);
      if (updateResult[0].affectedRows === 0) {
        res.status(400).send("Error");
      } else {
        res.status(200).json({ message: "Sended", id: userid });
      }
    } else if (selectResult[0].length === 0) {
      res.status(400).send("Email not found");
    }
  } catch (error) {
    res.status(400).send("Error"+error.message);
  }
};
//  ############################# Tenant Reset Email ############################################################

//  ############################# resend Code ############################################################
exports.resendCodeTenants = async (req, res) => {
  const { id } = req.body;
  const mailSubject = "Spade Reset Email";
  const random = Math.floor(100000 + Math.random() * 900000);
  try {
    const selectResult = await queryRunner(selectQuery("tenants", "id"), [id]);
    if (selectResult[0].length > 0) {
      const userid = selectResult[0][0].id;
      const name =
        selectResult[0][0].firstName + " " + selectResult[0][0].lastName;
      sendMail(selectResult[0][0].email, mailSubject, random, name);
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
      const updateResult = await queryRunner(addResetTokenTenants, [
        random,
        formattedDate,
        userid,
      ]);
      if (updateResult[0].affectedRows === 0) {
        res.status(400).send("Error");
      } else {
        res.status(200).json({ message: "Sended" });
      }
    }
  } catch (error) {
    res.status(400).send("Error");
    console.log(error);
  }
};
//  ############################# resend Code ############################################################

//  ############################# Tenant Verify Reset Email Code ############################################################
exports.verifyResetEmailCodeTenant = async (req, res) => {
  const { id, token } = req.body;
  // console.log(req.body)
  try {
    const selectResult = await queryRunner(
      selectQuery("tenants", "id", "token"),
      [id, token]
    );
    if (selectResult[0].length > 0) {
      const now = new Date(selectResult[0][0].tenantUpdated_at);
      const now2 = new Date();
      const formattedDate = now2.toISOString().slice(0, 19).replace("T", " ");
      const time = new Date(formattedDate) - now;
      const time2 = time / 1000;
      if (time2 >= 120) {
        res.status(408).send("Time out");
      } else {
        res.status(200).json({
          message: "Successful",
          id: id,
          token: token,
        });
      }
    } else {
      res.status(404).json({
        message: "Cannot Validate!!!",
      });
    }
  } catch (error) {
    res.status(400).send("Error");
  }
};
//  ############################# Tenant Verify Reset Email Code ############################################################

//  ############################# Tenant Update Password ############################################################
// exports.tenantAllPaidInvoice = async (req, res) => {
//   try {
//     const { userId } = req.user;
//     // Check if tenant has any unpaid invoices
//     const tenantAllPaidInvoiceResult = await queryRunner(
//       checkTenantInvoicePaidQuery,
//       [userId]
//     );
//     // No un-paid invoices found, update tenant account
//     if (tenantAllPaidInvoiceResult[0].length === 0) {
//       const tenantAllPaid = await queryRunner(updateTenantAccountQuery, [
//         0,
//         userId,
//       ]);
//       // updateAllStatusVacantQuery
//       await queryRunner(updateAllStatusVacantQuery, [
//         "Vacant",
//         userId,
//       ]);
//       const getLandlordDetailed = await queryRunner(
//         getLandlordDetailedQuery,
//         [userId]
//       );
//       const mailSubject = "Tenant has paid all invoices and is now Inactive";
//       if(getLandlordDetailed[0].length > 0){
//         await sendMail(
//           getLandlordDetailed[0][0].Email,
//           mailSubject,
//           "as",
//           `${getLandlordDetailed[0][0].FirstName} ${getLandlordDetailed[0][0].LastName}`
//         );
//       }
//         // console.log(tenantData[i].emai);

//       if (tenantAllPaid[0].affectedRows > 0) {
//         res.status(200).json({
//           message: "Tenant has paid invoices",
//         });
//       }
//     } else {
//       res.status(200).json({
//         message: "Tenant has unpaid invoices",
//       });
//     }
//   } catch (error) {
//     res.status(400).json({
//       message: error.message,
//     });
//   }
// };
exports.tenantAllPaidInvoice = async (req, res) => {
  try {
    const { userId } = req.user;
    // Check if tenant has any unpaid invoices
    const tenantAllPaidInvoiceResult = await queryRunner(
      checkTenantInvoicePaidQuery,
      [userId]
    );
    // No un-paid invoices found, update tenant account
    if (tenantAllPaidInvoiceResult[0].length === 0) {
      const tenantAllPaid = await queryRunner(updateTenantAccountQuery, [
        0,
        userId,
      ]);
      // updateAllStatusVacantQuery
      await queryRunner(updateAllStatusVacantQuery, ["Vacant", userId]);
      const getLandlordDetailed = await queryRunner(getLandlordDetailedQuery, [
        userId,
      ]);
      await queryRunner(deleteTenantAccountData.invoice, [userId]);
      await queryRunner(deleteTenantAccountData.task, [userId]);
      await queryRunner(deleteTenantAccountData.deleteTenantData, [userId]);

      const mailSubject = "Tenant has paid all invoices and is now Inactive";
      if (getLandlordDetailed[0].length > 0) {
        await sendMail(
          getLandlordDetailed[0][0].Email,
          mailSubject,
          "as",
          `${getLandlordDetailed[0][0].FirstName} ${getLandlordDetailed[0][0].LastName}`
        );
      }
      // console.log(tenantData[i].emai);

      if (tenantAllPaid[0].affectedRows > 0) {
        res.status(200).json({
          message: "Tenant has paid invoices",
        });
      }
    } else {
      res.status(200).json({
        message: "Tenant has unpaid invoices",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
exports.updatePasswordTenant = async (req, res) => {
  console.log(req.body);
  const { id, password, confirmpassword, token } = req.body;
  try {
    if (password === confirmpassword) {
      const now = new Date();
      const hashPassword = await hashedPassword(password);

      const selectResult = await queryRunner(updatePasswordTenant, [
        hashPassword,
        now,
        id,
        token,
      ]);
      if (selectResult[0].affectedRows > 0) {
        res.status(200).json({
          message: "Successful password saved",
        });
      } else {
        res.status(500).send("Error");
      }
    } else {
      res.status(201).send("Password Does not match ");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Error");
  }
};
//  ############################# Tenant Update Password ############################################################

//  ############################# Add Alternate Email and Phone Start ############################################################
exports.addAlternateEmailPhone = async (req, res) => {
  const { tenantID, alternatePhone, alternateEmail } = req.body;

  try {
    let phoneExist = false;
    let emailExist = false;
    //   if (alternatePhone && alternateEmail && alternatePhone.length > 0 && alternateEmail.length > 0) {
    const selectalternatePhoneResult = await queryRunner(
      selectQuery("tenantalternatephone", "tenantID"),
      [tenantID]
    );
    if (selectalternatePhoneResult[0].length > 0) {
      phoneExist = false;
    } else {
      for (let i = 0; i < alternatePhone.length; i++) {
        const phoneName = alternatePhone[i].phoneName;
        const phoneNumber = alternatePhone[i].phoneNumber;
        const alternatePhoneDataResult = await queryRunner(
          insertAlternatePhoneData,
          [tenantID, phoneName, phoneNumber]
        );
      }
    }
    const selectalternateEmailResult = await queryRunner(
      selectQuery("tenantalternateemail", "tenantID"),
      [tenantID]
    );
    if (selectalternateEmailResult[0].length > 0) {
      emailExist = true;
    } else {
      for (let i = 0; i < alternateEmail.length; i++) {
        const emailName = alternateEmail[i].emailName;
        const email = alternateEmail[i].email;
        const alternateEmailDataResult = await queryRunner(
          insertAlternateEmailData,
          [tenantID, emailName, email]
        );
      }
    }
    if (phoneExist == true && emailExist == true) {
      res.status(200).json({
        message: "Email and number already exist",
      });
    } else if (phoneExist == false && emailExist == true) {
      res.status(200).json({
        message: "Phone number successfully save email already already exist",
      });
    } else if (phoneExist == true && emailExist == false) {
      res.status(200).json({
        message: " Email successfully save Phone number already already exist",
      });
    } else {
      res.status(200).json({
        message: " Email and phone number successfully save ",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
  }
};

//  ############################# Add Alternate Email and Phone End ############################################################

//  ############################# Add Tenant Attach File Start ############################################################
exports.tenantAttachFile = async (req, res) => {
  // console.log(1)
  const { tenantID, images } = req.body;

  const { userId } = req.user;
  // const { userId } = req.body;
  const currentDate = new Date();
  try {
    for (let i = 0; i < images.length; i++) {
      const { image_url } = images[i];
      const { image_key } = images[i];


      const propertyImageResult = await queryRunner(insertTenantAttachFile, [
        userId,
        tenantID,
        image_url,
        image_key,
        currentDate
      ]);
      // if property image data not inserted into property image table then throw error
      if (propertyImageResult.affectedRows === 0) {
        throw new Error("data doesn't inserted in property image table");
      }
    }
    res.status(200).json({
      message: " Tenant Files save successful",
    });
  } catch (error) {
    res.status(400).send("Error4" + error);
    console.log(error);
  }
};
//  ############################# Add Tenant Attach File End ############################################################

//  ############################# Delete Tenant Attach File Start ############################################################
exports.tenantAttachFileDelete = async (req, res) => {
  try {
    console.log(req.body)
    const { id } = req.body;
    // const { id,userId } = req.body
    const { userId } = req.user;
    const attachFileResult = await queryRunner(
      selectQuery("tenantattachfiles", "id"), [id]);
    if (attachFileResult[0].length > 0) {
      const file = attachFileResult[0][0].ImageKey;
      // delete folder images Start
      // imageToDelete([file]);
      deleteImageFromS3(file);
      // delete folder images End
      const PropertyDeleteResult = await queryRunner(
        deleteQuery("tenantattachfiles", "id", "landlordID"),
        [id, userId]
      );
      if (PropertyDeleteResult[0].affectedRows > 0) {
        res.status(200).json({
          data: file,
          message: " Tenant Files deleted successful",
        });
      } else {
        res.status(400).json({
          message: "No data found",
        });
      }
    }
  } catch (error) {
    res.send("Error from delete Property ");
    console.log(error);
  }
};
//  ############################# Delete Tenant Attach File End ############################################################

//  ############################# get all Tenant Attach File Start ############################################################
exports.GettenantAttachFile = async (req, res) => {
  const { tenantID } = req.query; 

  try {
      const GettenantAttachFileResult = await queryRunner(getTenantAttachFile, [tenantID]);
      if (GettenantAttachFileResult[0].length === 0) {
        throw new Error("No data Found in tenant attach file");
      }
    res.status(200).json({
      message: " Tenant Files save successful",
      data : GettenantAttachFileResult[0]
    });
  } catch (error) {
    res.status(400).send("Error4" + error);
    console.log(error);
  }
};
//  ############################# Add Tenant Attach File End ############################################################

//  ############################# Delete Tenant Start ############################################################
exports.tenantDelete = async (req, res) => {
  try {
    const { tenantID } = req.body;
    const tenantResult = await queryRunner(selectQuery("tenants", "id"), [
      tenantID,
    ]);
    // console.log(tenantResult[0][0])

    // const tenantAllPaidInvoiceResult = await queryRunner(
    //   checkMyAllTenantsInvoicePaidQuery,
    //   [tenantID]
    // );
    // // console.log(tenantAllPaidInvoiceResult[0].length);
    // // No un-paid invoices found, update tenant account
    // if (tenantAllPaidInvoiceResult[0].length === 0) {
    //   res.status(200).json({
    //     message: "Tenant Invoice is pending Kindly Paid invoice "
    //   })
    // }else{

    // if(){}
    if (tenantResult[0].length > 0) {
      const tenantAllPaidInvoiceResult = await queryRunner(
        checkMyAllTenantsInvoicePaidQuerytenant,
        [tenantID]
      );
      // console.log(tenantAllPaidInvoiceResult[0].length);
      // No un-paid invoices found, update tenant account
      if (tenantAllPaidInvoiceResult[0].length > 0) {
        res.status(200).json({
          message: "Tenant Invoice is pending Kindly Paid invoice ",
        });
      } else {
        const propertyUnitID = tenantResult[0][0].propertyUnitID;
        const tenantDeleteResult = await queryRunner(
          deleteQuery("tenants", "id"),
          [tenantID]
        );
        // console.log(tenantDeleteResult[0])
        if (tenantDeleteResult[0].affectedRows > 0) {
          const tenantCheckResult = await queryRunner(
            selectQuery("tenantattachfiles", "tenantID"),
            [tenantID]
          );
          if (tenantCheckResult[0].length > 0) {
            const tenantimages = tenantCheckResult[0].map(
              (image) => image.fileName
            );
            // delete folder images
            imageToDelete(tenantimages);
            const tenantFileDeleteresult = await queryRunner(
              deleteQuery("tenantattachfiles", "tenantID"),
              [tenantID]
            );
          }

          const tenantAdditionalEmailCheckResult = await queryRunner(
            selectQuery("tenantalternateemail", "tenantID"),
            [tenantID]
          );
          if (tenantAdditionalEmailCheckResult[0].length > 0) {
            const tenantAdditionalEmailresult = await queryRunner(
              deleteQuery("tenantalternateemail", "tenantID"),
              [tenantID]
            );
          }

          // const tenantAdditionalEmailCheckResult = await queryRunner(selectQuery("tenantalternateemail", "tenantID"), [tenantID]);
          // if (tenantAdditionalEmailCheckResult[0].length > 0) {
          // const tenantAdditionalEmailresult = await queryRunner(deleteQuery("tenantalternateemail", "tenantID"), [tenantID]);
          // }

          const tenantAdditionalPhoneCheckResult = await queryRunner(
            selectQuery("tenantalternatephone", "tenantID"),
            [tenantID]
          );
          if (tenantAdditionalPhoneCheckResult[0].length > 0) {
            const tenantAdditionalPhoneResult = await queryRunner(
              deleteQuery("tenantalternatephone", "tenantID"),
              [tenantID]
            );
          }

          const tenantIncreaseRentCheckResult = await queryRunner(
            selectQuery("tenantincreaserent", "tenantID"),
            [tenantID]
          );
          if (tenantIncreaseRentCheckResult[0].length > 0) {
            const tenantIncreaseRentResult = await queryRunner(
              deleteQuery("tenantincreaserent", "tenantID"),
              [tenantID]
            );
          }

          const status = "Vacant";
          const propertyUnitsResult = await queryRunner(updateUnitsTenant, [
            status,
            propertyUnitID,
          ]);

          res.status(200).json({
            message: " tenant deleted successfully",
          });
        } else {
          // tenantCheckResult
          res.status(200).json({
            message: "Error occur in delete tenant ",
          });
        }
      }
    } else {
      // tenantCheckResult
      res.status(200).json({
        message: "No tenant found ",
      });
    }
    // }
  } catch (error) {
    console.log(error);
    res.send("Error from delete tenants ", error);
    // console.log(req.body)
  }
};
//  ############################# Delete Tenant End ############################################################

//  ############################# Get tenant ByID Start ############################################################
exports.getTenantsByID = async (req, res) => {
  try {
    // con
    const { id } = req.query;
    // const { id } = req.body;
    const TenantsByIDResult = await queryRunner(getTenantsById, [id]);
    if (TenantsByIDResult.length > 0) {
      const data = JSON.parse(JSON.stringify(TenantsByIDResult));
      res.status(200).json({
        data: data,
        message: "Tenants By ID",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.send("Error Get Tenants By ID" + error );
    console.log(error);
  }
};
//  ############################# Get tenant ByID End ############################################################

//  ############################# Update tenants Start ############################################################
exports.updateTenants = async (req, res) => {
  try {
    const {
      tenantID,
      firstName,
      lastName,
      companyName,
      email,
      phoneNumber,
      address,
      city,
      state,
      zipcode,
      propertyID,
      propertyUnitID,
      rentAmount,
      gross_or_triple_lease,
      baseRent,
      tripleNet,
      leaseStartDate,
      leaseEndDate,
      increaseRent,
      increaseRentData,
    } = req.body;
    // console.log(req)
    // const {userId}=req.user
    const tenantcheckresult = await queryRunner(selectQuery("tenants", "id"), [
      tenantID,
    ]);
    if (tenantcheckresult[0].length > 0) {
      const checkpropertyUnitID = tenantcheckresult[0][0].propertyUnitID;
      const checkpropertyID = tenantcheckresult[0][0].propertyID;
      const checkincreaseRent = tenantcheckresult[0][0].increaseRent;
      if (checkpropertyUnitID !== propertyUnitID) {
        const status = "Vacant";
        const propertyUnitsResult = await queryRunner(
          updatePropertyUnitsTenant,
          [status, checkpropertyUnitID, checkpropertyID]
        );
      }
      if (checkincreaseRent !== increaseRent) {
        const lineItemDelete = await queryRunner(
          deleteQuery("tenantincreaserent", "tenantID"),
          [tenantID]
        );
      }
      currentDate = new Date();
      const ran = Math.floor(100000 + Math.random() * 900000);
      const tenantsInsert = await queryRunner(updateTenants, [
        firstName,
        lastName,
        companyName,
        email,
        phoneNumber,
        address,
        city,
        state,
        zipcode,
        propertyID,
        propertyUnitID,
        rentAmount,
        gross_or_triple_lease,
        baseRent,
        tripleNet,
        leaseStartDate,
        leaseEndDate,
        increaseRent,
        currentDate,
        tenantID,
      ]);
      if (tenantsInsert[0].affectedRows > 0) {
        const status = "Occupied";
        const propertyUnitsResult = await queryRunner(
          updatePropertyUnitsTenant,
          [status, propertyUnitID, propertyID]
        );
        // console.log("11");
        // console.log(propertyUnitsResult);
        if (propertyUnitsResult[0].affectedRows > 0) {
          if (increaseRent == "No") {
            res.status(200).json({
              message: "Tenants save Successful",
              data: tenantsInsert[0],
              tenantId: tenantsInsert[0].insertId,
            });
          } else {
            // const tenantID = tenantsInsert[0].insertId;
            if (
              increaseRentData.length >= 1 &&
              increaseRentData[0].date !== ""
            ) {
              for (let i = 0; i < increaseRentData.length; i++) {
                const increaseDate = increaseRentData[i].date;
                const increaseRentAmount = increaseRentData[i].amount;
                const increaseRentDataResult = await queryRunner(
                  insertincreaseRentData,
                  [tenantID, propertyID, increaseDate, increaseRentAmount]
                );
              }
            }
            res.status(200).json({
              message: " tenant Updated successful",
              data: tenantsInsert[0],
              tenantId: tenantsInsert[0].insertId,
            });
          }
          // insert increase rent amount END
        } else {
          res.status(400).json({
            message: "Error occur in update tenant property unit",
          });
        }
      } else {
        res.status(200).json({
          message: "Tenants is not found",
        });
      }
    } else {
      res.status(400).json({
        message: "tenant not Updated",
      });
    }
    // }
  } catch (error) {
    console.log(error);
    res.send("Error occurs in updating Tenants  " + error);
  }
};
//  ############################# Update tenants END ############################################################
exports.updateTenantProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      firstName,
      lastName,
      companyName,
      email,
      phoneNumber,
      address,
      city,
      state,
      zipcode,
      Image,
      imageKey,
    } = req.body;
    const tenantcheckresult = await queryRunner(selectQuery("tenants", "id"), [
      userId,
    ]);
    if (tenantcheckresult[0].length > 0) {
      const tenantsInsert = await queryRunner(updateTenantsProfile, [
        firstName,
        lastName,
        companyName,
        email,
        phoneNumber,
        address,
        city,
        state,
        zipcode,
        Image,
        imageKey,
        userId,
      ]);
      if (tenantsInsert[0].affectedRows > 0) {
        res.status(200).json({
          message: "Tenants save Successful",
          data: tenantsInsert[0],
        });
      } else {
        res.status(200).json({
          message: "Tenants is not found",
        });
      }
    }
  } catch (error) {
    res.send("Error Get Tenants By ID");
    console.log(error);
  }
};

//  ############################# Task tenant ############################################################
exports.tenantTask = async (req, res) => {
  const { Id } = req.query;
  try {
    const taskByIDResult = await queryRunner(tenantTaskQuery, [Id]);
    if (taskByIDResult.length > 0) {
      for (let j = 0; j < taskByIDResult[0].length; j++) {
        const taskID = taskByIDResult[0][j].id;
        const TaskImagesResult = await queryRunner(
          selectQuery("taskimages", "taskID"),
          [taskID]
        );
        if (TaskImagesResult[0].length > 0) {
          const taskImages = TaskImagesResult[0].map(
            (image) => image.taskImages
          );
          taskByIDResult[0][j].taskImages = taskImages;
        } else {
          taskByIDResult[0][j].taskImages = ["No Task Images Found"];
        }
        const TaskAssignToResult = await queryRunner(
          selectQuery("taskassignto", "taskId"),
          [taskID]
        );
        const vendorIDs = TaskAssignToResult[0].map(
          (vendorID) => vendorID.vendorId
        );
        const vendorData = [];
        
        for (let i = 0; i < vendorIDs.length; i++) {
          const vID = vendorIDs[i];
          const vendorResult = await queryRunner(selectQuery("vendor", "id"), [
            vID,
          ]);
          let VendorCategoryResult;
          
          if (vendorResult[0].length > 0) {
            const categoryIDs = vendorResult[0][0].categoryID;
            VendorCategoryResult = await queryRunner(
              selectQuery("vendorcategory", "id"),
              [categoryIDs]
            );

            if (VendorCategoryResult[0].length > 0) {
              const vendorDataObject = {
                name:
                  vendorResult[0][0].firstName +
                  " " +
                  vendorResult[0][0].lastName,
                businessName: vendorResult[0][0].businessName,
                streetAddress: vendorResult[0][0].streetAddress,
                workNumber: vendorResult[0][0].workNumber,
                mobileNumber: vendorResult[0][0].mobileNumber,
                email: vendorResult[0][0].email,
                category: VendorCategoryResult[0][0].category,
              };
              vendorData.push(vendorDataObject);
            } else {
              vendorData.push(["No Vendor Data Found"]);
            }
          }
        }
        taskByIDResult[0][j].vendor = vendorData;
      }
      res.status(200).json({
        data: taskByIDResult,
        message: "Task data retrieved successfully",
      });
    } else {
      res.status(400).json({
        message: "No tenant Task data found",
      });
    }
  } catch (error) {
    console.log("Error:", error);
    res.send("Error Get tenant Task");
  }
};
exports.updateTenantProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    console.log(userId);
    console.log(req.body);
    const {
      firstName,
      lastName,
      companyName,
      email,
      phone,
      address,
      city,
      state,
      zipcode,
      Image,
      imageKey,
    } = req.body;
    const tenantcheckresult = await queryRunner(selectQuery("tenants", "id"), [
      userId,
    ]);
    if (tenantcheckresult[0].length > 0) {
      const tenantsInsert = await queryRunner(updateTenantsProfile, [
        firstName,
        lastName,
        companyName,
        email,
        phone,
        address,
        city,
        state,
        zipcode,
        Image,
        imageKey,
        userId,
      ]);
      if (tenantsInsert[0].affectedRows > 0) {
        res.status(200).json({
          message: "Tenants save Successful",
          data: tenantsInsert[0],
        });
      } else {
        res.status(200).json({
          message: "Tenants is not found",
        });
      }
    }
  } catch (error) {
    res.send("Error Get Tenants By ID");
    console.log(error);
  }
};
//  ############################# Task tenant ############################################################










//  ############################# get all Tenant Attach File Start ############################################################
exports.GettenantAttachEmailPhone = async (req, res) => {
  const { tenantID } = req.params; 

  try {
    const tenantAlternateEmailResult = await queryRunner(selectQuery("tenantalternateemail", "tenantID"), [
      tenantID,
    ]);
    const tenantAlternatePhoneResult = await queryRunner(selectQuery("tenantalternatephone", "tenantID"), [
      tenantID,
    ]);
      if (tenantAlternateEmailResult[0].length === 0 && tenantAlternatePhoneResult[0].length === 0) {
        // throw new Error("No data Found in tenant attach file");
return res.status(201).json({ Info: "No data found in tenant attach file" });

      }else{
        res.status(200).json({
          message: " Alternate get successful",
          Email : tenantAlternateEmailResult[0],
          Phone : tenantAlternatePhoneResult[0]
        });
      }

  } catch (error) {
    res.status(400).send("Error4" + error);
    console.log(error);
  }
};
//  ############################# Add Tenant Attach File End ############################################################
