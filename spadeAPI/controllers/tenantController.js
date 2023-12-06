const user = require("../models/user");

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
  checkUpaidInvoiceQuery,
  tenantStatusCountQuery,
  tenantsCount,
  tenantsIdUpdate
} = require("../constants/queries");
const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const { file } = require("googleapis/build/src/apis/file");

const config = process.env;


exports.createTenants = async (req, res) => {
  try {
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
    const { userId } = req.user;


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
          const tenantCountIdResult = await queryRunner(tenantsCount, [userId]);

          let customTenantId = tenantCountIdResult[0][0].count + 1;

          
          customTenantId = lastName+customTenantId;

          const tenantIdUpdateResult = await queryRunner(tenantsIdUpdate ,[customTenantId, tenantsInsert[0].insertId]);






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

        } else {

          res.status(400).json({
            message: "Error occur in update tenant property unit",
          });
        }
      } else {

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




exports.sendInvitationLink = async (req, res) => {
  const { tenantEmail } = req.user;
  const { tenantID } = req.body;
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




exports.createResetEmailTenant = async (req, res) => {

  const { email } = req.body;
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



exports.verifyResetEmailCodeTenant = async (req, res) => {
  const { id, token } = req.body;

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


exports.tenantAllPaidInvoice = async (req, res) => {
  try {
    const { userId } = req.user;

    const tenantAllPaidInvoiceResult = await queryRunner(
      checkTenantInvoicePaidQuery,
      [userId]
    );

    if (tenantAllPaidInvoiceResult[0].length === 0) {
      const tenantAllPaid = await queryRunner(updateTenantAccountQuery, [
        0,
        userId,
      ]);

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



exports.addAlternateEmailPhone = async (req, res) => {
  const { tenantID, alternatePhone, alternateEmail } = req.body;
  try {
      for (let i = 0; i < alternatePhone.length; i++) {
        const phoneName = alternatePhone[i].phoneName;
        const phoneNumber = alternatePhone[i].phoneNumber;
        const alternatePhoneDataResult = await queryRunner(
          insertAlternatePhoneData,
          [tenantID, phoneName, phoneNumber]
        );
      }
      for (let i = 0; i < alternateEmail.length; i++) {
        const emailName = alternateEmail[i].emailName;
        const email = alternateEmail[i].email;
        const alternateEmailDataResult = await queryRunner(
          insertAlternateEmailData,
          [tenantID, emailName, email]
        );
      }
      res.status(200).json({
        message: "Email and phone number successfully saved",
      });
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
  }
};





exports.tenantAttachFile = async (req, res) => {

  const { tenantID, images } = req.body;

  const { userId } = req.user;

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



exports.tenantAttachFileDelete = async (req, res) => {
  try {

    const { id } = req.body;

    const { userId } = req.user;
    const attachFileResult = await queryRunner(
      selectQuery("tenantattachfiles", "id"), [id]);
    if (attachFileResult[0].length > 0) {
      const file = attachFileResult[0][0].ImageKey;


      deleteImageFromS3(file);

      const PropertyDeleteResult = await queryRunner(
        deleteQuery("tenantattachfiles", "id", "landlordID"),
        [id, userId]
      );
      if (PropertyDeleteResult[0].affectedRows > 0) {
        res.status(200).json({
          data: file,
          message: " Tenant Files deleted successful",
        });
      }else {
        res.status(400).json({
          message: "Something went wrong while deleting an attached file",
        });
      }
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



exports.tenantDelete = async (req, res) => {
  try {
    const { tenantID } = req.body;
    const tenantResult = await queryRunner(selectQuery("tenants", "id"), [
      tenantID,
    ]);

    if (tenantResult[0].length > 0) {
      const tenantAllPaidInvoiceResult = await queryRunner(
        checkMyAllTenantsInvoicePaidQuerytenant,
        [tenantID]
      );

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

        if (tenantDeleteResult[0].affectedRows > 0) {
          const tenantCheckResult = await queryRunner(
            selectQuery("tenantattachfiles", "tenantID"),
            [tenantID]
          );
          if (tenantCheckResult[0].length > 0) {
            const tenantimages = tenantCheckResult[0].map(
              (image) => image.fileName
            );

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

          res.status(200).json({
            message: "Error occur in delete tenant ",
          });
        }
      }
    } else {

      res.status(200).json({
        message: "No tenant found ",
      });
    }

  } catch (error) {
    console.log(error);
    res.send("Error from delete tenants ", error);

  }
};



exports.getTenantsByID = async (req, res) => {
  try {

    const { id } = req.query;

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


        if (propertyUnitsResult[0].affectedRows > 0) {
          if (increaseRent == "No") {
            res.status(200).json({
              message: "Tenants save Successful",
              data: tenantsInsert[0],
              tenantId: tenantsInsert[0].insertId,
            });
          } else {

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

  } catch (error) {
    console.log(error);
    res.send("Error occurs in updating Tenants  " + error);
  }
};





















































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



exports.GettenantAttachEmailPhone = async (req, res) => {

  const { tenantID } = req.query; 


  try {
    const tenantAlternateEmailResult = await queryRunner(selectQuery("tenantalternateemail", "tenantID"), [
      tenantID,
    ]);
    const tenantAlternatePhoneResult = await queryRunner(selectQuery("tenantalternatephone", "tenantID"), [
      tenantID,
    ]);
      if (tenantAlternateEmailResult[0].length === 0 && tenantAlternatePhoneResult[0].length === 0) {

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














exports.checkUnpaidInvoices = async (req, res) => {
  const {tenants} = req.query;



  try {
    const allResults = []; 
    for (let i = 0; i < tenants.length; i++) {
      const ID = tenants[i];

      var checkUnpaidInvoicesResult = await queryRunner(checkUpaidInvoiceQuery, [tenants[i]]);
      console.log(checkUnpaidInvoicesResult)
      if (checkUnpaidInvoicesResult[0].length === 0) {
        continue;
      }
      allResults.push(...await checkUnpaidInvoicesResult[0]);
      console.log(allResults)
    }
    if (allResults.length === 0) {
      return res.status(201).json({ Info: "No data found in tenant " });
    } else {
      res.status(200).json({
        message: "tenants get successful",
        data: allResults, 
      });
    }
  } catch (error) {
    console.error("Error: " + error.message);
    res.status(400).send("Error: " + error.message);
  }
};





exports.allTenantDelete = async (req, res) => {
  try {
    let { id } = req.body;
   
  for(let i = 0; i < id.length; i++ ){
   const tenantID = id[i];
    const tenantResult = await queryRunner(selectQuery("tenants", "id"), [
      tenantID,
    ]);
    if (tenantResult[0].length > 0) {
    const propertyUnitID = tenantResult[0][0].propertyUnitID;
    const tenantDeleteResult = await queryRunner(
      deleteQuery("tenants", "id"),
      [tenantID]
    );
    if (tenantDeleteResult[0].affectedRows > 0) {
      const tenantCheckResult = await queryRunner(
        selectQuery("tenantattachfiles", "tenantID"),
        [tenantID]
      );
      if (tenantCheckResult[0].length > 0) {
        const tenantimages = tenantCheckResult[0].map(
          (image) => image.fileName
        );

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
    } 
        } 
    }
    res.status(200).json({
      message: " tenant deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message:"Error from delete tenants ",
      error
  });
  }
};




exports.TenantStatusCP = async (req, res) => {
  try {
    let { startDate, endDate } = req.params;
    let { userId} = req.user;
    const TenantStatusCPResult = await queryRunner(tenantStatusCountQuery, [startDate, endDate,userId,userId]);
    if (TenantStatusCPResult[0].length > 0) {
      let previousTenant;
      if(TenantStatusCPResult[0][0].currentTenant == 0){
         previousTenant = 0;
      }else{
       previousTenant = TenantStatusCPResult[0][0].totalTenant - TenantStatusCPResult[0][0].currentTenant; 
      }
      const data = {
        totalTenant : TenantStatusCPResult[0][0].totalTenant,
        currentTenant : TenantStatusCPResult[0][0].currentTenant,
        previousTenant : previousTenant,
      }
    res.status(200).json({
      message: " tenant Get successfully",
      data : data
    });
  }else{
    res.status(201).json({
      message: " No tenant Found",
      data : data
    });
  }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message:"Error tenants Dashboard ",
      error
  });
  }
};






exports.checkEmailTenants = async function (req, res) {
  const { email } = req.query;

  try {
    const selectResult = await queryRunner(selectQuery("tenants","email"), [ 
      email,
  ]);

    if (selectResult[0].length > 0 ) {
      return res.status(201).json({
          message: "Email already exists ",
      });
    } 
    else {
      res.status(200).json({
                 message: "New Tenant",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};



