const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const tenantController = require("../controllers/tenantController");
const invoiceController = require("../controllers/invoiceController");
const verifyToken = require("../middleware/authenticate");
const { upload } = require("../middleware/imageUploads");
const { uploadExistingFiles } = require("../middleware/imageUploads");
const taskController = require("../controllers/taskController");
router.post("/Signup", userController.createUser);
router.get("/protected", verifyToken, userController.getUser);
router.get("/checkemail", userController.checkemail);
router.get("/Signin", userController.Signin);
router.get("/Signinall", userController.Signinall);
// router.get('/Signinall', userController.Signinall);
router.post("/resetEmail", userController.createResetEmail);
router.post("/verifyResetEmailCode", userController.verifyResetEmailCode);
router.post("/updatePassword", userController.updatePassword);
router.post("/resendCode", userController.resendCode);
router.get("/pricingPlan", userController.pricingPlan);
router.post("/property", [verifyToken, upload], userController.property);
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
router.put("/updateProperty",[verifyToken, upload],userController.propertyUpdate);
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

// router.post('/tenants',verifyToken,tenantController.createTenants);
router.post("/tenants", verifyToken, tenantController.createTenants);
router.post(
  "/sendInvitationLink",
  verifyToken,
  tenantController.sendInvitationLink
);
// router.post('/tenantIncreaseRent' , userController.tenantIncreaseRent);
// router.get('/verifyMailCheck',verifyToken,  userController.verifyMailCheck);
router.get('/verifyMailCheck', tenantController.verifyMailCheck);
router.get('/resetEmailTenant', tenantController.createResetEmailTenant);
router.post('/verifyResetEmailCodeTenant', tenantController.verifyResetEmailCodeTenant);
router.put('/updatePasswordTenant', tenantController.updatePasswordTenant);
router.put('/resendCodeTenants', tenantController.resendCodeTenants);
router.post('/addAlternateEmailPhone' ,verifyToken, tenantController.addAlternateEmailPhone);
router.post('/tenantAttachFile',[verifyToken,upload], tenantController.tenantAttachFile);
router.delete('/tenantAttachFileDelete' ,verifyToken, tenantController.tenantAttachFileDelete);
router.delete('/tenantDelete',verifyToken ,tenantController.tenantDelete);
router.get('/getTenantsByID', verifyToken,tenantController.getTenantsByID);
router.post('/createInvoice',[verifyToken,upload], invoiceController.createInvoice);
router.put('/putInvoiceStatusUpdates',verifyToken ,invoiceController.putInvoiceStatusUpdates);
router.get('/getAllInvoices', verifyToken ,invoiceController.getAllInvoices);
router.get('/getByIdInvoices', verifyToken ,invoiceController.getByIdInvoices);
router.put('/UpdateInvoice', [verifyToken,upload], invoiceController.UpdateInvoice);
router.delete('/invoiceDelete',verifyToken ,invoiceController.invoiceDelete);
router.post("/addVendor", verifyToken,taskController.addVendors);
// router.get("/getAllVendors",verifyToken ,taskController.getAllVendors);
router.get("/getAllVendors" ,taskController.getAllVendors);
router.post("/addTasks", upload, taskController.addTasks);
router.get("/getAllTask", taskController.getAllTask);
router.get("/taskByID", taskController.taskByID);
router.put("/updateTenants", verifyToken,tenantController.updateTenants);
router.get("/getStates", userController.getStates);
router.get("/getVendorCategory" ,taskController.getVendorCategory);
router.get("/getVendorAssignTo" ,taskController.getVendorAssignTo);
router.put("/updateTasks" ,taskController.updateTasks);
module.exports = router;
