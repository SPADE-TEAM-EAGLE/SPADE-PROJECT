
const jwt = require("jsonwebtoken");
const { queryRunner } = require("../helper/queryRunner");
const { selectQuery, userPermissionProtected, userPermissionAuth, countTenantQuery, adminPermissionQuery } = require("../constants/queries");
// const { decryptJwtToken } = require("../helper/EnccryptDecryptToken");
const config = process.env;
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
    if (!token) {
      return res.status(401).send("Access Denied");
    } else if (decoded.role) {
      try {
        // const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
        // console.log("Token ID "+decoded.UserPermissionID);
        const result = await queryRunner(userPermissionAuth, [decoded.UserPermissionID]);
                      // ############################### For ID Pattern ###################################################
                      let idPattern;
                      if (result[0][0].BusinessName !== null && result[0][0].BusinessName !== "") {
                        idPattern = result[0][0].BusinessName.substring(0, 3).toUpperCase();
                      } else {
                        idPattern =
                          (result[0][0].FirstName.substring(0, 2) || "").toUpperCase() +
                          (result[0][0].LastName.substring(0, 1) || "").toUpperCase();
                      }
                      
             // ############################### For ID Pattern ###################################################

        const futurePlanId = await queryRunner(selectQuery("futurePlanUser", "landlordId"), [result[0][0].llnalordId]);
        const planCountResult = await queryRunner(selectQuery("plan", "id"), [result[0][0].PlanID]);
        // console.log("result[0][0].PlanID");
        // console.log(result[0][0]);
        const countTenantResult = await queryRunner(countTenantQuery, [result[0][0].llnalordId]);
        function splitAndConvertToObject(value) {
          const resultObject = {};
          // console.log(value);
          if (value?.includes(',')) {
            const values = value.split(",");
            for (const item of values) {
              resultObject[item] = true;
            }
          } else {
            resultObject[value] = true;
          }

          return resultObject;
        }

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
        const totalTenantAllow = planCountResult[0][0].totalTenants;
        const totalTenantHave = countTenantResult[0][0].totalTenant;
        const planInvoice = splitAndConvertToObject(planCountResult[0][0].invoice);
        const planPortal = splitAndConvertToObject(planCountResult[0][0].portal);
        const planReporting = splitAndConvertToObject(planCountResult[0][0].reporting);
        const planTask = splitAndConvertToObject(planCountResult[0][0].task);
        const planChat = splitAndConvertToObject(planCountResult[0][0].chat);
        const planProspects = splitAndConvertToObject(planCountResult[0][0].prospect);
        const planNNN = splitAndConvertToObject(planCountResult[0][0].NNN);
        // console.log(result[0][0])
        if (futurePlanId[0]?.length != 0) {
          const targetDate = new Date(futurePlanId[0][futurePlanId[0].length - 1].fsubscriptionCreated_at);
          // Get the current date
          const currentDate = new Date();

          // Calculate the time difference in milliseconds
          const timeDifference = targetDate - currentDate;

          // Convert the time difference to days
          const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
          req.user = {
            email: decoded.email,
            userId: result[0][0].llnalordId,
            UID: result[0][0].Uid,
            URole: "User",
            userType: "Landlord",
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
            futurePlanId: futurePlanId[0][futurePlanId[0].length - 1].fplanId,
            daysRemaining: daysRemaining,
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
            totalTenantAllow,
            totalTenantHave,
            planInvoice,
            planPortal,
            planReporting,
            planTask,
            planChat,
            planProspects,
            planNNN,
            idPattern,

          };
        } else {
          req.user = {
            email: decoded.email,
            userId: result[0][0].llnalordId,
            UID: result[0][0].Uid,
            URole: "User",
            userType: "Landlord",
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
            totalTenantAllow,
            totalTenantHave,
            planInvoice,
            planPortal,
            planReporting,
            planTask,
            planChat,
            planProspects,
            planNNN,
            idPattern,

          };
        }

        next();
      } catch (err) {
        console.error(err);
        return res.status(400).json({
          message: "Invalid Token",
          role: "Landlord",
          error: err.message
        });
      }
    } else {
      try {

        const result = await queryRunner(selectQuery("users", "id"), [
          decoded.id,
          // "superadmin@gmail.com",
        ]);
        // console.log(result)
                // ############################### For ID Pattern ###################################################
                let idPattern;
                if (result[0][0].BusinessName !== null && result[0][0].BusinessName !== "") {
                  idPattern = result[0][0].BusinessName.substring(0, 3).toUpperCase();
                } else {
                  idPattern =
                    (result[0][0].FirstName.substring(0, 2) || "").toUpperCase() +
                    (result[0][0].LastName.substring(0, 1) || "").toUpperCase();
                }
                
       // ############################### For ID Pattern ###################################################

        const futurePlanId = await queryRunner(selectQuery("futurePlanUser", "landlordId"), [result[0][0]?.id]);
        const planCountResult = await queryRunner(selectQuery("plan", "id"), [result[0][0]?.PlanID]);
        const countTenantResult = await queryRunner(countTenantQuery, [result[0][0]?.id]);
        // console.log(planCountResult[0]);
        if (futurePlanId[0]?.length != 0) {

          const targetDate = new Date(futurePlanId[0][futurePlanId[0].length - 1].fsubscriptionCreated_at);

          // Get the current date
          const currentDate = new Date();

          // Calculate the time difference in milliseconds
          const timeDifference = targetDate - currentDate;

          // Convert the time difference to days
          const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
          // console.log(result[0][0].active);
          req.user = {
            email: decoded.email,
            userId: result[0][0].id,
            UID: result[0][0].id,
            URole: "Owner",
            userType: "Landlord",
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
            futurePlanId: futurePlanId[0][futurePlanId[0].length - 1].fplanId,
            daysRemaining: daysRemaining,
            // countTenantResult planCountResult
            totalTenantAllow: planCountResult[0][0].totalTenants,
            totalTenantHave: countTenantResult[0][0].totalTenant,
            planInvoice: planCountResult[0][0].invoice,
            planPortal: planCountResult[0][0].portal,
            planReporting: planCountResult[0][0].reporting,
            planTask: planCountResult[0][0].task,
            planChat: planCountResult[0][0].chat,
            planProspects: planCountResult[0][0].prospect,
            planNNN: planCountResult[0][0].NNN,
            idPattern,

          };
        } else {
          // console.log(futurePlanId[0][futurePlanId[0].length-1]);
          // console.log(result[0][0].active);
          req.user = {
            email: decoded.email,
            userId: result[0][0].id,
            UID: result[0][0].id,
            URole: "Owner",
            userType: "Landlord",
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
            totalTenantHave: countTenantResult[0][0].totalTenant,
            totalTenantAllow: planCountResult[0][0].totalTenants,
            // totalTenantHave : countTenantResult[0][0].totalTenant,
            planInvoice: planCountResult[0][0].invoice,
            planPortal: planCountResult[0][0].portal,
            planReporting: planCountResult[0][0].reporting,
            planTask: planCountResult[0][0].task,
            planChat: planCountResult[0][0].chat,
            planProspects: planCountResult[0][0].prospect,
            planNNN: planCountResult[0][0].NNN,
            idPattern,
          };
        }

        next();
        // console.log("hello")
      } catch (err) {
        console.error(err);
        return res.status(400).json({
          message: "Invalid Token",
          role: "Landlord",
          error: err.message
        });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "Token Expired",
      role: "Landlord",
      error: err.message
    });
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
    const result = await queryRunner(selectQuery("tenants", "id"), [
      decoded.id,
    ]);

    req.user = {
      email: decoded.email,
      userId: result[0][0].id,
      userType: "Tenant",
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
    console.error(err);

    return res.status(400).json({
      message: "Invalid Token",
      role: "Tenant",
      error: err.message
    });
  }
};



const verifySuperAdmin = async (req, res, next) => {
  const token = req?.headers?.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).send("Access Denied");
  }
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
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
    const result = await queryRunner(selectQuery("superAdmin", "id"), [decoded.id]);





    const selectResult = await queryRunner(adminPermissionQuery, [result[0][0].id]);
    let dataArray = [];
    if (selectResult[0].length > 0) {
      for (let i = 0; i < selectResult[0].length; i++) {
        const data = {};

        // Example usage for different fields
        const id = selectResult[0][i].id;
        const role = selectResult[0][i].userid;
        const overView = splitAndConvertToObject(selectResult[0][i].overView);
        const customers = splitAndConvertToObject(selectResult[0][i].customers);
        const closedAccount = splitAndConvertToObject(selectResult[0][i].closedAccount);
        const appearance = splitAndConvertToObject(selectResult[0][i].appearance);
        const profile = splitAndConvertToObject(selectResult[0][i].profile);
        const userManagement = splitAndConvertToObject(selectResult[0][i].userManagement);
        const changePlan = splitAndConvertToObject(selectResult[0][i].changePlan);
        const closeLandlord = splitAndConvertToObject(selectResult[0][i].closeLandlord);

        dataArray.push({
          id,
          role,
          overView,
          customers,
          closedAccount,
          appearance,
          profile,
          userManagement,
          changePlan,
          closeLandlord

        });
      }

    }




    req.user = {
      email: result[0][0].email,
      userId: result[0][0].id,
      userName: result[0][0].fName + " " + result[0][0].lName,
      firstName: result[0][0].fName,
      lastName: result[0][0].lName,
      AdminCreatedDate: result[0][0].created_at,
      phone: result[0][0].phone,
      image: result[0][0].images,
      imageKey: result[0][0].imageKey,
      address: result[0][0].address,
      city: result[0][0].city,
      state: result[0][0].state,
      zipCode: result[0][0].zipcode,
      userRole: result[0][0].roleId,
      userPeremission: dataArray
    };
    next();
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "Invalid Token",
      role: "Admin",
      error: err.message
    });
  }
};
module.exports = {
  verifyToken,
  verifyTokenTenant,
  verifySuperAdmin
};
