const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const tenantController = require("../controllers/tenantController");
const invoiceController = require("../controllers/invoiceController");
const tenantPortalController = require("../controllers/tenantPortalController");
const settingController = require("../controllers/settingController");
const {verifyToken,verifyTokenTenant} = require("../middleware/authenticate");
const { upload } = require("../middleware/imageUploads");
const { uploadExistingFiles } = require("../middleware/imageUploads");
const taskController = require("../controllers/taskController");
const fileUpload = require("../helper/S3Bucket");
router.post("/Signup", userController.createUser);
router.get("/protected", verifyToken, userController.getUser);
router.get("/protectedTenant", verifyTokenTenant, userController.getUser);
router.get("/checkemail", userController.checkemail);
router.get("/Signin", userController.Signin);
router.get("/Signinall", userController.Signinall);
router.post("/upload",verifyToken ,fileUpload.fileUpload);
// router.delete("/delete/:key", fileUpload.fileDelete);
router.put("/updatePlanId", verifyToken, userController.updatePlanId);
// router.get('/Signinall', userController.Signinall);
router.post("/resetEmail", userController.createResetEmail);
router.post("/verifyResetEmailCode", userController.verifyResetEmailCode);
router.post("/updatePassword", userController.updatePassword);
router.post("/resendCode", userController.resendCode);
router.get("/pricingPlan", userController.pricingPlan);
router.post("/property", verifyToken, userController.property);
router.put("/updateUserProfile", verifyToken, userController.updateUserProfile);
// router.post('/property', upload , userController.property);
router.get("/allProperty", verifyToken, userController.getproperty);
// router.get('/allProperty', userController.getproperty);
router.get("/PropertyUnits", verifyToken, userController.getpropertyUnits);
router.put(
  "/PropertyUnitsUpdates",
  verifyToken,
  userController.putPropertyUnitsUpdates
);
router.delete("/propertyDelete", verifyToken, userController.propertyDelete);
router.put("/updateProperty",verifyToken,userController.propertyUpdate);
// router.get('/viewProperty' ,userController.propertyView);
router.get("/viewProperty", verifyToken, userController.propertyView);
router.get('/resendEmail', verifyToken,invoiceController.resendEmail);
router.get("/PropertyUnits", verifyToken, userController.getpropertyUnits);
router.post("/addMoreUnits", userController.addMoreUnits);
router.delete("/deleteMoreUnits", userController.deleteMoreUnits);
router.put(
  "/PropertyUnitsUpdates",
  verifyToken,
  userController.putPropertyUnitsUpdates
  );
  router.get(
    "/getPropertyUnitsTenant",
    verifyToken,
    userController.getPropertyUnitsTenant
    );
router.get(
  "/viewPropertyTenant",
  verifyToken,
  userController.viewPropertyTenant
  );
  router.get(
    "/viewAllPropertyTenant",
    verifyToken,
    userController.viewAllPropertyTenant
    );
  // router.post('/tenants',verifyToken,tenantController.createTenants);
router.post("/tenants", verifyToken, tenantController.createTenants);
router.post(
  "/sendInvitationLink",
  verifyToken,
  tenantController.sendInvitationLink
);
// router.post('/tenantIncreaseRent' , userController.tenantIncreaseRent);
// router.get('/verifyMailCheck',verifyToken,  userController.verifyMailCheck);
router.get('/verifyMailCheck', userController.verifyMailCheck);
router.get('/resetEmailTenant', tenantController.createResetEmailTenant);
router.post('/verifyResetEmailCodeTenant', tenantController.verifyResetEmailCodeTenant);
router.put('/updatePasswordTenant', tenantController.updatePasswordTenant);
router.put('/resendCodeTenants', tenantController.resendCodeTenants);
router.post('/addAlternateEmailPhone' ,verifyToken, tenantController.addAlternateEmailPhone);
router.post('/tenantAttachFile',verifyToken, tenantController.tenantAttachFile);
router.delete('/tenantAttachFileDelete' ,verifyToken, tenantController.tenantAttachFileDelete);
router.delete('/tenantDelete',verifyToken ,tenantController.tenantDelete);
router.get('/getTenantsByID', verifyToken,tenantController.getTenantsByID);
router.post('/createInvoice',verifyToken, invoiceController.createInvoice);
router.put('/putInvoiceStatusUpdates',verifyToken ,invoiceController.putInvoiceStatusUpdates);
router.get('/getAllInvoices', verifyToken ,invoiceController.getAllInvoices);
router.get('/getByIdInvoices', verifyToken ,invoiceController.getByIdInvoices);
router.put('/UpdateInvoice', verifyToken, invoiceController.UpdateInvoice);
router.delete('/invoiceDelete',verifyToken ,invoiceController.invoiceDelete);
router.post("/addVendor", verifyToken,taskController.addVendors);
// router.get("/getAllVendors",verifyToken ,taskController.getAllVendors);
router.get("/getAllVendors",verifyToken ,taskController.getAllVendors);
router.post("/addTasks",verifyToken, taskController.addTasks);
router.get("/getAllTask",verifyToken ,taskController.getAllTask);
router.get("/taskByID",verifyToken ,taskController.taskByID);
router.put("/updateTenants", verifyToken,tenantController.updateTenants);
router.get("/getStates", userController.getStates);
router.get("/getVendorCategory" ,taskController.getVendorCategory);
router.get("/getVendorAssignTo",verifyToken ,taskController.getVendorAssignTo);
router.put("/updateTasks",verifyToken ,taskController.updateTasks);
router.delete("/deleteTask" ,taskController.deleteTask);
router.get("/propertyTask",verifyToken ,userController.propertyTask);
router.get("/tenantTask", verifyToken,tenantController.tenantTask);
router.get("/getAllInvoicesTenant",verifyTokenTenant ,tenantPortalController.getAllInvoicesTenant);
router.get("/getAllTaskTenant",verifyTokenTenant ,tenantPortalController.getAllTaskTenant);
router.get('/getTenantByID', verifyTokenTenant,tenantPortalController.getTenantByID);
router.put('/changePasssword',verifyToken, settingController.changePasssword);
router.put('/changePasswordTenant', verifyTokenTenant,settingController.changePasswordTenant);
router.put('/emailUpdate' ,userController.emailUpdate);
router.put('/verifyEmailUpdate' ,userController.verifyEmailUpdate);
 
router.post("/addInvoiceCategory",verifyToken ,invoiceController.createInvoiceCategories);
// updated category route
router.put("/updatedInvoiceCategory",verifyToken ,invoiceController.updateInvoiceCategories);
module.exports = router;
