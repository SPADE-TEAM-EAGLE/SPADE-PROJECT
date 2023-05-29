const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authenticate');
const {upload} = require('../middleware/imageUploads') ;
const {uploadExistingFiles} = require('../middleware/imageUploads') ;
router.post('/Signup', userController.createUser);
router.get('/protected',verifyToken,userController.getUser)
router.get('/checkemail', userController.checkemail);
router.get('/Signin', userController.Signin);
router.get('/Signinall', userController.Signinall);
// router.get('/Signinall', userController.Signinall);
router.post('/resetEmail', userController.createResetEmail);
router.post('/verifyResetEmailCode', userController.verifyResetEmailCode);
router.post('/updatePassword', userController.updatePassword);
router.post('/resendCode', userController.resendCode);
router.post('/property', [verifyToken,upload] , userController.property);
// router.post('/property', upload , userController.property);
router.get('/allProperty',verifyToken, userController.getproperty);
// router.get('/allProperty', userController.getproperty);
router.get('/PropertyUnits',verifyToken,  userController.getpropertyUnits);
router.put('/PropertyUnitsUpdates',verifyToken,  userController.putPropertyUnitsUpdates);
router.delete('/propertyDelete', verifyToken,userController.propertyDelete);
router.put('/updateProperty', [verifyToken,upload], userController.propertyUpdate);
// router.get('/viewProperty' ,userController.propertyView);
router.get('/viewProperty', verifyToken,userController.propertyView);
router.get('/PropertyUnits',verifyToken,  userController.getpropertyUnits);
router.put('/PropertyUnitsUpdates',verifyToken,  userController.putPropertyUnitsUpdates);
router.post('/tenants',verifyToken,userController.createTenants);
router.post('/sendInvitationLink', verifyToken, userController.sendInvitationLink); 
router.post('/tenantIncreaseRent' , userController.tenantIncreaseRent); 
// router.get('/verifyMailCheck',verifyToken,  userController.verifyMailCheck);
router.get('/verifyMailCheck', userController.verifyMailCheck);
router.put('/resetEmailTenant', userController.createResetEmailTenant);
router.post('/verifyResetEmailCodeTenant', userController.verifyResetEmailCodeTenant);
router.put('/updatePasswordTenant', userController.updatePasswordTenant);
router.get('/getPropertyTenant', userController.getPropertyTenant);

module.exports = router;


