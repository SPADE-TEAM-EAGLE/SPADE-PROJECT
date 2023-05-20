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
  insertInUsers,
  addResetToken,
  updatePassword,
  insertInProperty,
  insertInPropertyImage,
  updateProperty
} = require("../constants/queries");
const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const config = process.env;

exports.createUser = async function (req, res) {
  const { firstName, lastName, email, phone, password, planID } = req.body;
  try {
    const selectResult = await queryRunner(selectQuery("users", "Email"), [email])
    if (selectResult[0].length > 0) {
      return res.status(400).send('Email already exists');
    }
    const hashPassword = await hashedPassword(password);
    // generate a unique identifier for the user
    const salt = bcrypt.genSaltSync(10);
    const id = bcrypt.hashSync(lastName + new Date().getTime().toString(), salt).substring(0, 10);
    const insertResult = await queryRunner(insertInUsers, [id, firstName, lastName, email, phone, hashPassword, planID]);
    if (insertResult[0].affectedRows > 0) {
      return res.status(200).json({ message: 'User added successfully' });
    } else {
      return res.status(500).send('Failed to add user');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}

exports.checkemail = async function (req, res) {
  const { email } = req.body;
  try {
    const selectResult = await queryRunner(selectQuery("users", "Email"), [email]);
    if (selectResult[0].length > 0) {
      return res.status(400).json({
        data: selectResult,
        message: 'Email already exists'
      });
    }
    else {
      res.status(200).json({
        // message : "successful send"
        message: "New user",
      });
    }
  } catch (error) {
    res.status(500).send("Error");
  }

}

exports.getUser = (req, res) => {
  console.log(req.user)
}

exports.Signin = async function (req, res) {
  const { email, password } = req.query;
  // console.log(1)
  try {
    const selectResult = await queryRunner(selectQuery("users", "Email"), [email]);
    if (selectResult[0].length === 0) {
      res.status(400).send("Email not found");
    }
    else if (await bcrypt.compare(password, selectResult[0][0].Password)) {
      const token = jwt.sign({ email, password }, config.JWT_SECRET_KEY, { expiresIn: '3h', });
      // const serialized = serialize('authtoken', token,{httpOnly: true,expires: new Date(Date.now() + 3600000 * 2)});
      // res.setHeader('Cookie', serialized);
      // localStorage.setItem('token', serialized);
      res.status(200).json({
        token: token,
        body: selectResult[0][0],
        message: "Successful Login"
      });
    }
    else {
      res.status(400).send(
        "Incorrect Password"
      );
    }

  } catch (error) {
    console.log(error)
    res.status(400).send(error.message)
  }

};

exports.Signinall = async function (req, res) {
  try {
    const selectResult = await queryRunner(selectQuery('users'));
    if (selectResult[0].length > 0) {
      res.status(200).json({
        body: result,
      });
    }
    else {
      res.status(400).json({
        "message": "No user found"
      });
    }
  } catch (error) {
    res.status(400).send("Error")
  }

};

//  ############################# Reset Email ############################################################
exports.createResetEmail = async (req, res) => {
  const { email } = req.body;
  // console.log(email);
  const mailSubject = "Spade Reset Email";
  const random = Math.floor(100000 + Math.random() * 900000)
  try {
    const selectResult = await queryRunner(selectQuery('users', "Email"), [email]);
    // console.log(selectResult[0])
    if (selectResult[0].length > 0) {
      const userid = selectResult[0][0].id;
      const name = selectResult[0][0].FirstName + " " + selectResult[0][0].LastName
      sendMail(email, mailSubject, random, name);
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
      const updateResult = await queryRunner(addResetToken, [random, formattedDate, userid]);
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
//  ############################# Reset Email ############################################################

//  ############################# Verify Reset Email Code ############################################################
exports.verifyResetEmailCode = async (req, res) => {
  const { id, token } = req.body;
  // console.log(req.body)
  try {
    const selectResult = await queryRunner(selectQuery('users', 'id', 'token'), [id, token]);
    if (selectResult[0].length > 0) {
      const now = new Date(selectResult[0][0].updated_at);
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
//  ############################# Verify Reset Email Code ############################################################


//  ############################# Update Password ############################################################

exports.updatePassword = async (req, res) => {
  const { id, password, confirmpassword, token } = req.body;
  try {
    if (password === confirmpassword) {
      const hashPassword = await hashedPassword(password)
      const selectResult = await queryRunner(updatePassword, [hashPassword, id, token]);
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
//  ############################# Update Password ############################################################


//  ############################# resend Code ############################################################
exports.resendCode = async (req, res) => {
  const { id } = req.body;
  const mailSubject = "Spade Reset Email";
  const random = Math.floor(100000 + Math.random() * 900000)
  try {
    const selectResult = await queryRunner(selectQuery('users', "id"), [id]);
    if (selectResult[0].length > 0) {
      const userid = selectResult[0][0].id;
      const name = selectResult[0][0].FirstName + " " + selectResult[0][0].LastName
      // console.log(selectResult[0][0])
      sendMail(selectResult[0][0].Email, mailSubject, random, name);
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
      const updateResult = await queryRunner(addResetToken, [random, formattedDate, userid]);
      if (updateResult[0].affectedRows === 0) {
        res.status(400).send("Error")
      }
      else {
        res.status(200).json({ "message": "Sended" })
      }
    }
  } catch (error) {
    res.status(400).send("Error")
    console.log(error)
  }
}
//  ############################# resend Code ############################################################



//  ############################# Property Start ############################################################

exports.property = async (req, res) => {
  // console.log(1)
  const {
    // landlordID, 
    propertyName,
    address,
    city,
    state,
    zipCode,
    propertyType,
    propertySQFT,
    units
  } = req.body;
  const { userId } = req.user
  try {
    const propertycheckresult = await queryRunner(selectQuery("property", "propertyName", "address"), [propertyName, address])
    if (propertycheckresult[0].length > 0) {
      res.send('Property Already Exist');
    } else {
      const status = "Non-active";
      const propertyResult = await queryRunner(insertInProperty, [userId, propertyName, address, city, state, zipCode, propertyType, propertySQFT, status, units])
      if (propertyResult.affectedRows === 0) {
        res.status(400).send('Error1');
      } else {
        // console.log(req)
        // console.log(req.)
        console.log(req.files)
        const fileNames = req.files.map((file) => file.filename);
        // console.log(fileNames);
        const propertyID = propertyResult[0].insertId;
        for (let i = 0; i < fileNames.length; i++) {
          const img = fileNames[i];
          const propertyImageResult = await queryRunner(insertInPropertyImage, [propertyID, img])
          if (propertyImageResult.affectedRows === 0) {
            res.send('Error2');
            return;
          }
        }
      }
    }
  }
  catch (error) {
    res.status(400).send("Error3");
    console.log(error);
    // console.log(req.files.map((file) => file.filename));
  }
}
//  ############################# Property End ############################################################



//  ############################# Get Property Start ############################################################

exports.getproperty = async (req, res) => {
  const {userId,userName}=req.user
  try {

    console.log("Step 1: Fetching property data...");
    const allPropertyResult = await queryRunner(selectQuery('property', 'landlordID'), [userId]);

    if (allPropertyResult.length > 0) {

      for (var i = 0; i < allPropertyResult[0].length; i++) {
        const propertyID = allPropertyResult[0][i].id;
        // Retrieve property images for the current property ID
        const allPropertyImageResult = await queryRunner(selectQuery('propertyimage', 'propertyID'), [propertyID]);

        if (allPropertyImageResult.length > 0) {

          const propertyImages = allPropertyImageResult[0].map((image) => image.Image);
          // Extract image URLs from the result
          allPropertyResult[0][i].images = propertyImages; // Add property images to the current property object
        } else {
          allPropertyResult[0][i].images = ["no Image"]; // Set empty array if no property images found
        }
      }

      res.status(200).json({
        // data: length,
        data: allPropertyResult,
        user:userName,
        message: "All properties"
      });
      // }

    } else {
      res.status(400).json({
        message: "No Property data found"
      });
    }
  } catch (error) {
    console.log("Error:", error);
    res.send("Error Get Property");
  }
};


//  ############################# Get Property End ############################################################


//  ############################# Get Property ByID Start ############################################################
exports.getpropertyByID = async (req, res) => {
  try {
    const { id } = req.body
    // const propertycheckresult = await queryRunner(selectQuery("property","propertyName","address"),[propertyName,address])
    const PropertyByIDResult = await queryRunner(selectQuery("property", "id"), [id]);
    if (PropertyByIDResult.length > 0) {
      const data = JSON.parse(JSON.stringify(PropertyByIDResult));
      res.status(200).json({
        data: data,
        message: "property By ID"
      })
    } else {
      res.status(400).json({
        message: "No data found"
      })
    }
  } catch (error) {
    res.send("Error Get Property By ID");
    console.log(req.body)
    console.log(error)
  }
      }
      //  ############################# Get Property ByID End ############################################################


      //  ############################# Delete Property Start ############################################################
      exports.propertyDelete = async (req, res) => {
        try {
          const { id } = req.body
          const PropertyDeleteResult = await queryRunner(deleteQuery("property", "id"), [id]);
          if (PropertyDeleteResult[0].affectedRows > 0) {
            res.status(200).json({
              message: " Property deleted successfully"
            })
          } else {
            res.status(400).json({
              message: "No data found"
            })
            // console.log(PropertyDeleteResult)
          }
        } catch (error) {
          res.send("Error from delete Property ");
          console.log(req.body)
          console.log(error)
        }
      }
      //  ############################# Delete Property End ############################################################


      //  ############################# Update Property Start ############################################################

      exports.propertyUpdate = async (req, res) => {
        try {
          console.log(`step : 1 get all values into body`);
          // console.log(typeof req.body.existingImages)
          // console.log(req.body.existingImages)
          // console.log(req)

          const {existingImages, propertyName, address, city, state, zipCode, propertyType, propertySQFT, status, id, units } = req.body
          const { userId } = req.user
          console.log(`step : 2 send all values data into database`);
          const propertyUpdateResult = await queryRunner(updateProperty, [userId, propertyName, address, city, state, zipCode, propertyType, propertySQFT, "Active", units, id]);
          // console.log(req.files)
          if (propertyUpdateResult[0].affectedRows > 0) {
            console.log(`step : 3 check property images into database propertyid = ${id}`);
            const propertycheckresult = await queryRunner(selectQuery("propertyimage", "propertyID"), [id]);

            if (propertycheckresult.length > 0) {
              propertyimages = propertycheckresult[0].map((image) => image.Image);
              let existingImg=existingImages.split(",")
              const imagesToDelete = propertyimages.filter(element => !existingImg.includes(element));
              

              // Combine the common elements with array2
            
              imageToDelete(imagesToDelete);
              let propertyDeleteresult=[{"affectedRows":0}];
              // delete images Data into database
              if(imagesToDelete.length>0){
                for(let i=0;i<imagesToDelete.length;i++){

                  propertyDeleteresult = await queryRunner(deleteQuery("propertyimage", "Image"), [imagesToDelete[i]]);
                  // console.log(propertyDeleteresult)
                }
              }
             
              // console.log(`step : 4 delete previous images data into database propertyid = ${id}`);
              // console.log(propertyDeleteresult)
              // if (propertyDeleteresult[0].affectedRows > 0) {
        

                
                const fileNames = req.files.map((file) => file.filename);
                existingImg=[...fileNames]
                // using loop to send new images data into database
                for (let i = 0; i < existingImg.length; i++) {
                  const img = existingImg[i];
                  const propertyImageResult = await queryRunner(insertInPropertyImage, [id, img]);
                  console.log(`step : 5 inserted new image data into database insertId = ${id}`);
                  if (propertyImageResult.affectedRows === 0) {
                    return res.send('Error2');
                  }
                }

                return res.status(201).json({
                  message: "Form Submited",
                });
              } else {
                return res.status(400).json({
                  message: "No Property data found",
                });
              }
            } else {
              return res.status(400).json({
                message: "No Property",
              });
            }

            // This part of the code will not be reached due to the previous return statements.
            // res.status(200).json({
            //   message: "Property Updated successfully",
            // });
          // } else {
          //   return res.status(400).json({
          //     message: "No data found",
          //   });
          // }
        } catch (error) {
          console.log(error);
          return res.send("Error from Updating Property");
        }
      };

      //  ############################# Update Property End ############################################################

      


      //  ############################# View Property Start ############################################################
      exports.propertyView = async (req, res) => {
        try {
          const { propertyId } = req.query
          // console.log(req.query)
          // check property in database
          const propertyViewResult = await queryRunner(selectQuery('property', 'id'), [propertyId]);
          if (propertyViewResult.length > 0) {
            // check property Images in database
            const propertyViewImageResult = await queryRunner(selectQuery('propertyimage', 'propertyID'), [propertyId]);
            if (propertyViewImageResult.length > 0) {

              // Property Data
              const propertyData = propertyViewResult[0];

              // Property Image Data
              const imageData = propertyViewImageResult[0];


              const propertiesWithImages = propertyData.map(property => {
                const matchingImages = imageData.filter(image => image.propertyID === property.id.toString());
                const images = matchingImages.map(image => ({
                  propertyID: image.propertyID,
                  Image: image.Image
                }));
                return {
                  ...property,
                  images
                };
              });
              // console.log(propertiesWithImages[0].images)
              const finalResult = propertiesWithImages[0];
              res.status(200).json({
                data: finalResult
              })
            } else {
              res.status(400).json({
                message: "No Image data found"
              })
            }
          } else {
            res.status(400).json({
              message: "No Property data found"
            })
          }
        } catch (error) {
          res.send("Error from Viewing Property ");
          console.log(req.body)
          console.log(error)
        }
      }
    //  ############################# View Property End ############################################################
