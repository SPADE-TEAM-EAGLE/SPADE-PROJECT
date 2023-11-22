const user = require("../models/user");
const {
  sendMail,
  taskSendMail,
  sendMailLandlord,
  propertyMail
} = require("../sendmail/sendmail.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const Path = require("path");
const imageToDelete = require("./../middleware/deleteImage.js");
const { serialize } = require("cookie");
const {

  selectQuery,
  deleteQuery,
  insertInUsers,
  addResetToken,
  insertInProperty,
  insertInPropertyImage,
  updateProperty,
  insertInPropertyUnits,
  updatePropertyUnits,
  selectPropertyTenant,
  getUnitsCount,
  insertMoreUnits,
  putUnitsUpdate,
  selectAllTenants,
  PropertyUnitsVacant,
  propertyTaskQuery,
  selectAllTenantsProperty,
  updateUser,
  updatePlanId,
  updateEmailQuery,
  updateVerifiedStatusQuery,
  delteImageFromDb,
  updateNotify,
  updatePasswordLandlord,
  getAllProperty,
  getPropertyReport,
  getTenantReport,
  getInvoiceReportData,
  getTaskReportData,
  getLeaseReport,
  getTotalAmount,
  getTotalAmountUnpaid,
  getTotalAmountPaid,
  getNumPropertyTenant,
  insertNotify,
  getPropertiesGraphData,
  getTaskGraphData,
  getInvoiceGraphData,
  updateUserActive,
  getUserById,
  getTenantById,
  updateTenantActive,
  getPropertyDashboardData,
  getPropertiesGraphDataBypropertyID,
  getInvoiceGraphDataByPropertId,

  getTaskGraphDataByPropertyId,
  getInvoiceGraphDataByPropertyId,
  updateUserAccountQuery,
  checkMyAllTenantsInvoicePaidQuery,
  updateAllTenantsAccountQuery,
  getAllTenantsQuery,
  deleteUserAccountData,
  updateAuthQuery,
  addResetTokenTenant,
  propertyUnitCount,
  getMessageCountByID,
  checkProperty,
  insertVendorCategory,
  insertProspectusSources,
  userPermissionLogin,
  addUserRoles,
  UpdatePropertyUnitCount,
  UnitCounts,
  UpdateUserNuveiIdQuery,
  InvoiceCategoriesQuery,
  adminNotificationQuery,
  propertyIdUpdate,
  propertyCount
  // updatePropertyBankAccountQuery
} = require("../constants/queries");

const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const { fileUpload, deleteImageFromS3 } = require("../helper/S3Bucket");
const { verifyMailCheck } = require("../helper/emailVerify");
const userServices = require("../Services/userServices");
const { log } = require("console");
// const { encryptJwtToken } = require("../helper/EnccryptDecryptToken");
// const { NotificationSocket } = require("../app.js");
const config = process.env;

exports.createUser = async function (req, res) {
  const { firstName, lastName, email, phone, password, planID } = req.body;
  currentDate = new Date();
  try {
    const selectResult = await queryRunner(selectQuery("users", "Email"), [
      email,
    ]);
    if (selectResult[0].length > 0) {
      return res.status(400).send("Email already exists");
    }
    const hashPassword = await hashedPassword(password);
    // generate a unique identifier for the user
    const salt = bcrypt.genSaltSync(10);
    const id = bcrypt
      .hashSync(lastName + new Date().getTime().toString(), salt)
      .substring(0, 10);
    const insertResult = await queryRunner(insertInUsers, [
      id,
      firstName,
      lastName,
      email,
      phone,
      hashPassword,
      planID,
      currentDate,
      currentDate,
    ]);
    const name = firstName + " " + lastName;
    const mailSubject = "Spade Welcome Email";
    if (insertResult[0].affectedRows > 0) {
      // console.log(name)
      // update notification table with user id
      // landlordID, emailNotification, pushNotification, textNotification
      const selectResult = await queryRunner(selectQuery("users", "Email"), [
        email,
      ]);
      await queryRunner(insertNotify, [
        selectResult[0][0].id,
        "yes",
        "yes",
        "yes",
      ]);

      // add  prospectus sources
      await queryRunner(insertProspectusSources, [
        selectResult[0][0].id,
        "System"
      ]);
      // add vendor Category
      const category = ["Handyman","Plumber","Electrician","Lawn Maintenance"]
      for(let i=0; i< category.length; i++){
        await queryRunner(insertVendorCategory, [
          selectResult[0][0].id,
          category[i]
        ]);
      }

      // add Invoice Category
      const invoiceCategory = ["Late Fees","Miscellaneous Fees","Security Deposit"]
      for(let i=0; i< invoiceCategory.length; i++){
        await queryRunner(InvoiceCategoriesQuery, [
          selectResult[0][0].id,
          invoiceCategory[i],
          "0",
          "0"
        ]);
      }
      // add Admin Notification
        await queryRunner(adminNotificationQuery, [
          selectResult[0][0].id, firstName, lastName, planID,"Created",currentDate
        ]);

      // await sendMail(email, mailSubject, password, name);
      await sendMailLandlord(email, mailSubject, name);
      try{
        await queryRunner(addUserRoles,['Owner', selectResult[0][0].id]);
        await queryRunner(addUserRoles,['Manager', selectResult[0][0].id]);
        await queryRunner(addUserRoles,['Staff', selectResult[0][0].id]);

        return res.status(200).json({ 
          message: "User added successfully",
          id : selectResult[0][0].id 
        });

      }catch (error){
        console.log(error)
        return res.status(500).send("Failed to add user");
      }
      
      
    } else {
      return res.status(500).send("Failed to add user");
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
exports.checkemail = async function (req, res) {
  const { email } = req.query;
  // const { email } = req.body;
  try {
    const selectResult = await queryRunner(selectQuery("userPUsers","UEmail"), [ 
      email,
  ]);
  const LandlordSelectResult = await queryRunner(selectQuery("users", "Email"), [
      email,
    ]);
    if (selectResult[0].length > 0 && LandlordSelectResult[0].length > 0) {
      return res.status(201).json({
          message: "Email already exists ",
      });
    }else if(selectResult[0].length > 0 ){
      return res.status(201).json({
          message: "Email already exists ",
      });
    }else if (LandlordSelectResult[0].length > 0){
      return res.status(201).json({
          message: "Email already exists ",
      });
    } 
    else {
      res.status(200).json({
                 message: "New user",
      });
    }
  } catch (error) {
    // res.status(500).send("Error");
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getUser = (req, res) => {
  // console.log(req.user);
  res.status(200).json(req.user);
};

exports.Signin = async function (req, res) {
  const { email, password, tenant } = req.query;
  // const { email, password, tenant } = req.body;
  // const { email, password, tenant } = req.query;
  // console.log(1)
  // let selectResult;
  try {
    if (tenant == "tenant") {
      // console.log("tenant");
      await queryRunner(updateTenantActive, [1, email]);
      const selectResult = await queryRunner(selectQuery("tenants", "email"), [
        email,
      ]);
      if (selectResult[0].length === 0) {
        res.status(400).send("Email not found");
      } else if (
        await bcrypt.compare(password, selectResult[0][0].tenantPassword)
      ) {
        const id = selectResult[0][0].id;
        const token = jwt.sign({ email, id }, config.JWT_SECRET_KEY, {
          expiresIn: "3h",
        });
        if (selectResult[0][0].isTenantAccount == "1") {
          if(selectResult[0][0].auth == 1){
            const random = Math.floor(100000 + Math.random() * 900000);
            sendMail(email, "2-Factor Authentication", random, selectResult[0][0].FirstName + " " + selectResult[0][0].LastName);
            const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
            const updateResult = await queryRunner(addResetTokenTenant, [
              random,
              formattedDate,
              selectResult[0][0].id,
            ]);
          }
          res.status(200).json({
            token: token,
            body: selectResult[0][0],
            message: "Successful Login",
          });
        } else {
          res.status(200).json({
            // token: token,
            // body: selectResult[0][0],
            message: "Your Account is Closed",
          });
        }
      } else {
        res.status(400).send("Incorrect Password");
      }
    } else {
      // console.log("111",email);
      // for landlord
      await queryRunner(updateUserActive, [1, email]);
      const selectResult = await queryRunner(selectQuery("users", "Email"), [
        email,
      ]);
// if(selectResult[0][0].PlanID == 1){
//   const currentDate = new date();
//   const createdDate = "2023-07-14 12:34:07";

// }
      // console.log(selectResult[0]);
    //   if(selectResult[0][0].PlanID == 1)
    //   {
    //     const currentDate = new Date();
    //     const subscriptionDate = new Date(selectResult[0][0].created_at);
    //     const timeDiff = currentDate - subscriptionDate;
    //     const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    // if (daysDiff >= 30) {
    //     return res.status(200).json({
    //       message: "Your Subscription is expired"
    //     }); 
    // }
    //   }
      if (selectResult[0].length === 0) {
        const selectUserPermissionResult = await queryRunner(userPermissionLogin, [
          email,
        ]);
        if (selectUserPermissionResult[0].length === 0) {
          res.status(400).send("Email not found");
        } else if (await bcrypt.compare(password, selectUserPermissionResult[0][0].UPassword)) {
            if(selectUserPermissionResult[0][0].PlanID == 1)
      {
        const currentDate = new Date();
        const subscriptionDate = new Date(selectUserPermissionResult[0][0].created_at);
        const timeDiff = currentDate - subscriptionDate;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    if (daysDiff >= 30) {
        return res.status(200).json({
          message: "Your Subscription is expired"
        }); 
    }
      }
          const id = selectUserPermissionResult[0][0].llnalordId;
          const role = selectUserPermissionResult[0][0].URole;
          const UserPermissionID = selectUserPermissionResult[0][0].UPID;

          const token = jwt.sign({ email, id, role, UserPermissionID}, config.JWT_SECRET_KEY, {
            expiresIn: "3h",
          });
          // ################################# Count ##############################################
          const userId = selectUserPermissionResult[0][0].llnalordId;
          console.log(userId);
          // Property
          const propertycheckresult = await queryRunner(
            selectQuery("property", "landlordID"),
            [userId]
          );
          if (propertycheckresult[0].length > 0) {
            property = "true";
          } else {
            property = "false";
          }
          // Tenant
          const tenantcheckresult = await queryRunner(
            selectQuery("tenants", "landlordID"),
            [userId]
          );
          if (tenantcheckresult[0].length > 0) {
            tenants = "true";
          } else {
            tenants = "false";
          }
  
          //Invoice
          const invoicecheckresult = await queryRunner(
            selectQuery("invoice", "landlordID"),
            [userId]
          );
          if (invoicecheckresult[0].length > 0) {
            invoice = "true";
          } else {
            invoice = "false";
          }
  
          //Task
          const taskcheckresult = await queryRunner(
            selectQuery("task", "landlordID"),
            [userId]
          );
          if (taskcheckresult[0].length > 0) {
            task = "true";
          } else {
            task = "false";
          }
  
          //vendors
          const vendorscheckresult = await queryRunner(
            selectQuery("vendor", "LandlordID"),
            [userId]
          );
          if (vendorscheckresult[0].length > 0) {
            vendors = "true";
          } else {
            vendors = "false";
          }
          // ################################# Count ##############################################
  
          if (selectUserPermissionResult[0][0].isUserAccount == "1") {
            // res.status(200).json({
            //   token: token,
            //   body: selectResult[0][0],
            //   message: "Successful Login",
            // });
            // }
  
            if (selectUserPermissionResult[0][0].userVerified == "Email Verified") {
              // ################################# Count ##############################################
              const userId = selectUserPermissionResult[0][0].llnalordId;
              // console.log(userId);
              // Property
              const propertycheckresult = await queryRunner(
                selectQuery("property", "landlordID"),
                [userId]
              );
              if (propertycheckresult[0].length > 0) {
                property = "true";
              } else {
                property = "false";
              }
              // Tenant
              const tenantcheckresult = await queryRunner(
                selectQuery("tenants", "landlordID"),
                [userId]
              );
              if (tenantcheckresult[0].length > 0) {
                tenants = "true";
              } else {
                tenants = "false";
              }
  
              //Invoice
              const invoicecheckresult = await queryRunner(
                selectQuery("invoice", "landlordID"),
                [userId]
              );
              if (invoicecheckresult[0].length > 0) {
                invoice = "true";
              } else {
                invoice = "false";
              }
  
              //Task
              const taskcheckresult = await queryRunner(
                selectQuery("task", "landlordID"),
                [userId]
              );
              if (taskcheckresult[0].length > 0) {
                task = "true";
              } else {
                task = "false";
              }
              //vendors
              const vendorscheckresult = await queryRunner(
                selectQuery("vendor", "LandlordID"),
                [userId]
              );
              if (vendorscheckresult[0].length > 0) {
                vendors = "true";
              } else {
                vendors = "false";
              }
              // ################################# Count ##############################################
              
              res.status(200).json({
                property: property,
                tenants: tenants,
                invoice: invoice,
                task: task,
                vendors: vendors,
                token: token,
                body: selectUserPermissionResult[0][0],
                message: "Email is verified",
              });
            } else {
              const emailMessage = await verifyMailCheck(email);
              if (
                emailMessage.message ==
                "Your account is locked due to email verification. Please verify your email."
              ) {
                
                res.status(200).json({
                  property: property,
                  tenants: tenants,
                  invoice: invoice,
                  task: task,
                  vendors: vendors,
                  token: token,
                  body: selectUserPermissionResult[0][0],
                  message: "Email is not verified",
                  msg: emailMessage.message,
                });
              } else {
                res.status(200).json({
                  property: property,
                  tenants: tenants,
                  invoice: invoice,
                  task: task,
                  vendors: vendors,
                  token: token,
                  body: selectUserPermissionResult[0][0],
                  message: "Successful Login",
                  msg: emailMessage.message,
                  email: email,
                });
              }
            }
          } else {
            res.status(200).json({
              // token: token,
              // body: selectResult[0][0],
              message: "Your Account is Closed",
            });
          }
        }

        else{
          res.status(400).send("Incorrect Password");
         }
        
      } else if (await bcrypt.compare(password, selectResult[0][0].Password)) {
          if(selectResult[0][0].PlanID == 1)
      {
        const currentDate = new Date();
        const subscriptionDate = new Date(selectResult[0][0].created_at);
        const timeDiff = currentDate - subscriptionDate;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff >= 30) {
        return res.status(200).json({
          message: "Your Subscription is expired"
        }); 
    }
      }
        const id = selectResult[0][0].id;
        const token = jwt.sign({ email, id}, config.JWT_SECRET_KEY, {
          expiresIn: "3h",
        });
        // const emai = "umairnazakat2222@gmail.com"
        //  const emailMessage =  await verifyMailCheck(email);


        // ################################# Count ##############################################
        const userId = selectResult[0][0].id;
        console.log(userId);
        // Property
        const propertycheckresult = await queryRunner(
          selectQuery("property", "landlordID"),
          [userId]
        );
        if (propertycheckresult[0].length > 0) {
          property = "true";
        } else {
          property = "false";
        }
        // Tenant
        const tenantcheckresult = await queryRunner(
          selectQuery("tenants", "landlordID"),
          [userId]
        );
        if (tenantcheckresult[0].length > 0) {
          tenants = "true";
        } else {
          tenants = "false";
        }

        //Invoice
        const invoicecheckresult = await queryRunner(
          selectQuery("invoice", "landlordID"),
          [userId]
        );
        if (invoicecheckresult[0].length > 0) {
          invoice = "true";
        } else {
          invoice = "false";
        }

        //Task
        const taskcheckresult = await queryRunner(
          selectQuery("task", "landlordID"),
          [userId]
        );
        if (taskcheckresult[0].length > 0) {
          task = "true";
        } else {
          task = "false";
        }

        //vendors
        const vendorscheckresult = await queryRunner(
          selectQuery("vendor", "LandlordID"),
          [userId]
        );
        if (vendorscheckresult[0].length > 0) {
          vendors = "true";
        } else {
          vendors = "false";
        }
        // ################################# Count ##############################################

        if (selectResult[0][0].isUserAccount == "1") {
          // res.status(200).json({
          //   token: token,
          //   body: selectResult[0][0],
          //   message: "Successful Login",
          // });
          // }

          if (selectResult[0][0].userVerified == "Email Verified") {
            // ################################# Count ##############################################
            const userId = selectResult[0][0].id;
            console.log(userId);
            // Property
            const propertycheckresult = await queryRunner(
              selectQuery("property", "landlordID"),
              [userId]
            );
            if (propertycheckresult[0].length > 0) {
              property = "true";
            } else {
              property = "false";
            }
            // Tenant
            const tenantcheckresult = await queryRunner(
              selectQuery("tenants", "landlordID"),
              [userId]
            );
            if (tenantcheckresult[0].length > 0) {
              tenants = "true";
            } else {
              tenants = "false";
            }

            //Invoice
            const invoicecheckresult = await queryRunner(
              selectQuery("invoice", "landlordID"),
              [userId]
            );
            if (invoicecheckresult[0].length > 0) {
              invoice = "true";
            } else {
              invoice = "false";
            }

            //Task
            const taskcheckresult = await queryRunner(
              selectQuery("task", "landlordID"),
              [userId]
            );
            if (taskcheckresult[0].length > 0) {
              task = "true";
            } else {
              task = "false";
            }
            //vendors
            const vendorscheckresult = await queryRunner(
              selectQuery("vendor", "LandlordID"),
              [userId]
            );
            if (vendorscheckresult[0].length > 0) {
              vendors = "true";
            } else {
              vendors = "false";
            }
            // ################################# Count ##############################################
            if(selectResult[0][0].auth == 1){
              const random = Math.floor(100000 + Math.random() * 900000);
              sendMail(email, "2-Factor Authentication", random, selectResult[0][0].FirstName + " " + selectResult[0][0].LastName);
              const now = new Date();
      const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
              const updateResult = await queryRunner(addResetToken, [
                random,
                formattedDate,
                selectResult[0][0].id,
              ]);
            }
            res.status(200).json({
              property: property,
              tenants: tenants,
              invoice: invoice,
              task: task,
              vendors: vendors,
              token: token,
              body: selectResult[0][0],
              message: "Email is verified",
            });
          } else {
            const emailMessage = await verifyMailCheck(email);
            if (
              emailMessage.message ==
              "Your account is locked due to email verification. Please verify your email."
            ) {
              
              res.status(200).json({
                property: property,
                tenants: tenants,
                invoice: invoice,
                task: task,
                vendors: vendors,
                token: token,
                body: selectResult[0][0],
                message: "Email is not verified",
                msg: emailMessage.message,
              });
            } else {
              if(selectResult[0][0].auth == 1){
                const random = Math.floor(100000 + Math.random() * 900000);
                sendMail(email, "2-Factor Authentication", random, selectResult[0][0].FirstName + " " + selectResult[0][0].LastName);
                const now = new Date();
                const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
                        const updateResult = await queryRunner(addResetToken, [
                          random,
                          formattedDate,
                          selectResult[0][0].id,
                        ]);
              }
              res.status(200).json({
                property: property,
                tenants: tenants,
                invoice: invoice,
                task: task,
                vendors: vendors,
                token: token,
                body: selectResult[0][0],
                message: "Successful Login",
                msg: emailMessage.message,
                email: email,
              });
            }
          }
        } else {
          res.status(200).json({
            // token: token,
            // body: selectResult[0][0],
            message: "Your Account is Closed",
          });
        }
      } else {
        res.status(400).send("Incorrect Password");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};
exports.Signinall = async function (req, res) {
  try {
    const selectResult = await queryRunner(selectQuery("users"));
    if (selectResult[0].length > 0) {
      res.status(200).json({
        body: result,
      });
    } else {
      res.status(400).json({
        message: "No user found",
      });
    }
  } catch (error) {
    res.status(400).send("Error");
  }
};
exports.updateUserProfile = async function (req, res) {
  const {
    firstName,
    lastName,
    email,
    phone,
    businessName,
    streetAddress,
    businessAddress,
    imageUrl,
    imageKey,
    PACity,
    PAState,
    PAZipcode,
    BACity,
    BAState,
    BAZipcode
  } = req.body;
  const { userId } = req.user;
  console.log(req.body);
  console.log(userId);
  try {
    const selectResult = await queryRunner(selectQuery("users", "id"), [
      userId,
    ]);
    // current date
    const now = new Date();
    // const created_at = now.toISOString().slice(0, 19).replace("T", " ");

    const isUserExist = selectResult[0][0];
    if (!isUserExist) {
      // throw new Error("User not found");
      res.status(200).json({
        message: "User not found",
      });
    }
    if (isUserExist) {
      const updateUserParams = [
        firstName, // Replace undefined with null
        lastName,
        email,
        phone,
        now,
        businessName,
        streetAddress,
        businessAddress,
        imageUrl,
        imageKey,
        PACity,
        PAState,
        PAZipcode,
        BACity,
        BAState,
        BAZipcode,
        userId,
      ];
      const updateResult = await queryRunner(updateUser, updateUserParams);
      if (updateResult[0].affectedRows > 0) {
        res.status(200).json({
          message: "User updated successfully",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.updatePlanId = async function (req, res) {
  // const { userId } = req.body;
  const { userId } = req.user;
  try {
    const selectResult = await queryRunner(selectQuery("users", "id"), [
      userId,
    ]);
    // current date
    const isUserExist = selectResult[0][0];
    if (!isUserExist) {
      // throw new Error("User not found");
      res.status(200).json({
        message: "User not found",
      });
    }
    if (isUserExist) {
      const updateUserParams = [req.body.planID, userId];
      const updateResult = await queryRunner(updatePlanId, updateUserParams);
      if (updateResult[0].affectedRows > 0) {
        res.status(200).json({
          message: "planID updated successfully",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

//  ############################# Reset Email ############################################################
exports.createResetEmail = async (req, res) => {
  const { email } = req.body;
  // console.log(email);
  const mailSubject = "Spade Reset Email";
  const random = Math.floor(100000 + Math.random() * 900000);
  try {
    const selectResult = await queryRunner(selectQuery("users", "Email"), [
      email,
    ]);
    if (selectResult[0].length > 0) {
      const userid = selectResult[0][0].id;
      const name =
        selectResult[0][0].FirstName + " " + selectResult[0][0].LastName;
      sendMail(email, mailSubject, random, name);
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
      const updateResult = await queryRunner(addResetToken, [
        random,
        formattedDate,
        userid,
      ]);
      if (updateResult[0].affectedRows === 0) {
        res.status(400).send("Errorqqq");
      } else {
        res.status(200).json({ message: "Sended", id: userid });
      }
    } else if (selectResult[0].length === 0) {
      res.status(400).send("Email not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Error");
  }
};
//  ############################# Reset Email ############################################################

//  ############################# Verify Reset Email Code ############################################################
exports.verifyResetEmailCode = async (req, res) => {
  const { id, token } = req.body;
  // console.log(req.body)

  try {
    const selectResult = await queryRunner(
      selectQuery("users", "id", "token"),
      [id, token]
    );
    if (selectResult[0].length > 0) {
      const now = new Date(selectResult[0][0].updated_at);
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
        message: "Cannot Validate!",
      });
    }
  } catch (error) {
    res.status(400).send("Error");
  }
};

exports.verifyAuthCode = async (req, res) => {
  const { id, token, tenant } = req.body;
  var selectResult;
  try {
    if(tenant == "tenant"){
      selectResult = await queryRunner(
        selectQuery("tenants", "id", "token"),
        [id, token]
      );
    }else{

      selectResult = await queryRunner(
        selectQuery("users", "id", "token"),
        [id, token]
      );
      
    }
    if (selectResult[0].length > 0) {
      const now = new Date(selectResult[0][0].updated_at);
      const now2 = new Date();
      const formattedDate = now2.toISOString().slice(0, 19).replace("T", " ");
      const time = new Date(formattedDate) - now;
      const time2 = time / 1000;
      if (time2 >= 300) {
        res.status(400).json({
          message: "OTP expired",
        });
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
//  ############################# Verify Reset Email Code ############################################################

//  ############################# Update Password ############################################################

exports.updatePassword = async (req, res) => {
  const { id, password, confirmpassword, token } = req.body;
  // const currentDate = new Date();

  try {
    if (password === confirmpassword) {
      const hashPassword = await hashedPassword(password);
      const currentDate = new Date();
      const selectResult = await queryRunner(updatePasswordLandlord, [
        hashPassword,
        currentDate,
        id,
        token,
      ]);
      if (selectResult[0].affectedRows > 0) {
        res.status(200).json({
          message: "Successful password saved",
        });
      } else {
        console.log("here");
        res.status(500).send("Error");
      }
    } else {
      res.status(201).send("Password Does not match ");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Error" + error);
  }
};
//  ############################# Update Password ############################################################

//  ############################# resend Code ############################################################
exports.resendCode = async (req, res) => {
  const { id } = req.body;
  console.log(req.body);
  const mailSubject = "Spade Reset Email";
  const random = Math.floor(100000 + Math.random() * 900000);
  try {
    const selectResult = await queryRunner(selectQuery("users", "id"), [id]);
    if (selectResult[0].length > 0) {
      const userid = selectResult[0][0].id;
      const name =
        selectResult[0][0].FirstName + " " + selectResult[0][0].LastName;
      // console.log(selectResult[0][0])
      sendMail(selectResult[0][0].Email, mailSubject, random, name);
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
      const updateResult = await queryRunner(addResetToken, [
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

//  ############################# Get Pricing Plan Start ############################################################
exports.pricingPlan = async (req, res) => {
  try {
    const pricingPlanResult = await queryRunner(selectQuery("plan"));
    if (pricingPlanResult.length > 0) {
      const data = JSON.parse(JSON.stringify(pricingPlanResult));
      res.status(200).json({
        data: data[0],
        message: "property By ID",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.send("Error Get Property By ID");
    console.log(error);
  }
};
//  ############################# Get Pricing Plan End ############################################################

//  ############################# Property Start ############################################################

// exports.property = async (req, res) => {
//   const {
//     // landlordID,
//     propertyName,
//     address,
//     city,
//     state,
//     zipCode,
//     propertyType,
//     propertySQFT,
//     units,
//     images,

//   } = req.body;
//   try {
//     // const { userId } = req.user;
//     const { userId, email } = req.user;
//     // if (
//     //   !propertyName ||
//     //   !address ||
//     //   !city ||
//     //   !state ||
//     //   !zipCode ||
//     //   !propertyType ||
//     //   !propertySQFT ||
//     //   !units

//     // ) {
//     //   // throw new Error("Please fill all the fields");
//     //   res.status(200).json({
//     //     message: "Please fill all the fields",
//     //   });
//     // }
//     const currentDate = new Date();
//     // this line check property already exist or not
//     const propertycheckresult = await queryRunner(
//       selectQuery("property", "propertyName", "address"),
//       [propertyName, address]
//     );
//     if (propertycheckresult[0].length > 0) {
//       // throw new Error("Property Already Exist");
//       res.status(200).json({
//         message: "Property Already Exist",
//       });
//     }
//     // console.log("1");
//     const status = "Non-active";
//     console.log(userId);
//     // this line insert data into property table
//     const propertyResult = await queryRunner(insertInProperty, [
//       userId,
//       propertyName,
//       address,
//       city,
//       state,
//       zipCode,
//       propertyType,
//       propertySQFT,
//       status,
//       units,
//       currentDate
//     ]);
//     // console.log("2");
//     // if property data not inserted into property table then throw error
//     if (propertyResult.affectedRows === 0) {
//       // throw new Error("Data doesn't inserted in property table");
//       res.status(200).json({
//         message: "Data doesn't inserted in property table",
//       });
//     }
//     if (propertyResult[0].affectedRows > 0) {
//       const mailSubject = "Property Maintenance: " + propertyName;
//       const landlordUser = await queryRunner(selectQuery("users", "id"), [
//         userId,
//       ]);
//       const FullName =
//         landlordUser[0][0].FirstName + " " + landlordUser[0][0].LastName;
//       // await taskSendMail("tenantName", mailSubject, "dueDate", FullName, "property", "assignedTo", "priority", "companyName", "contactLandlord", userId, email);
//     }
//     const { insertId } = propertyResult[0];
//     // we are using loop to send images data into

//     for (let i = 0; i < images.length; i++) {
//       const { image_url } = images[i];
//       const { image_key } = images[i];
//       const propertyImageResult = await queryRunner(insertInPropertyImage, [
//         insertId,
//         image_url,
//         image_key,
//       ]);

//       if (propertyImageResult.affectedRows === 0) {
//         return res.status(400).json({
//           message: "data doesn't inserted in property image table",
//         });
//       }
//     }

//     // we are using loop to send units data into database
//     for (let i = 0; i < units; i++) {
//       const propertyResult = await queryRunner(insertInPropertyUnits, [
//         insertId,
//         "",
//         "",
//         "",
//         "Vacant",
//       ]);
//       // if property units data not inserted into property units table then throw error
//       if (propertyResult.affectedRows === 0) {
//         // throw new Error("data doesn't inserted in property units table");
//         res.status(200).json({
//           message: "data doesn't inserted in property units table",
//         });
//       }
//     }
//     // if everything is ok then send message and property id
//     res.status(200).json({
//       message: "Property created successful",
//       propertyId: propertyResult[0].insertId,
//     });
//   } catch (error) {
//     res.status(400).json({
//       message: "Error",
//       error: error.message,
//     });
//   }
// };
exports.property = async (req, res) => {
  const {
    propertyName,
    address,
    city,
    state,
    zipCode,
    propertyType,
    propertySQFT,
    units,
    images,
  } = req.body;
  try {
    const { userId, email,paidUnits,userName } = req.user;
    // const { userId, email,paidUnits,userName } = req.body;
    if (
      !propertyName ||
      !address ||
      !city ||
      !state ||
      !zipCode ||
      !propertyType ||
      !propertySQFT ||
      !units
    ) {
      throw new Error("Please fill all the fields");
    }
    const currentDate = new Date();
    // this line check property already exist or not
    // const propertycheckresult = await queryRunner( selectQuery("property", "propertyName", "address","landlordID" ),[propertyName, address,userId]);
    const propertycheckresult = await queryRunner( checkProperty,[propertyName, address,userId]);
    if (propertycheckresult[0].length > 0) {
      throw new Error("Property Already Exist");
    }
    // console.log("1");
    const status = "Non-active";
    console.log(userId);
    // this line insert data into property table
    const propertyResult = await queryRunner(insertInProperty, [
      userId,
      propertyName,
      address,
      city,
      state,
      zipCode,
      propertyType,
      propertySQFT,
      status,
      units,
      currentDate,
    ]);
    // console.log("2");
    // if property data not inserted into property table then throw error
    if (propertyResult.affectedRows === 0) {
      throw new Error("Data doesn't inserted in property table");
    }
    const { insertId } = propertyResult[0];
    // we are using loop to send images data into
    for (let i = 0; i < images.length; i++) {
      const { image_url } = images[i];
      const { image_key } = images[i];
      const propertyImageResult = await queryRunner(insertInPropertyImage, [
        insertId,
        image_url,
        image_key,
      ]);
      // if property image data not inserted into property image table then throw error
      if (propertyImageResult.affectedRows === 0) {
        throw new Error("data doesn't inserted in property image table");
      }
    }
    // we are using loop to send units data into database
    for (let i = 0; i < units; i++) {
      const propertyResult = await queryRunner(insertInPropertyUnits, [
        insertId,
        "",
        "",
        "",
        "Vacant",
        userId,
      ]);
      // paidUnits
      // if property units data not inserted into property units table then throw error
      if (propertyResult.affectedRows === 0) {
        throw new Error("data doesn't inserted in property units table");
      }
    }
    const unitCount = paidUnits + units;
    const propertyUnitCountResult = await queryRunner(UpdatePropertyUnitCount, [unitCount,userId]);
    const pAddress = address+","+city+","+state+","+zipCode;
    const mailSubject = "New Property Added";
    await propertyMail(propertyName,pAddress,propertyType,propertySQFT,units,userName,mailSubject,email )
    
    const propertyCountIdResult = await queryRunner(propertyCount, [propertyResult[0].insertId]);
    let customPropertyId = propertyCountIdResult[0][0].count + 1;
     customPropertyId = propertyName+customPropertyId;
    const propertyIdUpdateResult = await queryRunner(propertyIdUpdate ,[customPropertyId, propertyResult[0].insertId]);
    res.status(200).json({
      message: "Property created successful!!!",
      propertyId: propertyResult[0].insertId,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error",
      error: error.message,
    });
    console.log(error);
  }
};

//  ############################# Property End ############################################################

//  ############################# Get Property Start ############################################################

exports.getproperty = async (req, res) => {
  const { userId, userName } = req.user;
  try {
    const allPropertyResult = await queryRunner(
      selectQuery("property", "landlordID"),
      [userId]
    );
    if (allPropertyResult.length > 0) {
      for (var i = 0; i < allPropertyResult[0].length; i++) {
        const propertyID = allPropertyResult[0][i].id;
        // Retrieve property images for the current property ID

        const propertyUnitCountResult = await queryRunner(propertyUnitCount , [propertyID]);
        if (propertyUnitCountResult[0].length > 0) {
        
        allPropertyResult[0][i].NumberCount = propertyUnitCountResult[0][0];
        }else{
          allPropertyResult[0][i].NumberCount = ["no unit"];
        }
        const allPropertyImageResult = await queryRunner(
          selectQuery("propertyimage", "propertyID"),
          [propertyID]
        );
        if (allPropertyImageResult.length > 0) {
          const propertyImages = allPropertyImageResult[0].map((image) => {
            return { imageURL: image.Image, imageKey: image.ImageKey };
          });
          // Extract image URLs from the result
          allPropertyResult[0][i].images = propertyImages; // Add property images to the current property object
        } else {
          allPropertyResult[0][i].images = ["no Image"]; // Set empty array if no property images found
        }
      }

      res.status(200).json({
        // data: length,
        user: userName,
        data: allPropertyResult,
        user: userName,
        message: "All properties",
      });
      // }
    } else {
      res.status(200).json({
        message: "No Property data found",
      });
    }
  } catch (error) {
    res.send("Error Get Property "+ error );
  }
};

//  ############################# Get Property End ############################################################

//  ############################# Get Property ByID Start ############################################################
exports.getpropertyByID = async (req, res) => {
  try {
    const { userId } = req.user;
    // const propertycheckresult = await queryRunner(selectQuery("property","propertyName","address"),[propertyName,address])
    const PropertyByIDResult = await queryRunner(
      selectQuery("property", "id"),
      [id]
    );
    if (PropertyByIDResult.length > 0) {
      const data = JSON.parse(JSON.stringify(PropertyByIDResult));
      res.status(200).json({
        data: data,
        message: "property By ID",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.send("Error Get Property By ID");
    // console.log(req.body)
    console.log(error);
  }
};
//  ############################# Get Property ByID End ############################################################

//  ############################# Delete Property Start ############################################################
exports.propertyDelete = async (req, res) => {
  const { id } = req.body;
  const { userId } = req.user;
  // const { userId } = req.body;
  try {
    const propertyUnitscheckresult = await queryRunner(
      selectQuery("propertyunits", "propertyID","status"),
      [id, "Occupied"]
    );
    if (propertyUnitscheckresult[0].length > 0) {
      res.status(200).json({
        message: " You are not able to delete Property (your unit is occupied)",
        units : propertyUnitscheckresult[0],
      });
      } else{
    const PropertyDeleteResult = await queryRunner(
      deleteQuery("property", "id"),
      [id]
    );
    if (PropertyDeleteResult[0].affectedRows > 0) {
      const PropertyUnitDeleteResult = await queryRunner(
        deleteQuery("propertyunits", "propertyID"),
        [id]
      );
      const propertycheckresult = await queryRunner(
        selectQuery("propertyimage", "propertyID"),
        [id]
      );
      // console.log(propertycheckresult);
      if (propertycheckresult[0].length > 0) {
        propertyimages = propertycheckresult[0].map((image) => image.Image);
        // delete folder images
        imageToDelete(propertyimages);
        const propertyDeleteresult = await queryRunner(
          deleteQuery("propertyimage", "propertyID"),
          [id]
        );
        const propertyUnitsCountResult = await queryRunner(UnitCounts,[userId]);
        const count = propertyUnitsCountResult[0][0].count;
        const propertyUnitCountResult = await queryRunner(UpdatePropertyUnitCount, [count,userId]);
        if (propertyDeleteresult[0].affectedRows > 0) {
          res.status(200).json({
            message: " Property deleted successfully",
          });
        }
      } else {
        res.status(200).json({
          message: "No Property Image data found ",
        });
      }
    } else {
      res.status(400).json({
        message: "No data found",
      });
      // console.log(PropertyDeleteResult)
    }
  }
  } catch (error) {
    res.send("Error from delete Property ");
    // console.log(req.body)
    console.log(error);
  }
};
//  ############################# Delete Property End ############################################################

//  ############################# Update Property Start ############################################################

exports.propertyUpdate = async (req, res) => {
  try {
    const {
      propertyName,
      address,
      city,
      state,
      zipCode,
      propertyType,
      propertySQFT,
      status,
      id,
      units,
      images,
    } = req.body;
    const { userId } = req.user;
    // const { userId } = req.body;
    const updateData = [
      userId,
      propertyName,
      address,
      city,
      state,
      zipCode,
      propertyType,
      propertySQFT,
      "Active",
      units,
      id,
    ];
    const updatedPropertyData = await queryRunner(updateProperty, updateData);

    if (updatedPropertyData[0].affectedRows) {
      // Get property images from the database
      const propertycheckresult = await queryRunner(
        selectQuery("propertyimage", "propertyID"),
        [id]
      );
      // console.log(images, propertycheckresult[0])
      // Extract the image keys from propertycheckresult
      const propertyImageKeys = propertycheckresult[0].map(
        (image) => image.ImageKey
      );
      console.log(propertyImageKeys);
      // Find the images to delete from S3 (present in propertycheckresult but not in images)
      const imagesToDelete = propertycheckresult[0].filter(
        (image) => !images.some((img) => img.imageKey === image.ImageKey)
      );
      // Delete images from S3
      for (let i = 0; i < imagesToDelete.length; i++) {
        deleteImageFromS3(imagesToDelete[i].ImageKey);
        await queryRunner(delteImageFromDb, [imagesToDelete[i].ImageKey]);
      }
      // Find the images to insert into the database (present in images but not in propertycheckresult)
      const imagesToInsert = images.filter(
        (image) => !propertyImageKeys.includes(image.imageKey)
      );
      // Delete images from the database
      // Insert new images into the database
      await userServices.addImagesInDB(imagesToInsert, id);

      res.status(200).json({
        message: "Property Updated Successfully!",
      });
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: error.message,
    });
  }
};

// try {
//   const {
//     // existingImages,
//     propertyName,
//     address,
//     city,
//     state,
//     zipCode,
//     propertyType,
//     propertySQFT,
//     status,
//     id,
//     units,
//     images,
//   } = req.body;
//   const { userId } = req.user;
//   // console.log(`step : 2 send all values data into database`);
//   // const propertyUpdateResult = await queryRunner(updateProperty, [
//   //   userId,
//   //   propertyName,
//   //   address,
//   //   city,
//   //   state,
//   //   zipCode,
//   //   propertyType,
//   //   propertySQFT,
//   //   "Active",
//   //   units,
//   //   id,
//   // ]);

//   console.log(propertycheckresult , "propertycheckresult")
//   if (propertyUpdateResult[0].affectedRows > 0) {
//     // console.log(`step : 3 check property images into database propertyid = ${id}`);
//     // check property images into database propertyid = ${id}
//     const propertycheckresult = await queryRunner(
//       selectQuery("propertyimage", "propertyID"),
//       [id]
//     );

//     if (propertycheckresult.length > 0) {
//       // propertyimages = propertycheckresult[0].map((image) => image.Image);
//       // let existingImg = existingImages.split(",");
//       // const imagesToDelete = propertyimages.filter(
//       //   (element) => !existingImg.includes(element)
//       // );

//       // // Combine the common elements with array2

//       // imageToDelete(imagesToDelete);
//       // let propertyDeleteresult = [{ affectedRows: 0 }];
//       // // delete images Data into database
//       // if (imagesToDelete.length > 0) {
//       for (let i = 0; i < images.length; i++) {
//         const image = images[i].image_url;
//         propertyDeleteresult = await queryRunner(
//           deleteQuery("propertyimage", "Image"), [image]);
//         // console.log(propertyDeleteresult)
//       }
//       // }

//       // console.log(`step : 4 delete previous images data into database propertyid = ${id}`);
//       // console.log(propertyDeleteresult)
//       // if (propertyDeleteresult[0].affectedRows > 0) {

//       const fileNames = images;
//       // existingImg = [...fileNames];
//       // using loop to send new images data into database
//       for (let i = 0; i < fileNames.length; i++) {
//         // const img = existingImg[i];
//         const image = images[i].image_url;
//         const key = images[i].image_key;
//         const propertyImageResult = await queryRunner(insertInPropertyImage, [
//           id,
//           image,
//           key
//         ]);
//         if (propertyImageResult.affectedRows === 0) {
//           return res.send("Error2");
//         }
//       }

//       return res.status(201).json({
//         message: "Form Submited",
//       });
//     } else {
//       return res.status(400).json({
//         message: "No Property data found",
//       });
//     }
//   } else {
//     return res.status(400).json({
//       message: "No Property",
//     });
//   }

// } catch (error) {
//   console.log(error);
//   return res.send("Error from Updating Property");
// }

//  ############################# Update Property End ############################################################

//  ############################# View Property Start ############################################################
exports.propertyView = async (req, res) => {
  try {
    const { propertyId } = req.query;
    const propertyViewResult = await queryRunner(
      selectQuery("property", "id"),
      [propertyId]
    );
    if (propertyViewResult.length > 0) {



      const propertyUnitCountResult = await queryRunner(propertyUnitCount , [propertyId]);
        if (propertyUnitCountResult[0].length > 0) {
        propertyViewResult[0][0].NumberCount = propertyUnitCountResult[0][0];
        }else{
          propertyViewResult[0][0].NumberCount = ["no unit"];
        }
      // check property Images in database
      const propertyViewImageResult = await queryRunner(
        selectQuery("propertyimage", "propertyID"),
        [propertyId]
      );
      if (propertyViewImageResult.length > 0) {
        // Property Data
        const propertyData = propertyViewResult[0];

        // Property Image Data
        const imageData = propertyViewImageResult[0];

        const propertiesWithImages = propertyData.map((property) => {
          const matchingImages = imageData.filter(
            (image) => image.propertyID === property.id.toString()
          );
          const images = matchingImages.map((image) => ({
            propertyID: image.propertyID,
            image_url: image.Image,
            image_key: image.ImageKey,
          }));
          return {
            ...property,
            images,
          };
        });
        // console.log(propertiesWithImages[0].images)
        const finalResult = propertiesWithImages[0];
        res.status(200).json({
          data: finalResult,
        });
      } else {
        res.status(400).json({
          message: "No Image data found",
        });
      }
    } else {
      res.status(400).json({
        message: "No Property data found",
      });
    }
  } catch (error) {
    res.send("Error from Viewing Property "+ error);
    // console.log(req.body)
    console.log(error);
  }
};
//  ############################# View Property End ############################################################

//  ############################# Get Property Units Start ############################################################
// exports.getpropertyUnits = async (req, res) => {
//   try {
//     const { id } = req.body
//     const propertyUnitsResult = await queryRunner(selectQuery("propertyunits", "propertyID"), [id]);
//     if (propertyUnitsResult.length > 0) {
//       res.status(200).json({
//         data: propertyUnitsResult,
//         message: "property Units"
//       })
//     } else {
//       res.status(400).json({
//         message: "No data found"
//       })
//     }
//   } catch (error) {
//     res.send("Error Get Property Units");
//     console.log(req.body)
//     console.log(error)
//   }
// }
//  ############################# Get Property Units End ############################################################

//  ############################# Update Property Units Start ############################################################
exports.putPropertyUnitsUpdates = async (req, res) => {
  try {
    const { id, propertyId, unitNumber, Area, unitDetails } = req.body;
    // console.log(id, propertyID, unitNumber, Area, unitDetails)
    // let status = "Vacant";
    const propertyUnitsResult = await queryRunner(updatePropertyUnits, [
      unitNumber,
      Area,
      unitDetails,
      // status,
      id,
      propertyId,
    ]);
    if (propertyUnitsResult[0].affectedRows > 0) {
      res.status(200).json({
        data: propertyUnitsResult,
        message: "property Units updated successful",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    console.log(error);
    res.send("Error Get Property Units update");
  }
};
//  ############################# update Property Units End ############################################################

//  #############################  Property Units End Start ############################################################
exports.getPropertyUnitsTenant = async (req, res) => {
  // console.log(req,res)
  try {
    const { userId, userName } = req.user;
    // console.log(userName)
    const getPropertyUnitsTenantResult = await queryRunner(
      selectQuery("property", "landlordID"),
      [userId]
    );
    if (getPropertyUnitsTenantResult[0].length > 0) {
      for (let item of getPropertyUnitsTenantResult[0]) {
        if (item.units > 0) {
          const getPropertyUnitsVacantResult = await queryRunner(
            PropertyUnitsVacant,
            [item.id, "Vacant"]
          );
          const getPropertyUnitsOccupiedResult = await queryRunner(
            selectQuery("propertyunits", "propertyID", "status"),
            [item.id, "Occupied"]
          );

          item.vacantUnits = getPropertyUnitsVacantResult[0];
          item.occupiedUnits = getPropertyUnitsOccupiedResult[0];
        } else {
          item.vacantUnits = [];
          item.occupiedUnits = [];
        }
      }

      res.status(200).json({
        data: getPropertyUnitsTenantResult[0],
        user: userName,
        message: "Get Property Units Tenant",
      });
    } else {
      res.status(200).json({
        message: "No data found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error occurred while getting property units tenant",
    });
  }
};
//  #############################  Property Units End ############################################################

//  ############################# View Property End ############################################################
exports.getpropertyUnits = async (req, res) => {
  try {
    const { propertyId } = req.query;
    // console.log(req.body,req.query,1)
    const property = await queryRunner(selectQuery("property", "id"), [
      propertyId,
    ]);
    const propertyUnitsResult = await queryRunner(
      selectQuery("propertyunits", "propertyID"),
      [propertyId]
    );
    // console.log(propertyUnitsResult)
    if (propertyUnitsResult.length > 0) {
      // propertyUnitsResult.append(property[0][0])
      // console.log(property[0][0].propertyName);
      res.status(200).json({
        data: propertyUnitsResult,
        propertyName: property[0][0]?.propertyName,
        propertyAddress: property[0][0].address,
        message: "property Units",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.send("Error Get Property Units");
    // console.log(req.body);
    console.log(error);
  }
};
//  ############################# Get Property Units End ############################################################

//  ############################# Get Property and tenant data Start ############################################################
exports.getPropertyTenant = async (req, res) => {
  try {
    const { userId } = req.user;

    const getPropertyUnitsTenantResult = await queryRunner(
      selectQuery("property", "landlordID"),
      [userId]
    );

    if (getPropertyUnitsTenantResult[0].length > 0) {
      for (let item of getPropertyUnitsTenantResult[0]) {
        if (item.units > 0) {
          const getPropertyUnitsVacantResult = await queryRunner(
            selectQuery("propertyunits", "propertyID", "status"),
            [item.id, "Vacant"]
          );
          const getPropertyUnitsOccupiedResult = await queryRunner(
            selectQuery("propertyunits", "propertyID", "status"),
            [item.id, "Occupied"]
          );

          item.vacantUnits = getPropertyUnitsVacantResult[0];
          item.occupiedUnits = getPropertyUnitsOccupiedResult[0];
        } else {
          item.vacantUnits = [];
          item.occupiedUnits = [];
        }
      }

      res.status(200).json({
        data: getPropertyUnitsTenantResult[0],
        message: "Get Property Units Tenant",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error occurred while getting property units tenant",
    });
  }
};

//  #############################  Property Units End ############################################################

//  ############################# View Property End ############################################################
exports.getpropertyUnits = async (req, res) => {
  try {
    const { propertyId } = req.query;
    // console.log(req.body,req.query,1)
    const property = await queryRunner(selectQuery("property", "id"), [
      propertyId,
    ]);
    const propertyUnitsResult = await queryRunner(
      selectQuery("propertyunits", "propertyID"),
      [propertyId]
    );
    if (propertyUnitsResult.length > 0) {
      res.status(200).json({
        data: propertyUnitsResult,
        propertyName: property[0][0]?.propertyName,
        propertyAddress: property[0][0].address,
        message: "property Units",
      });
    } else {
      res.status(200).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.send("Error Get Property Units");
    // console.log(req.body);
    console.log(error);
  }
};
//  ############################# Get Property Units End ############################################################

//  ############################# Get Property and tenant data Start ############################################################
exports.viewPropertyTenant = async (req, res) => {
  try {
    const { userId, userName } = req.user;
    const { id } = req.query;
    let PropertyTenantResult;
    PropertyTenantResult = await queryRunner(selectAllTenantsProperty, [id]);
    if (PropertyTenantResult[0].length > 0) {
      for (let i = 0; i < PropertyTenantResult[0].length; i++) {
        const tenantID = PropertyTenantResult[0][i].tenantID;
        const tenantIncreaseResult = await queryRunner(
          selectQuery("tenantincreaserent", "tenantID"),
          [tenantID]
        );
        if (tenantIncreaseResult[0].length > 0) {
          const tenantIncrease = tenantIncreaseResult[0].map((data) => ({
            date: data.date,
            increaseRentAmount: data.increaseRentAmount,
          }));
          PropertyTenantResult[0][i].increaseRentAmount = tenantIncrease;
        } else {
          PropertyTenantResult[0][i].increaseRentAmount = [
            "No tenant Increase",
          ];
        }
      }
      res.status(200).json({
        data: PropertyTenantResult,
        message: "Property Tenant ",
        user: userName,
      });
    } else {
      res.status(200).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.send("Error Get Property Tenant data");
    console.log(error);
  }
};

exports.viewAllPropertyTenant = async (req, res) => {
  try {
    const { userId, userName } = req.user;
    // const { userId, userName } = req.body;
    let PropertyTenantResult;
    // console.log(id)
    PropertyTenantResult = await queryRunner(selectAllTenants, [userId]);
    // console.log(PropertyTenantResult[0]);
    if (PropertyTenantResult[0].length > 0) {
      for (let i = 0; i < PropertyTenantResult[0].length; i++) {
        const tenantID = PropertyTenantResult[0][i].tenantID;
        const tenantIncreaseResult = await queryRunner(
          selectQuery("tenantincreaserent", "tenantID"),
          [tenantID]
        );
        if (tenantIncreaseResult[0].length > 0) {
          const tenantIncrease = tenantIncreaseResult[0].map((data) => ({
            date: data.date,
            increaseRentAmount: data.increaseRentAmount,
          }));
          PropertyTenantResult[0][i].increaseRentAmount = tenantIncrease;
        } else {
          PropertyTenantResult[0][i].increaseRentAmount = [
            "No tenant Increase",
          ];
        }
        // Unread messages is start 
        // const chatCount = 0;
        const chatCountResult = await queryRunner(getMessageCountByID ,[userId, tenantID]);
        // console.log(userId, tenantID);
        if (chatCountResult[0].length > 0) {
          PropertyTenantResult[0][i].messageCount = chatCountResult[0][0];
      }
      // else{
      //   PropertyTenantResult[0][i].messageCount = chatCount;
      // }
      }
      //  ddddd
      res.status(200).json({
        data: PropertyTenantResult,
        message: "Property Tenant ",
        user: userName,
      });
    } else {
      res.status(200).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.send("Error Get Property Tenant data" + error);
    // console.log(error);
  }
};
//  ############################# Get Property and tenant data End ############################################################

//  ############################# Add more property units Start ############################################################
exports.addMoreUnits = async (req, res) => {
  const { propertyID } = req.body;
  const { userId,paidUnits } = req.user;

  try {
    const propertyUnitResult = await queryRunner(insertInPropertyUnits, [
      propertyID,
      "",
      "",
      "",
      "Vacant",
      userId
    ]);
    if (propertyUnitResult[0].affectedRows > 0) {
      const selectaddMoreUnitsResult = await queryRunner(getUnitsCount, [
        propertyID,
      ]);
      if (selectaddMoreUnitsResult[0].length > 0) {
        const unitCount = selectaddMoreUnitsResult[0][0].unitCount;
        const updateaddMoreUnitsResult = await queryRunner(putUnitsUpdate, [
          unitCount,
          propertyID,
        ]);
        const unitCountLandlord = paidUnits + 1;
        const propertyUnitCountResult = await queryRunner(UpdatePropertyUnitCount, [unitCountLandlord,userId]);
        
        if (updateaddMoreUnitsResult[0].affectedRows > 0) {
          res.status(200).json({
            data: unitCount,
            message: "total unit",
          });
        } else {
          res.status(400).json({
            message: "Error occurs in Updating unit in database",
          });
        }
      }
    } else {
      res.status(400).json({
        message: "Unit not inserted",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
  }
};

//  ############################# Add more property units End ############################################################

//  ############################# Delete property units Start ############################################################
exports.deleteMoreUnits = async (req, res) => {
  const { unitID, propertyID } = req.body;
  const { userId,paidUnits } = req.user;
  try {
    // const propertyUnitResult = await queryRunner(insertInPropertyUnits, [propertyID, "", "", "", "Vacant"]);
    const unitDeleteResult = await queryRunner(
      deleteQuery("propertyunits", "id"),
      [unitID]
    );

    if (unitDeleteResult[0].affectedRows > 0) {
      const selectaddMoreUnitsResult = await queryRunner(getUnitsCount, [
        propertyID,
      ]);
      if (selectaddMoreUnitsResult[0].length > 0) {
        const unitCount = selectaddMoreUnitsResult[0][0].unitCount;
        const updateaddMoreUnitsResult = await queryRunner(putUnitsUpdate, [
          unitCount,
          propertyID,
        ]);
        const unitCountLandlord = paidUnits - 1;
        const propertyUnitCountResult = await queryRunner(UpdatePropertyUnitCount, [unitCountLandlord,userId]);
        
        // console.log(updateaddMoreUnitsResult);
        if (updateaddMoreUnitsResult[0].affectedRows > 0) {
          res.status(200).json({
            data: unitCount,
            message: "total unit",
          });
        } else {
          res.status(400).json({
            message: "Error occurs in Updating unit in database",
          });
        }
      }
    } else {
      res.status(400).json({
        message: "Unit not inserted",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
  }
};
//  ############################# Delete property units End ############################################################

//  ############################# Get property States End ############################################################
exports.getStates = async (req, res) => {
  try {
    const statesResult = await queryRunner(selectQuery("propertystates"));
    if (statesResult[0].length > 0) {
      res.status(200).json({
        data: statesResult[0],
        message: "ALL USA STATES",
      });
    } else {
      res.status(400).json({
        message: "No States data found",
      });
    }
  } catch (error) {
    res.send("Error Get states ");
    console.log(error);
  }
};
//  ############################# Get Property States End ############################################################

//  ############################# Task property ############################################################
exports.propertyTask = async (req, res) => {
  const { Id } = req.query;
console.log(Id)
  try {
    const taskByIDResult = await queryRunner(propertyTaskQuery, [Id]);
    if (taskByIDResult[0].length > 0) {
      for (let j = 0; j < taskByIDResult[0].length; j++) {
        const taskID = taskByIDResult[0][j].id;
        const TaskImagesResult = await queryRunner(
          selectQuery("taskimages", "taskID"),
          [taskID]
        );
        // this is for task images
        if (TaskImagesResult[0].length > 0) {
          const taskImages = TaskImagesResult[0].map(
            (image) => image.Image
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
          console.log(vendorResult[0])
          if (vendorResult[0].length > 0) {
            const categoryIDs = vendorResult[0] [0].categoryID;
            const VendorCategoryResult = await queryRunner(
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
      res.status(200).json({
        message: "No property Task data found",
      });
    }
  } catch (error) {
    console.log("Error:", error);
    res.send("Error Get property Task");
}
};

//  ############################# Task property ############################################################

//  ############################# Tenant verify Mail Check Start  ############################################################

exports.verifyMailCheck = async (req, res) => {
  const { email } = req.user;
  console.log(email);
  try {
    const selectTenantResult = await queryRunner(
      selectQuery("users", "Email"),
      [email]
    );
    if (selectTenantResult[0].length > 0) {
      const createdDate = new Date(selectTenantResult[0][0].created_at);
      const newDate = new Date(createdDate.getTime());
      newDate.setDate(newDate.getDate() + 7); // Adding 7 days to the createdDate

      const currentDate = new Date();
      if (selectTenantResult[0][0].userVerified == "Email Verified") {
        res.status(200).json({
          message: "Email is verified",
        });
      } else {
        if (currentDate <= newDate) {
          const differenceInMilliseconds = newDate - currentDate;
          const differenceInDays = Math.ceil(
            differenceInMilliseconds / (1000 * 60 * 60 * 24)
          );

          if (differenceInDays === 0) {
            return res.status(200).json({
              message: `Today is your last day, so kindly verify your email.`,
              date: createdDate,
            });
          } else {
            return res.status(200).json({
              message: `Your remaining days to verify your email: ${differenceInDays}`,
              data: differenceInDays,
              createdDate: createdDate,
              newDate: newDate,
              currentDate: currentDate,
            });
          }
        } else {
          return res.status(200).json({
            message: `Your account is locked due to email verification. Please verify your email.`,
          });
        }
      }
    } else {
      return res.status(400).send("landlord is not found");
    }
  } catch (error) {
    res.send("Error occurred while verifying the landlord's email: " + error);
  }
};

//  ############################# Tenant verify Mail Check END  ############################################################

//  ############################# Email Start ############################################################
exports.emailUpdate = async (req, res) => {
  const { id, email } = req.body;
  try {
    const userCheckResult = await queryRunner(selectQuery("users", "id"), [id]);

    if (userCheckResult[0].length > 0) {
      const emailExist = userCheckResult[0][0].Email;
      // console.log(userCheckResult[0]);
      console.log(emailExist);
      const emailResult = await queryRunner(updateEmailQuery, [
        email,
        emailExist,
      ]);
      if (emailResult[0].affectedRows > 0) {
        return res.status(200).json({
          message: " Email updated successful ",
        });
      } else {
        return res.status(400).send("Error1");
      }
    } else {
      return res.send("User is not found");
    }
  } catch (error) {
    res.send("Error Get Email updated landlord  " + error);
    console.log(error);
  }
};
//  ############################# Email End ############################################################

//  ############################# verify Email Update Start ############################################################
//  ############################# verify Email Update Start ############################################################
exports.verifyEmailUpdate = async (req, res) => {
  const { id, token, email, password } = req.body;
  const status = "Email Verified";
  try {
    const userCheckResult = await queryRunner(selectQuery("users", "id"), [id]);

    if (userCheckResult[0].length > 0) {
      const emailExist = userCheckResult[0][0].Email;
      const existToken = userCheckResult[0][0].token;
      if (token == existToken) {
        const emailResult = await queryRunner(updateVerifiedStatusQuery, [
          status,
          id,
        ]);
        if (emailResult.affectedRows === 0) {
          return res.status(400).send("Email Verified status is not updated");
        } else {
          const id=userCheckResult[0][0].id
          const token = jwt.sign({ email, id }, config.JWT_SECRET_KEY, {
            expiresIn: "3h",
          });

          return res.status(200).json({
            token: token,
            message: " Email verified successful ",
          });
        }
      } else {
        return res.status(200).json({
          message: " token code is not match ",
        });
      }
    } else {
      return res.send("User is not found");
    }
  } catch (error) {
    res.send("Error Get Email Verified updated landlord  " + error);
    console.log(error);
  }
};
//  ############################# verify Email Update End ############################################################
//  ############################# verify Email Update End ############################################################
exports.updatedNotification = async (req, res) => {
  const { isEmailNotify, isPushNotify } = req.body;
  const { userId } = req.user;
  try {
    const updateNotifyResult = await queryRunner(updateNotify, [
      isEmailNotify,
      isPushNotify,
      userId,
    ]);
    if (updateNotifyResult[0].affectedRows > 0) {
      return res.status(200).json({
        email:
          isEmailNotify === "yes"
            ? "Email notifications enabled"
            : "Email notifications disabled",
        push:
          isPushNotify === "yes"
            ? "push notifications enabled"
            : "push notifications disabled",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// get All property data
exports.getAllProperty = async (req, res) => {
  try {
    const { userId } = req.user;
    // const { userId } = req.body;
    const getAllPropertyData = await queryRunner(getPropertyReport, [userId]);
    const getTenantsReport = await queryRunner(getTenantReport, [userId]);
    const getLeaseReportData = await queryRunner(getLeaseReport, [userId]);
    res.status(200).json({
      property: getAllPropertyData[0],
      tenants: getTenantsReport[0],
      lease: getLeaseReportData[0],
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// getLeaseReport getInvoiceReportData getTaskReportData getTenantReport  getPropertyReport

exports.getTaskReportData = async (req, res) => {
  try {
    // const { userId } = req.user;
    const { userId } = req.body;
    const getAllPropertyData = await queryRunner(getTaskReportData, [userId]);
    // console.log(getAllPropertyData);
    res.status(200).json({
      property: getAllPropertyData,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
exports.getInvoiceReportData = async (req, res) => {
  try {
    const { userId } = req.user;
    const getAllPropertyData = await queryRunner(getInvoiceReportData, [
      userId,
    ]);

    res.status(200).json({
      property: getAllPropertyData[0],
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// exports.checkAllTenantsPaid = async (req, res) => {
//   try {
//     const { userId, email } = req.user;
//     const { password } = req.query;
//     console.log(req.query);

//     const selectResult = await queryRunner(selectQuery("users", "Email"), [
//       email,
//     ]);
//     const isMatchPwd = await bcrypt.compare(
//       password,
//       selectResult[0][0].Password
//     );
//     console.log(Boolean());
//     if (isMatchPwd) {
//       // Check if tenant has any unpaid invoices
//       const tenantAllPaidInvoiceResult = await queryRunner(
//         checkMyAllTenantsInvoicePaidQuery,
//         [userId]
//       );
//       const tenantData = await queryRunner(getAllTenantsQuery, [userId]);
//       // console.log(tenantData[0]);
//       // No un-paid invoices found, update tenant account
//       if (tenantAllPaidInvoiceResult[0].length === 0) {
//         const tenantAllPaid = await queryRunner(updateUserAccountQuery, [
//           0,
//           userId,
//         ]);
//         await queryRunner(updateAllTenantsAccountQuery, [0, userId]);
//         const mailSubject = "Your account has been deactivated";
//         for (let i = 0; i < tenantData[0].length; i++) {
//           // console.log(tenantData[i].emai);
//           await sendMail(
//             tenantData[0][i].email,
//             mailSubject,
//             "as",
//             `${tenantData[0][i].firstName} ${tenantData[0][i].lastName}`
//           );
//         }
//         if (tenantAllPaid[0].affectedRows > 0) {
//           res.status(200).json({
//             message: "Tenant has paid invoices",
//           });
//         }
//       } else {
//         res.status(200).json({
//           message: "Tenant has unpaid invoices",
//         });
//       }
//     } else {
//       res.status(400).json({
//         message: "Password is incorrect",
//       });
//     }
//   } catch (error) {
//     res.status(400).json({
//       message: error.message,
//     });
//   }
// };
exports.checkAllTenantsPaid = async (req, res) => {
  try {
    const { userId, email } = req.user;
    const { password } = req.query;
    // console.log(req.query);

    const selectResult = await queryRunner(selectQuery("users", "Email"), [
      email,
    ]);
    const isMatchPwd = await bcrypt.compare(
      password,
      selectResult[0][0].Password
    );
    if (isMatchPwd) {
      console.log(isMatchPwd);
      // Check if tenant has any unpaid invoices
      const tenantAllPaidInvoiceResult = await queryRunner(
        checkMyAllTenantsInvoicePaidQuery,
        [userId]
      );
      const tenantData = await queryRunner(getAllTenantsQuery, [userId]);
      // console.log(tenantData[0]);
      // No un-paid invoices found, update tenant account
      if (tenantAllPaidInvoiceResult[0].length === 0) {
        const tenantAllPaid = await queryRunner(updateUserAccountQuery, [
          0,
          userId,
        ]);
        await queryRunner(updateAllTenantsAccountQuery, [0, userId]);
        const mailSubject = "Your account has been deactivated";
        for (let i = 0; i < tenantData[0].length; i++) {
          // console.log(tenantData[i].emai);
          await sendMail(
            tenantData[0][i].email,
            mailSubject,
            "as",
            `${tenantData[0][i].firstName} ${tenantData[0][i].lastName}`
          );
        }
        // deleteUserAccountData
        await queryRunner(deleteUserAccountData.task, [userId]);//
        await queryRunner(deleteUserAccountData.invoice, [userId]);  //
        await queryRunner(deleteUserAccountData.tenants, [userId]);   //
        await queryRunner(deleteUserAccountData.deletePropertyImages, [userId]); //
        await queryRunner(deleteUserAccountData.deletePropertyUnits, [userId]); //
        await queryRunner(deleteUserAccountData.deleteUserData, [userId]);  //
        await queryRunner(deleteUserAccountData.property, [userId]);  //

      
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
    } else {
      res.status(400).json({
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getPropertyDashboardData = async (req, res) => {
  try {
    const { userId } = req.user;
    const { start, end } = req.params;
    const getAllPropertyData = await queryRunner(getPropertiesGraphData, [
      userId,
      start,
      end,
    ]);
    res.status(200).json({
      property: getAllPropertyData[0],
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
exports.getTaskDashboardData = async (req, res) => {
  try {
    const { userId } = req.user;
    const { start, end, propertyId } = req.params;

    if (propertyId) {
      const getAllTaskData = await queryRunner(getTaskGraphDataByPropertyId, [
        propertyId,
        userId,
        start,
        end,
      ]);
      res.status(200).json({
        property: getAllTaskData[0],
      });
    } else {
      const getAllTaskData = await queryRunner(getTaskGraphData, [
        userId,
        start,
        end,
      ]);
      res.status(200).json({
        property: getAllTaskData[0],
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
exports.getInvoiceDashboardData = async (req, res) => {
  try {
    const { userId } = req.user;
    const { start, end, propertyId } = req.params;
    if (propertyId) {
      console.log(propertyId);
      const getAllInvoiceData = await queryRunner(
        getInvoiceGraphDataByPropertyId,
        [propertyId, userId, start, end]
      );
      res.status(200).json(getAllInvoiceData[0]);
    } else {
      const getAllInvoiceData = await queryRunner(getInvoiceGraphData, [
        userId,
        start,
        end,
      ]);
      res.status(200).json(getAllInvoiceData[0]);
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
exports.getDashboardData = async (req, res) => {
  try {
    const { userId } = req.user;
    console.log(userId);
    const totalAmount = await queryRunner(getTotalAmount, [userId]);
    const totalAmountUnpaid = await queryRunner(getTotalAmountUnpaid, [userId]);
    const totalAmountPaid = await queryRunner(getTotalAmountPaid, [userId]);
    const numPropertyTenant = await queryRunner(getNumPropertyTenant, [
      userId,
      userId,
    ]);
    res.status(200).json({
      totalAmount: totalAmount[0][0],
      totalAmountUnpaid: totalAmountUnpaid[0][0],
      totalAmountPaid: totalAmountPaid[0][0],
      numPropertyTenant: numPropertyTenant[0][0],
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// inactive user
exports.inactiveUser = async (req, res) => {
  try {
    const { email } = req.user;
    const inactiveUserResult = await queryRunner(updateUserActive, [0, email]);
    // if (inactiveUserResult[0].affectedRows > 0) {
    res.status(200).json({
      message: "User is inactive",
    });
    // }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
exports.inactiveTenant = async (req, res) => {
  try {
    const { email } = req.user;
    const inactiveUserResult = await queryRunner(updateTenantActive, [
      0,
      email,
    ]);
    // if (inactiveUserResult[0].affectedRows > 0) {
    res.status(200).json({
      message: "User is inactive",
    });
    // }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// getUserById
exports.getUserByIdData = async (req, res) => {
  try {
    const { id, type } = req.params;
    console.log(id, type);
    if (type === "tenant") {
      const getUserByIdResult = await queryRunner(getTenantById, [id]);
      res.status(200).json({
        data: getUserByIdResult[0][0],
      });
    } else if (type === "landlord") {
      const getUserByIdResult = await queryRunner(getUserById, [id]);
      res.status(200).json({
        data: getUserByIdResult[0][0],
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// Profile Complete
exports.ProfileComplete = async (req, res) => {
  try {
    const { userId } = req.user;
    const propertycheckresult = await queryRunner(selectQuery("users", "id"), [
      userId,
    ]);
    if (propertycheckresult[0].length > 0) {
      count = 0;
      if (propertycheckresult[0][0].image) {
        count += 10;
      }
      if (propertycheckresult[0][0].FirstName) {
        count += 5;
      }
      if (propertycheckresult[0][0].LastName) {
        count += 5;
      }
      if (propertycheckresult[0][0].Email) {
        count += 10;
      }
      if (propertycheckresult[0][0].Phone) {
        count += 10;
      }
      if (propertycheckresult[0][0].BusinessName) {
        count += 10;
      }
      if (propertycheckresult[0][0].streetAddress) {
        count += 10;
      }

      if (propertycheckresult[0][0].PACity) {
        count += 5;
      }
      if (propertycheckresult[0][0].PAState) {
        count += 5;
      }
      if (propertycheckresult[0][0].PAZipcode) {
        count += 5;
      }
      if (propertycheckresult[0][0].BACity) {
        count += 5;
      }
      if (propertycheckresult[0][0].BAState) {
        count += 5;
      }
      if (propertycheckresult[0][0].BAZipcode) {
        count += 5;
      }
      
      if (propertycheckresult[0][0].BusinessAddress) {
        count += 10;
      }
      res.status(200).json({
        // data : propertycheckresult,
        count: count,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.filterOutDashbordDataByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const getAllPropertyData = await queryRunner(getPropertyDashboardData, [
      propertyId,
    ]);
    res.status(200).json({
      property: getAllPropertyData[0],
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// check property etc
exports.checkSystem = async (req, res) => {
  try {
    // const { userId } = req.user;
    const { userId } = req.body;
    // Property
    const propertycheckresult = await queryRunner(
      selectQuery("property", "landlordID"),
      [userId]
    );
    if (propertycheckresult[0].length > 0) {
      property = "true";
    } else {
      property = "false";
    }
    // Tenant
    const tenantcheckresult = await queryRunner(
      selectQuery("tenants", "landlordID"),
      [userId]
    );
    if (tenantcheckresult[0].length > 0) {
      tenant = "true";
    } else {
      tenant = "false";
    }

    //Invoice
    const invoicecheckresult = await queryRunner(
      selectQuery("invoice", "landlordID"),
      [userId]
    );
    if (invoicecheckresult[0].length > 0) {
      invoice = "true";
    } else {
      invoice = "false";
    }

    //Task
    const taskcheckresult = await queryRunner(
      selectQuery("task", "landlordID"),
      [userId]
    );
    if (taskcheckresult[0].length > 0) {
      task = "true";
    } else {
      task = "false";
    }

    //vendors
    const vendorscheckresult = await queryRunner(
      selectQuery("vendor", "LandlordID"),
      [userId]
    );
    if (vendorscheckresult[0].length > 0) {
      vendors = "true";
    } else {
      vendors = "false";
    }
    res.status(200).json({
      property: property,
      tenant: tenant,
      invoice: invoice,
      task: task,
      vendors: vendors,
      // data : propertycheckresult,
    });
    // }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.filterOutDashbordDataByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const getAllPropertyData = await queryRunner(getPropertyDashboardData, [
      propertyId,
    ]);
    res.status(200).json({
      property: getAllPropertyData[0],
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
exports.updateAuth = async (req, res) => {
  try {
    const { auth } = req.body;
    const {userId} = req.user
    const updateAuth= await queryRunner(updateAuthQuery, [auth,userId]);
    if(updateAuth[0].affectedRows>0){
      res.status(200).json({message:`2 Factor Authentication ${auth==0?"turned off":"turned on"}`})
    }else{
      res.status(400).json({message:"Error in updating 2 Factor Authentication"})
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: error.message,
    });
  }
};


exports.deleteUser=async(req,res)=>{
  const {userId}=req.body;
  try {
    const deleteUserResult=await queryRunner(deleteQuery("users","id"),[userId]);
    if(deleteUserResult[0].affectedRows>0){
      res.status(200).json({message:"User Deleted"})
    }else{
      res.status(400).json({message:"Error in deleting user"})
    }
  }catch{

  }
}


exports.UpdateUserNuveiId = async(req,res)=>{
  const {userId, nuveiId}=req.body;
  
  try {
    const updateUserResult=await queryRunner(UpdateUserNuveiIdQuery,[nuveiId, userId]);
    if(updateUserResult[0].affectedRows > 0){
      res.status(200).json({message:"User updated"})
    }else{
      res.status(400).json({message:"Error in update user"})
    }
  }catch(error){
    console.log(error);
    res.status(400).send(error.message);

  }
}