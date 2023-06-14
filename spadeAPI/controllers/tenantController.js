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
  insertTenantAttachFile,
  updateUnitsTenant,
  getTenantsById,
  updateTenants
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
      increaseRentData
    } = req.body
    const { userId } = req.user
    // console.log(req.body)
    const tenantsCheck = await queryRunner(selectQuery("tenants", "email"), [email]);
    if (tenantsCheck[0].length > 0) {

      res.status(400).json({
        message: `Tenants Already exist on this email ${email} `,
      })
    } else {
      currentDate = new Date();
      const ran = Math.floor(100000 + Math.random() * 900000);
      const tenantPassword = "Spade" + ran;
      const hashPassword = await hashedPassword(tenantPassword);

      const tenantsInsert = await queryRunner(insertTenants, [userId, firstName, lastName, companyName, email, phoneNumber, address, city, state, zipcode, propertyID, propertyUnitID, rentAmount, gross_or_triple_lease, baseRent, tripleNet, leaseStartDate, leaseEndDate, increaseRent, hashPassword, currentDate]);
      if (tenantsInsert[0].affectedRows > 0) {
        const status = "Occupied";
        const propertyUnitsResult = await queryRunner(updatePropertyUnitsTenant, [status, propertyUnitID, propertyID]);
        if (propertyUnitsResult[0].affectedRows > 0) {
          if (increaseRent == 'No') {
            res.status(200).json({
              message: "Tenants save Successful",
              data: tenantsInsert[0],
              tenantId: tenantsInsert[0].insertId
            })
          }
          else {
            const tenantID = tenantsInsert[0].insertId;
            if (increaseRentData.length >= 1 && increaseRentData[0].date !== "") {
              for (let i = 0; i < increaseRentData.length; i++) {

                const increaseDate = increaseRentData[i].date;
                const increaseRentAmount = increaseRentData[i].amount;
                // console.log(increaseDate,increaseRentAmount,propertyID)
                const increaseRentDataResult = await queryRunner(insertincreaseRentData, [tenantID, propertyID, increaseDate, increaseRentAmount])


              }
            }

            res.status(200).json({
              message: " tenant created successful",
              data: tenantsInsert[0],
              tenantId: tenantsInsert[0].insertId
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
    console.log(error)
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
        await sendMail.sendMail(email, mailSubject, tenantPassword, name);
        res.status(200).json({
          message: "Tenants Welcome email send Successful",
          data: tenantsInsert[0]
        })

      } else {
        res.status(400).json({
          message: "welcome email not sent to tenant "
        })
      }
    } else {
      return res.status(400).send('Tenant is not exists');
    }

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
      if (differenceInDays > 0) {
        return res.status(200).json({
          message: `Your remaining days is ${differenceInDays} please verify your email otherwise your account will locked after ${differenceInDays} days`
        });
      } else if (differenceInDays == 0) {
        return res.status(200).json({

          message: `Today is your last day so Kindly verify your email otherwise your account will locked on tomorrow`
        });
      } else {
        return res.status(200).json({
          remainingDays: `Your account is locked due to email verification firstly verify your email`
        });
      }

    } else {
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
  const { email } = req.query;
  const mailSubject = "Spade Reset Email";
  const random = Math.floor(100000 + Math.random() * 900000)
  try {
    const selectResult = await queryRunner(selectQuery('tenants', "Email"), [email]);
    if (selectResult[0].length > 0) {
      const userid = selectResult[0][0].id;
      const name = selectResult[0][0].firstName + " " + selectResult[0][0].lastName
      sendMail.sendMail(email, mailSubject, random, name);
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



//  ############################# resend Code ############################################################
exports.resendCodeTenants = async (req, res) => {
  const { id } = req.body
  const mailSubject = 'Spade Reset Email'
  const random = Math.floor(100000 + Math.random() * 900000)
  try {
    const selectResult = await queryRunner(selectQuery('tenants', 'id'), [id])
    if (selectResult[0].length > 0) {
      const userid = selectResult[0][0].id
      const name =
        selectResult[0][0].firstName + ' ' + selectResult[0][0].lastName
      sendMail.sendMail(selectResult[0][0].email, mailSubject, random, name)
      const now = new Date()
      const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ')
      const updateResult = await queryRunner(addResetTokenTenants, [
        random,
        formattedDate,
        userid
      ])
      if (updateResult[0].affectedRows === 0) {
        res.status(400).send('Error')
      } else {
        res.status(200).json({ message: 'Sended' })
      }
    }
  } catch (error) {
    res.status(400).send('Error')
    console.log(error)
  }
}
//  ############################# resend Code ############################################################





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
    if (selectalternatePhoneResult[0].length > 0) {
      phoneExist = false;
    } else {
      for (let i = 0; i < alternatePhone.length; i++) {
        const phoneName = alternatePhone[i].phoneName;
        const phoneNumber = alternatePhone[i].phoneNumber;
        const alternatePhoneDataResult = await queryRunner(insertAlternatePhoneData, [tenantID, phoneName, phoneNumber]);
      }
    }
    const selectalternateEmailResult = await queryRunner(selectQuery('tenantalternateemail', 'tenantID'), [tenantID]);
    if (selectalternateEmailResult[0].length > 0) {
      emailExist = true;
    } else {
      for (let i = 0; i < alternateEmail.length; i++) {
        const emailName = alternateEmail[i].emailName;
        const email = alternateEmail[i].email;
        const alternateEmailDataResult = await queryRunner(insertAlternateEmailData, [tenantID, emailName, email]);
      }
    }
    if (phoneExist == true && emailExist == true) {
      res.status(200).json({
        message: "Email and number already exist"
      });
    } else if (phoneExist == false && emailExist == true) {
      res.status(200).json({
        message: "Phone number successfully save email already already exist"
      });
    } else if (phoneExist == true && emailExist == false) {
      res.status(200).json({
        message: " Email successfully save Phone number already already exist"
      });
    } else {
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
  // console.log(req.files)
  const { userId } = req.user
  try {

    const fileNames = req.files.map((file) => file.filename);
    for (let i = 0; i < fileNames.length; i++) {
      const attachFile = fileNames[i];
      const tenantAttachFileResult = await queryRunner(insertTenantAttachFile, [userId, tenantID, attachFile])
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
    const { id } = req.body
    // const { id,userId } = req.body
    const { userId } = req.user
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


//  ############################# Delete Tenant Start ############################################################
exports.tenantDelete = async (req, res) => {
  try {
    const { tenantID } = req.body
    const tenantResult = await queryRunner(selectQuery("tenants", "id"), [tenantID]);
    console.log(tenantResult[0][0])
    const propertyUnitID = tenantResult[0][0].propertyUnitID;
    const tenantDeleteResult = await queryRunner(deleteQuery("tenants", "id"), [tenantID]);
    console.log(tenantDeleteResult[0])
    if (tenantDeleteResult[0].affectedRows > 0) {

      const tenantCheckResult = await queryRunner(selectQuery("tenantattachfiles", "tenantID"), [tenantID]);
      console.log(tenantCheckResult)
      if (tenantCheckResult[0].length > 0) {
        tenantimages = tenantCheckResult[0].map((image) => image.fileName);
        // delete folder images
        imageToDelete(tenantimages);
        const tenantFileDeleteresult = await queryRunner(deleteQuery("tenantattachfiles", "tenantID"), [tenantID]);
        // console.log(tenantFileDeleteresult
      }
      const tenantAdditionalEmailresult = await queryRunner(deleteQuery("tenantalternateemail", "tenantID"), [tenantID]);
      if (tenantAdditionalEmailresult[0].affectedRows > 0) {
        const tenantAdditionalPhoneResult = await queryRunner(deleteQuery("tenantalternatephone", "tenantID"), [tenantID]);
        if (tenantAdditionalPhoneResult[0].affectedRows > 0) {
          const tenantIncreaseRentResult = await queryRunner(deleteQuery("tenantincreaserent", "tenantID"), [tenantID]);


          if (tenantIncreaseRentResult[0].affectedRows > 0) {
            //dddddd
            const status = "Vacant";
            const propertyUnitsResult = await queryRunner(updateUnitsTenant, [status, propertyUnitID]);


            if (propertyUnitsResult[0].affectedRows > 0) {

              res.status(200).json({
                message: " tenant deleted successfully"
              })
            } else {
              // " tenant Error occur in increase rent "
              res.status(200).json({
                message: " tenant Error occur in updating property units "
              })
            }
          } else {
            // " tenant Error occur in increase rent "
            res.status(200).json({
              message: " tenant Error occur in delete increase rent "
            })
          }
          // }

        } else {
          res.status(200).json({
            message: " tenant Error occur in delete alternate phone "
          })
        }


      } else {
        res.status(200).json({
          message: " tenant Error occur in delete alternate email "
        })
      }

    } else { // tenantCheckResult
      res.status(200).json({
        message: "No tenant file data found "
      })
    }

  }
 catch (error) {
  console.log(error)
  res.send("Error from delete tenants ");
  // console.log(req.body)
  
}
}
//  ############################# Delete Tenant End ############################################################


//  ############################# Get tenant ByID Start ############################################################
exports.getTenantsByID = async (req, res) => {
  try {
    const { id } = req.query;
    const TenantsByIDResult = await queryRunner(getTenantsById, [id])
    if (TenantsByIDResult.length > 0) {
      const data = JSON.parse(JSON.stringify(TenantsByIDResult))
      res.status(200).json({
        data: data,
        message: 'Tenants By ID'
      })
    } else {
      res.status(400).json({
        message: 'No data found'
      })
    }
  } catch (error) {
    res.send('Error Get Tenants By ID')
    console.log(error)
  }
}
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
      increaseRentData
    } = req.body
    // const {userId}=req.user
    const tenantcheckresult = await queryRunner( selectQuery("tenants", "id"), [tenantID] ); 
    if(tenantcheckresult[0].length > 0){
      const checkpropertyUnitID = tenantcheckresult[0][0].propertyUnitID;
      const checkpropertyID = tenantcheckresult[0][0].propertyID;
      const checkincreaseRent = tenantcheckresult[0][0].increaseRent;
      if(checkpropertyUnitID !== propertyUnitID){
        const status = "Vacant";
        const propertyUnitsResult = await queryRunner(updatePropertyUnitsTenant, [ status, checkpropertyUnitID, checkpropertyID ]);  
      }
      if(checkincreaseRent !== increaseRent){
        const lineItemDelete = await queryRunner(deleteQuery("tenantincreaserent", "tenantID"), [tenantID]);  
      }
      currentDate = new Date();
      const ran = Math.floor(100000 + Math.random() * 900000);
      const tenantsInsert = await queryRunner(updateTenants, [firstName, lastName, companyName, email, phoneNumber, address, city, state, zipcode, propertyID, propertyUnitID, rentAmount, gross_or_triple_lease, baseRent, tripleNet, leaseStartDate, leaseEndDate, increaseRent, currentDate, tenantID]);
      if (tenantsInsert[0].affectedRows > 0) {
        
          const status = "Occupied";
          const propertyUnitsResult = await queryRunner(updatePropertyUnitsTenant, [ status, propertyUnitID, propertyID ]);
          console.log("11");
          console.log(propertyUnitsResult);
          if (propertyUnitsResult[0].affectedRows > 0) {
            if(increaseRent == 'No'){
              res.status(200).json({
                  message: "Tenants save Successful",
                  data: tenantsInsert[0],
                  tenantId:tenantsInsert[0].insertId
                })
          }
          else{
              // const tenantID = tenantsInsert[0].insertId;
              if(increaseRentData.length>=1 && increaseRentData[0].date!==""){
                for(let i=0; i < increaseRentData.length; i++ ){
                  
                  const increaseDate = increaseRentData[i].date;
                  const increaseRentAmount = increaseRentData[i].amount;
                  const increaseRentDataResult = await queryRunner(insertincreaseRentData, [tenantID, propertyID, increaseDate, increaseRentAmount])
                }
              }
                res.status(200).json({
                  message: " tenant Updated successful",
                  data: tenantsInsert[0],
                  tenantId:tenantsInsert[0].insertId
                });

          }
            // insert increase rent amount END

          } else {
            res.status(400).json({

              message: "Error occur in update tenant property unit"
            })
          } 


        }else{
          res.status(200).json({
            message: "Tenants is not found",
          })
        }
          
          

      } else {
        res.status(400).json({
          message: "tenant not Updated"
        })
      }
    // }
  }
  catch (error) {
    console.log(error)
    res.send("Error occurs in updating Tenants  " + error)
  }
}
      //  ############################# Update tenants END ############################################################
