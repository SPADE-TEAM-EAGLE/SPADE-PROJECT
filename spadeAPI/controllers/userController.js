const user = require("../models/user");
const sendMail = require("../sendmail/sendmail.js");
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
  updatePassword,
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
  selectAllTenantsProperty
} = require("../constants/queries");
const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const config = process.env;

exports.createUser = async function (req, res) {
  const { firstName, lastName, email, phone, password, planID } = req.body;
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
    ]);
    const name = firstName+" "+lastName;
      const mailSubject = "Spade Welcome Email";
    if (insertResult[0].affectedRows > 0) {
      
      await sendMail.sendMail(email, mailSubject, password, name);
      return res.status(200).json({ message: "User added successfully" });
    } else {
      return res.status(500).send("Failed to add user");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

exports.checkemail = async function (req, res) {
  const { email } = req.body;
  try {
    const selectResult = await queryRunner(selectQuery("users", "Email"), [
      email,
    ]);
    if (selectResult[0].length > 0) {
      return res.status(400).json({
        data: selectResult,
        message: "Email already exists",
      });
    } else {
      res.status(200).json({
        // message : "successful send"
        message: "New user",
      });
    }
  } catch (error) {
    res.status(500).send("Error");
  }
};

exports.getUser = (req, res) => {
  // console.log(req.user);
  res.status(200).json({
    user: req.user.userName,
  });
};

exports.Signin = async function (req, res) {
  const { email, password, tenant } = req.query;
  console.log(req.query)
  // console.log(1)
  // let selectResult;
  try {
    // for tenant
    if (tenant == "tenant") {
      const selectResult = await queryRunner(selectQuery("tenants", "email"), [
        email,
      ]);
      if (selectResult[0].length === 0) {
        res.status(400).send("Email not found");
      } else if (
        await bcrypt.compare(password, selectResult[0][0].tenantPassword)
      ) {
        const token = jwt.sign({ email, password }, config.JWT_SECRET_KEY, {
          expiresIn: "3h",
        });
        res.status(200).json({
          token: token,
          body: selectResult[0][0],
          message: "Successful Login",
        });
      } else {
        res.status(400).send("Incorrect Password");
      }
    } else {
      // for landlord
      const selectResult = await queryRunner(selectQuery("users", "Email"), [
        email,
      ]);

      // }
      if (selectResult[0].length === 0) {
        res.status(400).send("Email not found");
      } else if (await bcrypt.compare(password, selectResult[0][0].Password)) {
        const token = jwt.sign({ email, password }, config.JWT_SECRET_KEY, {
          expiresIn: "3h",
        });
        res.status(200).json({
          token: token,
          body: selectResult[0][0],
          message: "Successful Login",
        });
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
    // console.log(selectResult[0])
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
        res.status(400).send("Error");
      } else {
        res.status(200).json({ message: "Sended", id: userid });
      }
    } else if (selectResult[0].length === 0) {
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
  try {
    if (password === confirmpassword) {
      const hashPassword = await hashedPassword(password);
      const selectResult = await queryRunner(updatePassword, [
        hashPassword,
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
//  ############################# Update Password ############################################################

//  ############################# resend Code ############################################################
exports.resendCode = async (req, res) => {
  const { id } = req.body;
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
//  ############################# Get Pricing Plan End ############################################################

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
    units,
  } = req.body;
  const { userId } = req.user;
  // const userId = 3478;
  try {
    const propertycheckresult = await queryRunner(
      selectQuery("property", "propertyName", "address"),
      [propertyName, address]
    );
    if (propertycheckresult[0].length > 0) {
      res.send("Property Already Exist");
    } else {
      const status = "Non-active";
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
      ]);
      if (propertyResult.affectedRows === 0) {
        res.status(400).send("Error1");
      } else {
        const fileNames = req.files.map((file) => file.filename);
        const propertyID = propertyResult[0].insertId;
        for (let i = 0; i < fileNames.length; i++) {
          const img = fileNames[i];
          const propertyImageResult = await queryRunner(insertInPropertyImage, [
            propertyID,
            img,
          ]);
          if (propertyImageResult.affectedRows === 0) {
            res.send("Error2");
            return;
          }
        } //sss
        for (let i = 0; i < units; i++) {
          const propertyResult = await queryRunner(insertInPropertyUnits, [
            propertyID,
            "",
            "",
            "",
            "Vacant",
          ]);
          if (propertyResult.affectedRows === 0) {
            res.send("Error3 error occur in inserted units");
            return;
          }
        }
        //
        res.status(200).json({
          message: "property created successful",
        });
      }
    }
  } catch (error) {
    res.status(400).send("Error4");
    console.log(error);
    // console.log(req.files.map((file) => file.filename));
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
        const allPropertyImageResult = await queryRunner(
          selectQuery("propertyimage", "propertyID"),
          [propertyID]
        );

        if (allPropertyImageResult.length > 0) {
          const propertyImages = allPropertyImageResult[0].map(
            (image) => image.Image
          );
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
      res.status(400).json({
        message: "No Property data found",
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
  try {
    const { id } = req.body;
    const PropertyDeleteResult = await queryRunner(
      deleteQuery("property", "id"),
      [id]
    );
    if (PropertyDeleteResult[0].affectedRows > 0) {
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
        if (propertyDeleteresult[0].affectedRows > 0) {
          res.status(200).json({
            message: " Property deleted successfully",
          });
        }
      } else {
        res.status(400).json({
          message: "No Property Image data found ",
        });
      }
    } else {
      res.status(400).json({
        message: "No data found",
      });
      // console.log(PropertyDeleteResult)
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
    // console.log(`step : 1 get all values into body`);

    const {
      existingImages,
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
    } = req.body;
    const { userId } = req.user;
    // console.log(`step : 2 send all values data into database`);
    const propertyUpdateResult = await queryRunner(updateProperty, [
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
    ]);
    // console.log(req.files)
    if (propertyUpdateResult[0].affectedRows > 0) {
      // console.log(`step : 3 check property images into database propertyid = ${id}`);
      const propertycheckresult = await queryRunner(
        selectQuery("propertyimage", "propertyID"),
        [id]
      );

      if (propertycheckresult.length > 0) {
        propertyimages = propertycheckresult[0].map((image) => image.Image);
        let existingImg = existingImages.split(",");
        const imagesToDelete = propertyimages.filter(
          (element) => !existingImg.includes(element)
        );

        // Combine the common elements with array2

        imageToDelete(imagesToDelete);
        let propertyDeleteresult = [{ affectedRows: 0 }];
        // delete images Data into database
        if (imagesToDelete.length > 0) {
          for (let i = 0; i < imagesToDelete.length; i++) {
            propertyDeleteresult = await queryRunner(
              deleteQuery("propertyimage", "Image"),
              [imagesToDelete[i]]
            );
            // console.log(propertyDeleteresult)
          }
        }

        // console.log(`step : 4 delete previous images data into database propertyid = ${id}`);
        // console.log(propertyDeleteresult)
        // if (propertyDeleteresult[0].affectedRows > 0) {

        const fileNames = req.files.map((file) => file.filename);
        existingImg = [...fileNames];
        // using loop to send new images data into database
        for (let i = 0; i < existingImg.length; i++) {
          const img = existingImg[i];
          const propertyImageResult = await queryRunner(insertInPropertyImage, [
            id,
            img,
          ]);
          if (propertyImageResult.affectedRows === 0) {
            return res.send("Error2");
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
 
  } catch (error) {
    console.log(error);
    return res.send("Error from Updating Property");
  }
};

//  ############################# Update Property End ############################################################

//  ############################# View Property Start ############################################################
exports.propertyView = async (req, res) => {
  try {
    const { propertyId } = req.query;
    // console.log(req.query)
    // check property in database
    // console.log(propertyId);
    const propertyViewResult = await queryRunner(
      selectQuery("property", "id"),
      [propertyId]
    );
    if (propertyViewResult.length > 0) {
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
            Image: image.Image,
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
    res.send("Error from Viewing Property ");
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
    const {id} = req.query;
    // console.log(req)
    // console.log(req.user);
    let PropertyTenantResult;
    console.log(id)
    PropertyTenantResult = await queryRunner(selectAllTenantsProperty, [id]);
    console.log(PropertyTenantResult[0])
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
    // const {id} = req.query;
    // console.log(req)
    // console.log(req.user);
    let PropertyTenantResult;
    // console.log(id)
    PropertyTenantResult = await queryRunner(selectAllTenants, [userId]);
    console.log(PropertyTenantResult[0])
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
//  ############################# Get Property and tenant data End ############################################################

//  ############################# Add more property units Start ############################################################
exports.addMoreUnits = async (req, res) => {
  const { propertyID } = req.body;

  try {
    const propertyUnitResult = await queryRunner(insertInPropertyUnits, [
      propertyID,
      "",
      "",
      "",
      "Vacant",
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
  // console.log(req.query)
  try {
    const taskByIDResult = await queryRunner(propertyTaskQuery, [Id]);
    if (taskByIDResult.length > 0) {
      for (let j = 0; j < taskByIDResult[0].length; j++) {
        const taskID = taskByIDResult[0][j].id;
        const TaskImagesResult = await queryRunner(selectQuery("taskimages", "taskID"),[taskID]);
        if (TaskImagesResult[0].length > 0) {
          const taskImages = TaskImagesResult[0].map((image) => image.taskImages);
          taskByIDResult[0][j].taskImages = taskImages;
        } else {
          taskByIDResult[0][j].taskImages = ["No Task Images Found"];
        }
        const TaskAssignToResult = await queryRunner(
          selectQuery("taskassignto", "taskId"),
          [taskID]
        );
        const vendorIDs = TaskAssignToResult[0].map((vendorID) => vendorID.vendorId);
        const vendorData = [];
        for (let i = 0; i < vendorIDs.length; i++) {
          const vID = vendorIDs[i];
          const vendorResult = await queryRunner(
            selectQuery("vendor", "id"),
            [vID]
          );
          if (vendorResult.length > 0) {
            const categoryIDs = vendorResult[0][0].categoryID;
            const VendorCategoryResult = await queryRunner(
              selectQuery("vendorcategory", "id"),
              [categoryIDs]
            );
            if (VendorCategoryResult.length > 0) {
              const vendorDataObject = {
                name: vendorResult[0][0].firstName + " " + vendorResult[0][0].lastName,
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
        message: "No property Task data found",
      });
    }
  } catch (error) {
    console.log("Error:", error);
    res.send("Error Get property Task");
  }
};
 
//  ############################# Task property ############################################################
 