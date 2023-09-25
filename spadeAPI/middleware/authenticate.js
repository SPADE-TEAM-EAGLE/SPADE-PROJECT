
const jwt = require("jsonwebtoken");
const { queryRunner } = require("../helper/queryRunner");
const { selectQuery } = require("../constants/queries");
// const { decryptJwtToken } = require("../helper/EnccryptDecryptToken");
const config = process.env;
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  // console.log(req.headers);

  if (!token) {
    return res.status(401).send("Access Denied");
  }
  try {
    // console.log(token);
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
    // console.log("landlord",decoded)
    const result = await queryRunner(selectQuery("users", "Email"), [
      decoded.email,
    ]);
  // console.log(result[0][0].active);
    req.user = {
      email: decoded.email,
      userId: result[0][0].id,
      userName: result[0][0].FirstName + " " + result[0][0].LastName,
      businessName:result[0][0].BusinessName,
      phone:result[0][0].Phone,
      streetAddress:result[0][0].streetAddress,
      BusinessAddress:result[0][0].BusinessAddress,
      firstName:result[0][0].FirstName,
      lastName:result[0][0].LastName,
      image:result[0][0].image,
      imageKey:result[0][0].imageKey,
      planID:result[0][0].PlanID,
      isActive : result[0][0].active,
      tenantEmail : result[0][0].tenantEmail,
      auth:result[0][0].auth,
      invoiceEmail : result[0][0].invoiceEmail,
      taskEmail : result[0][0].taskEmail,
      businessLogo : result[0][0].businessLogo,
      businessLogoKey : result[0][0].businessLogoKey,
      BAzipCode : result[0][0].BAZipcode,
      BAcity : result[0][0].BACity,
      BAstate : result[0][0].BAState,
      city : result[0][0].PACity,
      state : result[0][0].PAState,
      zipCode : result[0][0].PAZipcode,
      
    };
    next();
    // console.log("hello")
  } catch (err) {
    console.log(err);
    return res.status(400).send("Invalid Token");
  }
};
const verifyTokenTenant = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access Denied");
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
    const result = await queryRunner(selectQuery("tenants", "email"), [
      decoded.email,
    ]);
    
    req.user = {
      email: decoded.email,
      userId: result[0][0].id,
      userName: result[0][0].firstName + " " + result[0][0].lastName,
      landlordID: result[0][0].landlordID,
      propertyID: result[0][0].propertyID,
      firstName: result[0][0].firstName,
      lastName: result[0][0].lastName,
      phoneNumber: result[0][0].phoneNumber,
      city: result[0][0].city,
      state: result[0][0].state,
      zipCode: result[0][0].zipcode,
      state: result[0][0].state,
      address: result[0][0].Address,
      state: result[0][0].state,
      image: result[0][0].image,
      imageKey: result[0][0].imageKey,
      businessName: result[0][0].companyName,
      auth:result[0][0].auth

    };

    next();
  } catch (err) {
    console.log(err);
    return res.status(400).send("Invalid Token");
  }
};
module.exports = {
  verifyToken,
  verifyTokenTenant
};
