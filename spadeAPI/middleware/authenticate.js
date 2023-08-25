// const jwt = require("jsonwebtoken");
// const { queryRunner } = require("../helper/queryRunner");
// const { selectQuery } = require("../constants/queries");
// const config = process.env;

// const verifyToken = async (req, res, next) => {
//   try {
//     const authorizationHeader = req.headers.authorization;

//     if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
//       return res.status(401).send("Access Denied");
//     }

//     const token = authorizationHeader.split(" ")[1];
//     const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
//     console.log(decoded);

//     const result = await queryRunner(selectQuery("tenants", "email"), [
//       decoded.email,
//     ]);
//     req.user = {
//       email: decoded.email,
//       userId: result[0][0].id,
//       userName: result[0][0].FirstName + " " + result[0][0].LastName,
//     };

//     if (result.length === 0) {
//       return res.status(401).send("Invalid Token");
//     }

//     // req.user = {
//     //   email: decoded.email,
//     //   userId: result[0].id,
//     //   userName: result[0].FirstName + " " + result[0].LastName,
//     // };

//     next();
//   } catch (err) {
//     console.log(err);
//     if (err instanceof jwt.TokenExpiredError) {
//       return res.status(401).send("Token expired");
//     }
//     return res.status(401).send("Invalid Token");
//   }
// };

// /*
// const verifyToken = async (req, res, next) => {
//   const token = req.headers.authorization.split(" ")[1];
//   // console.log(req.body)
//   if (!token) {
//     return res.status(401).send("Access Denied");
//   }
//   try {
//     const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
//     const result = await queryRunner(selectQuery("users", "Email"), [
//       decoded.email,
//     ]);
//     req.user = {
//       email: decoded.email,
//       userId: result[0][0].id,
//       userName: result[0][0].FirstName + " " + result[0][0].LastName,
//     };

//     next();
//     // console.log("hello")
//   } catch (err) {
//     console.log(err);
//     return res.status(400).send("Invalid Token");
//   }
// };
// */
// const verifyTokenTenant = async (req, res, next) => {
//   const token = req.headers.authorization.split(" ")[1];
//   // console.log(req.body)
//   if (!token) {
//     return res.status(401).send("Access Denied");
//   }
//   try {
//     const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
//     const result = await queryRunner(selectQuery("tenants", "email"), [
//       decoded.email,
//     ]);
//     req.user = {
//       email: decoded.email,
//       userId: result[0][0].id,
//       userName: result[0][0].FirstName + " " + result[0][0].LastName,
//     };

//     next();
//   } catch (err) {
//     console.log(err);
//     return res.status(400).send("Invalid Token");
//   }
// };
// (module.exports = verifyToken), verifyTokenTenant;
const jwt = require("jsonwebtoken");
const { queryRunner } = require("../helper/queryRunner");
const { selectQuery } = require("../constants/queries");
const config = process.env;
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  // console.log(req.body)
  if (!token) {
    return res.status(401).send("Access Denied");
  }
  try {
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
      isActive : result[0][0].active
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
  // console.log(req.body)
  if (!token) {
    return res.status(401).send("Access Denied");
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
    // console.log("tenant",decoded)
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
