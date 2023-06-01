const user = require("../models/user");
const sendMail = require('../sendmail/sendmail.js');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const fs = require('fs');
const Path = require('path');
const imageToDelete = require('./../middleware/deleteImage.js')
const { serialize } = require('cookie');
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
  insertTenantAttachFile
} = require("../constants/queries");
const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const { file } = require("googleapis/build/src/apis/file");
const config = process.env;





  
  
          //  ############################# Create tenants Start ############################################################
          exports.createTenants = async (req, res) => {
            try {
              const {
                landlordID,
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
                increaseRentData
              } = req.body 
              const tenantsCheck = await queryRunner(selectQuery("tenants", "email"), [email]);
              if (tenantsCheck[0].length > 0) {
                // res.send("email found");
                // const tenantsInsert = await queryRunner(UpdateTenants, [landlordID, firstName, lastName, companyName, email, phoneNumber, address, city, state, zipcode, propertyID, propertyUnitID, rentAmount, gross_or_triple_lease, baseRent, tripleNet, leaseStartDate, leaseEndDate, increaseRent, tenantPassword]);
                // if (tenantsInsert[0].affectedRows > 0) {
                //   res.status(200).json({
                //     message: "Tenants Updated Successful",
                //     data: tenantsInsert[0]
                //   })
          
                // } else {
                //   res.status(400).json({
                //     message: "email found but never change something"
                //   })
                // }
                res.status(400).json({
                  message: `Tenants Already exist on this email ${email} `,
                })
              } else {
                currentDate = new Date();
                const ran = Math.floor(100000 + Math.random() * 900000);
                    const tenantPassword = "Spade" + ran;
              const hashPassword = await hashedPassword(tenantPassword);
          
                const tenantsInsert = await queryRunner(insertTenants, [landlordID, firstName, lastName, companyName, email, phoneNumber, address, city, state, zipcode, propertyID, propertyUnitID, rentAmount, gross_or_triple_lease, baseRent, tripleNet, leaseStartDate, leaseEndDate, increaseRent, hashPassword, currentDate]);
                if (tenantsInsert[0].affectedRows > 0) {
                    // update property unit
                    const status = "Occupied";
                    const propertyUnitsResult = await queryRunner(updatePropertyUnitsTenant, [ status, propertyUnitID, propertyID ]);
                    if (propertyUnitsResult[0].affectedRows > 0) {
                      // insert increase rent amount Start
                      if(increaseRent == 'No'){
                        res.status(200).json({
                            message: "Tenants save Successful",
                            data: tenantsInsert[0]
                          })
                    }
                    else{
                        const tenantID = tenantsInsert[0].insertId; 
                          for(let i=0; i < increaseRentData.length; i++ ){
                            const propertyID = increaseRentData[i].propertyID;
                            const increaseDate = increaseRentData[i].increaseDate;
                            const increaseRentAmount = increaseRentData[i].increaseRentAmount;
                            const increaseRentDataResult = await queryRunner(insertincreaseRentData, [tenantID, propertyID, increaseDate, increaseRentAmount])
                            
                          }

                          res.status(200).json({
                            message: " tenant created successful"
                          });
 
                    }
                      // insert increase rent amount END

                    } else {
                      res.status(400).json({
                        message: "Error occur in update tenant property unit"
                      })
                    } 
                    

                } else {
                  res.status(400).json({
                    message: "data not save"
                  })
                }
              }
            }
            catch (error) {
              res.send("Error occurs in creating Tenants  " + error)
            }
          }
                //  ############################# Create tenants END ############################################################
          
          
                //  ############################# tenant email send Start  ############################################################
          
                exports.sendInvitationLink = async (req, res) => {
                  const { tenantID } = req.body;
                  try {
                    const selectTenantResult = await queryRunner(selectQuery("tenants", "id"), [tenantID])
              if (selectTenantResult[0].length > 0) {
          
                const name = selectTenantResult[0][0].firstName; 
                const email = selectTenantResult[0][0].email; 
                const currentDate = new Date();
                const ran = Math.floor(100000 + Math.random() * 900000);
                const tenantPassword = "Spade" + ran;
          const hashPassword = await hashedPassword(tenantPassword); 
                          const mailSubject = "Spade Welcome Email";
           
          
          const tenantsInsert = await queryRunner(UpdateTenants, [hashPassword, currentDate, tenantID]);
                if (tenantsInsert[0].affectedRows > 0) {
                  await sendMail(email, mailSubject, tenantPassword, name); 
                  // console.log(tenantPassword);
                  res.status(200).json({
                    message: "Tenants Welcome email send Successful",
                    data: tenantsInsert[0]
                  })
          
                } else {
                  res.status(400).json({
                    message: "welcome email not sent to tenant "
                  })
                }
              }else{
                return res.status(400).send('Tenant is not exists');
              }
          
                    // res.send("Email sent successfully"); // Sending success response
                  } catch (error) {
                    res.send("Error occurs in Sending Tenants welcome email " + error); // Sending error response
                  }
                };
                    
                //  ############################# tenant email send END  ############################################################
           
                //  ############################# Tenant verify Mail Check Start  ############################################################
          
                exports.verifyMailCheck = async (req, res) => {
                  const { landlordID, email } = req.body;
                  try {
                    const selectTenantResult = await queryRunner(selectQuery("users", "id"), [landlordID])
              if (selectTenantResult[0].length > 0) {
          
                const createdDate = selectTenantResult[0][0].created_at; 
                // const createdDate = new Date('2023-05-27 15:34:32');
                const currentDate = new Date();
                const differenceInMilliseconds = currentDate - createdDate;
                const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
                const differenceInMinutes = Math.floor(differenceInSeconds / 60);
                const differenceInHours = Math.floor(differenceInMinutes / 60);
                const differenceInDays = Math.floor(differenceInHours / 24);
                if(differenceInDays > 0){
                  return res.status(200).json({
                    message : `Your remaining days is ${differenceInDays} please verify your email otherwise your account will locked after ${differenceInDays} days`
                  });
                }else if(differenceInDays == 0){
                  return res.status(200).json({
                    
                    message : `Today is your last day so Kindly verify your email otherwise your account will locked on tomorrow`
                  });
                }else{
                  return res.status(200).json({
                    remainingDays : `Your account is locked due to email verification firstly verify your email`
                  });
                }
           
              }else{
                return res.status(400).send('landlord is not exists');
              }
          
                    // res.send("Email sent successfully"); // Sending success response
                  } catch (error) {
                    res.send("Error occurs in verifying the landlord email " + error); // Sending error response
                  }
                };
                    
                //  ############################# Tenant verify Mail Check END  ############################################################
                
          //  ############################# Tenant Reset Email ############################################################
          exports.createResetEmailTenant = async (req, res) => {
            const { email } = req.body;
            // console.log(email);
            const mailSubject = "Spade Reset Email";
            const random = Math.floor(100000 + Math.random() * 900000)
            try {
              const selectResult = await queryRunner(selectQuery('tenants', "Email"), [email]);
              // console.log(selectResult[0])
              if (selectResult[0].length > 0) {
                const userid = selectResult[0][0].id;
                const name = selectResult[0][0].FirstName + " " + selectResult[0][0].LastName
                // console.log(updateResult);
                console.log(userid);
                sendMail(email, mailSubject, random, name);
                const now = new Date();
                const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
                const updateResult = await queryRunner(addResetTokenTenants, [random, formattedDate, userid]);
                if (updateResult[0].affectedRows === 0) {
                  res.status(400).send("Error")
                }
                else {
                  res.status(200).json({ "message": "Sended", "id": userid })
                }
              }
              else if (selectResult[0].length === 0) {
                res.status(400).send("Email not found");
              }
            } catch (error) {
              res.status(400).send("Error");
          
            }
          
          };
          //  ############################# Tenant Reset Email ############################################################
          
          
          
          
          
          
          
          
          //  ############################# Tenant Verify Reset Email Code ############################################################
          exports.verifyResetEmailCodeTenant = async (req, res) => {
            const { id, token } = req.body;
            // console.log(req.body)
            try {
              const selectResult = await queryRunner(selectQuery('tenants', 'id', 'token'), [id, token]);
              if (selectResult[0].length > 0) {
                const now = new Date(selectResult[0][0].tenantUpdated_at);
                const now2 = new Date();
                const formattedDate = now2.toISOString().slice(0, 19).replace('T', ' ');
                const time = new Date(formattedDate) - now;
                const time2 = time / 1000;
                if (time2 >= 120) {
                  res.status(408).send("Time out");
                } else {
                  res.status(200).json({
                    message: "Successful",
                    id: id,
                    token: token
                  });
                }
              }
              else {
                res.status(404).json({
                  message: "Cannot Validate!!!"
                });
              }
            } catch (error) {
              res.status(400).send("Error")
            }
          }
          //  ############################# Tenant Verify Reset Email Code ############################################################
          
          
          
          
          //  ############################# Tenant Update Password ############################################################
          exports.updatePasswordTenant = async (req, res) => {
            const { id, password, confirmpassword, token } = req.body;
            try {
              if (password === confirmpassword) {
                const now = new Date(); 
                const hashPassword = await hashedPassword(password)
                const selectResult = await queryRunner(updatePasswordTenant, [hashPassword, now, id, token]);
                if (selectResult[0].affectedRows > 0) {
                  res.status(200).json({
                    message: "Successful password saved"
                  });
                } else {
                  res.status(500).send('Error');
                }
              } else {
                res.status(201).send("Password Does not match ")
              }
            } catch (error) {
              console.log(error)
              res.status(400).send("Error")
            }
          }
          //  ############################# Tenant Update Password ############################################################


          //  ############################# Add Alternate Email and Phone Start ############################################################
          exports.addAlternateEmailPhone = async (req, res) => {
            const { tenantID, alternatePhone, alternateEmail } = req.body;
          
            try {
                let phoneExist = false;
                let emailExist = false;
            //   if (alternatePhone && alternateEmail && alternatePhone.length > 0 && alternateEmail.length > 0) {
              const selectalternatePhoneResult = await queryRunner(selectQuery('tenantalternatephone', 'tenantID'), [tenantID]); 
              if(selectalternatePhoneResult[0].length > 0){
                phoneExist = true;
              }else{
                    for (let i = 0; i < alternatePhone.length; i++) {
                  const phoneName = alternatePhone[i].phoneName;
                  const phoneNumber = alternatePhone[i].phoneNumber;
                  const alternatePhoneDataResult = await queryRunner(insertAlternatePhoneData, [tenantID, phoneName, phoneNumber]);
                }
              } 
              const selectalternateEmailResult = await queryRunner(selectQuery('tenantalternateemail', 'tenantID'), [tenantID]); 
              if(selectalternateEmailResult[0].length > 0){
                emailExist = true;
              }else{
                          for (let i = 0; i < alternateEmail.length; i++) {
                    const emailName = alternateEmail[i].emailName;
                    const email = alternateEmail[i].email; 
                    const alternateEmailDataResult = await queryRunner(insertAlternateEmailData, [tenantID, emailName, email]);
                  }
              }
              if(phoneExist == true && emailExist == true){
                res.status(200).json({
                  message: "Email and number already exist"
                });
              } else if(phoneExist == false && emailExist == true){
                res.status(200).json({
                    message: "Phone number successfully save email already already exist"
                  });
              } else if(phoneExist == true && emailExist ==false ){
                res.status(200).json({
                    message: " Email successfully save Phone number already already exist"
                  });
              }else{
                res.status(200).json({
                    message: " Email and phone number successfully save "
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
  const {
    tenantID
  } = req.body;
  const { userId } = req.user
  try {

        const fileNames = req.files.map((file) => file.filename);
        for (let i = 0; i < fileNames.length; i++) {
          const attachFile = fileNames[i];
          const tenantAttachFileResult = await queryRunner(insertTenantAttachFile, [userId, tenantID,attachFile])
          if (tenantAttachFileResult.affectedRows === 0) {
            res.send('Error');
            return;
          }
        } //sss
 
        res.status(200).json({
          message: " Tenant Files save successful"
        });
  }
  catch (error) {
    res.status(400).send("Error4");
    console.log(error);
  }
}
 
          //  ############################# Add Tenant Attach File End ############################################################
          
          


//  ############################# Delete Tenant Attach File Start ############################################################
exports.tenantAttachFileDelete = async (req, res) => {
  try {
    const { id,userId } = req.body
  // const { userId } = req.user 
    const attachFileResult = await queryRunner(selectQuery('tenantattachfiles', 'id'), [id]);
    if (attachFileResult[0].length > 0) {
      const file = attachFileResult[0][0].fileName;
          // delete folder images Start
      imageToDelete([file]);
      // delete folder images End
 const PropertyDeleteResult = await queryRunner(deleteQuery("tenantattachfiles", "id", "landlordID"), [id, userId]);
    if (PropertyDeleteResult[0].affectedRows > 0) {
      res.status(200).json({
        data: file,
        message: " Tenant Files deleted successful"
      });
    } else {
      res.status(400).json({
        message: "No data found"
      })
    }
    }
  } catch (error) {
    res.send("Error from delete Property ");
    console.log(error)
  }
}
//  ############################# Delete Tenant Attach File End ############################################################
