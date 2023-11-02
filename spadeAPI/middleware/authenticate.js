
const jwt = require("jsonwebtoken");
const { queryRunner } = require("../helper/queryRunner");
const { selectQuery, userPermissionProtected, userPermissionAuth } = require("../constants/queries");
// const { decryptJwtToken } = require("../helper/EnccryptDecryptToken");
const config = process.env;
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
  if (!token) {
    return res.status(401).send("Access Denied");
  } else if (decoded.role) {
    // console.log("Hello World");

    // console.log(decoded.email);
    // console.log(decoded.id);
    // console.log(decoded.role);
    // console.log(decoded.UserPermissionID);
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
      console.log(decoded.UserPermissionID);
      const result = await queryRunner(userPermissionAuth, [decoded.UserPermissionID]);

      function splitAndConvertToObject(value) {
        const resultObject = {};

        if (value.includes(',')) {
          const values = value.split(",");
          for (const item of values) {
            resultObject[item] = true;
          }
        } else {
          resultObject[value] = true;
        }

        return resultObject;
      } 
      console.log(result[0][0]);
      // Example usage for different fields
      // const id = result[0][0].id;
      const role = result[0][0].Urole;
      const llDashboard = splitAndConvertToObject(result[0][0].llDashboard);
      const properties = splitAndConvertToObject(result[0][0].properties);
      const units = splitAndConvertToObject(result[0][0].units);
      const tenants = splitAndConvertToObject(result[0][0].tenants);
      const tasks = splitAndConvertToObject(result[0][0].task); 
      const invoices = splitAndConvertToObject(result[0][0].invoices);
      const leads = splitAndConvertToObject(result[0][0].leads);
      const leadsInsights = splitAndConvertToObject(result[0][0].leadsInsight);
      const settingProfiles = splitAndConvertToObject(result[0][0].settingProfile);
      const settingCPasswords = splitAndConvertToObject(result[0][0].settingCPassword);
      const settingNotifications = splitAndConvertToObject(result[0][0].settingNotification);
      const settingCThemes = splitAndConvertToObject(result[0][0].settingCTheme);
      const settingSubscriptions = splitAndConvertToObject(result[0][0].settingSubscription);
      const settingMUsers = splitAndConvertToObject(result[0][0].settingMUsers);
      const settingEmailTs = splitAndConvertToObject(result[0][0].settingEmailT);
      const SettingInvoiceSettings = splitAndConvertToObject(result[0][0].SettingInvoiceSetting);
      console.log(result[0][0])
      req.user = {
        email: decoded.email,
        userId: result[0][0].llnalordId,
        userType : "Landlord",
        userName: result[0][0].UFirstName + " " + result[0][0].ULastName,
        businessName: result[0][0].BusinessName,
        phone: result[0][0].UPhone,
        streetAddress: result[0][0].streetAddress,
        BusinessAddress: result[0][0].BusinessAddress,
        firstName: result[0][0].UFirstName,
        lastName: result[0][0].ULastName,
        image: result[0][0].UImage,
        imageKey: result[0][0].imageKey,
        planID: result[0][0].PlanID,
        isActive: result[0][0].active,
        tenantEmail: result[0][0].tenantEmail,
        auth: result[0][0].auth,
        invoiceEmail: result[0][0].invoiceEmail,
        taskEmail: result[0][0].taskEmail,
        businessLogo: result[0][0].businessLogo,
        businessLogoKey: result[0][0].businessLogoKey,
        BAzipCode: result[0][0].BAZipcode,
        BAcity: result[0][0].BACity,
        BAstate: result[0][0].BAState,
        city: result[0][0].PACity,
        state: result[0][0].PAState,
        zipCode: result[0][0].PAZipcode,
        nuveiId: result[0][0].nuveiId,
        nuveiSubscriptionId: result[0][0].nuveiSubscriptionId,
        nuveiUPOID: result[0][0].nuveiUPOID,
        create_at: result[0][0].created_at,
        paidUnits: result[0][0].paidUnits,

        role,
        llDashboard,
        properties,
        units,
        tenants,
        tasks,
        invoices,
        leads,
        leadsInsights,
        settingProfiles,
        settingCPasswords,
        settingNotifications,
        settingCThemes,
        settingSubscriptions,
        settingMUsers,
        settingEmailTs,
        SettingInvoiceSettings,

      };
      next();
    } catch (err) {
      console.log(err);
      return res.status(400).send("Invalid Token");
    }
  } else {
    try {

      const result = await queryRunner(selectQuery("users", "Email"), [
        decoded.email,
      ]);
      // console.log(result[0][0].active);
      req.user = {
        email: decoded.email,
        userId: result[0][0].id,
        userType : "Landlord",
        nuveiUserId: result[0][0].nuveiId,
        userName: result[0][0].FirstName + " " + result[0][0].LastName,
        businessName: result[0][0].BusinessName,
        phone: result[0][0].Phone,
        streetAddress: result[0][0].streetAddress,
        BusinessAddress: result[0][0].BusinessAddress,
        firstName: result[0][0].FirstName,
        lastName: result[0][0].LastName,
        image: result[0][0].image,
        imageKey: result[0][0].imageKey,
        planID: result[0][0].PlanID,
        isActive: result[0][0].active,
        tenantEmail: result[0][0].tenantEmail,
        auth: result[0][0].auth,
        invoiceEmail: result[0][0].invoiceEmail,
        taskEmail: result[0][0].taskEmail,
        businessLogo: result[0][0].businessLogo,
        businessLogoKey: result[0][0].businessLogoKey,
        BAzipCode: result[0][0].BAZipcode,
        BAcity: result[0][0].BACity,
        BAstate: result[0][0].BAState,
        city: result[0][0].PACity,
        state: result[0][0].PAState,
        zipCode: result[0][0].PAZipcode,
        businessLogo: result[0][0].businessLogo,
        subscriptionID: result[0][0].nuveiSubscriptionId,
        nuveiUPOID: result[0][0].nuveiUPOID,
        create_at: result[0][0].created_at,
        paidUnits: result[0][0].paidUnits,


      };
      next();
      // console.log("hello")
    } catch (err) {
      console.log(err);
      return res.status(400).send("Invalid Token");
    }
  }
};

// sssssssssssssssssssssssssssssssss
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
      userType : "Tenant",
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
      auth: result[0][0].auth 
    }; 
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).send("Invalid Token");
  }
}; 
module.exports = {
  verifyToken,
  verifyTokenTenant,
};
