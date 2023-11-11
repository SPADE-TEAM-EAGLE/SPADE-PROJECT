const user = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { serialize } = require("cookie");
const {
  selectQuery,
  deleteQuery,
  allLandlordQuery,
  insertDeletedUserQuery,
  insertUsersAdmin,
  updateUserAdminQuery
} = require("../constants/queries");
const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const { sendMailLandlord } = require("../sendmail/sendmail.js");
const config = process.env;



// ######################################## Super Admin SignIn ######################################## 
exports.signInAdmin = async(req,res)=>{
    const { email,password }=req.query;
    try {
      const checkResult = await queryRunner(selectQuery("superAdmin","email"),[email]);
      if(checkResult[0].length == 0){
          res.status(201).json({message:"Admin is not found"})
        }else if(await bcrypt.compare(password, checkResult[0][0].password)){
            const id = checkResult[0][0].id; 
            const token = jwt.sign({ email, id }, config.JWT_SECRET_KEY, {
                expiresIn: "3h",
            });
            res.status(200).json({
                message:"SignIn Successful",
                token : token
        })
      }else{
        res.status(201).json({message:"Incorrect Password"})
      }
    }catch(error){
        console.log(error);
        res.status(400).send(error.message);
  
    }
  }
  // ######################################## Super Admin SignIn ########################################



  // ######################################## All Landlord ########################################
  exports.allLandlord = async(req,res)=>{
    try {
      const allLandlordCheckResult = await queryRunner(allLandlordQuery);
      if(allLandlordCheckResult[0].length == 0){
          res.status(201).json({message:"Landlord is not found"})
        }else{
        res.status(201).json({
            message:"Get All Landlord",
            data : allLandlordCheckResult[0]})
      }
    }catch(error){
        console.log(error);
        res.status(400).send(error.message);
  
    }
  }
  // ######################################## All Landlord ########################################





  // ######################################## All Landlord Delete ########################################
  exports.deleteLandlord=async(req,res)=>{
    const { landlordId, adminId, reason }=req.body;
    const deleted_at = new Date();
    try {
      const selectUserResult = await queryRunner(selectQuery("users","id"),[landlordId]);
      if(selectUserResult[0].length > 0){
        const fName = selectUserResult[0][0].FirstName;
        const lName = selectUserResult[0][0].LastName;
        const email = selectUserResult[0][0].Email;
        const phone = selectUserResult[0][0].Phone;
        const planId = selectUserResult[0][0].PlanID;
        console.log(fName , lName)
        const deleteUserResult=await queryRunner(deleteQuery("users","id"),[landlordId]);
        if(deleteUserResult[0].affectedRows>0){
          console.log("1")
        const insertLandlordResult=await queryRunner(insertDeletedUserQuery,[adminId, fName, lName, email, phone, planId, reason, deleted_at,landlordId]);
        console.log("2")  
        const deleteUserBankAccountResult = await queryRunner(deleteQuery("bankAccount","userId"),[landlordId]);
        console.log("3")
        const deleteUserChatSResult = await queryRunner(deleteQuery("chats","senderId"),[landlordId]);
        console.log("4")
        const deleteUserChatRResult = await queryRunner(deleteQuery("chats","receiverID"),[landlordId]);
        console.log("5")
        const deleteUserInvoiceResult = await queryRunner(deleteQuery("invoice","landlordID"),[landlordId]);
        console.log("6")
        const deleteUserInvoiceCategoryResult = await queryRunner(deleteQuery("InvoiceCategories","landLordId"),[landlordId]);
        console.log("7")
        const deleteUserleadsResult = await queryRunner(deleteQuery("leads","landlordId"),[landlordId]);
        console.log("8")
        const deleteUserPropertyResult = await queryRunner(deleteQuery("property","landlordID"),[landlordId]);
        console.log("9")
        const deleteUserPropertyUnitsResult = await queryRunner(deleteQuery("propertyunits","landlordId"),[landlordId]);
        console.log("0")
        const deleteUserNotificationResult = await queryRunner(deleteQuery("notification","landlordID"),[landlordId]);
        console.log("11")
        const deleteUserProspectusResult = await queryRunner(deleteQuery("prospectus","landlordId"),[landlordId]);
        console.log("22")
        const deleteUserProspectusSourcesResult = await queryRunner(deleteQuery("prospectusSources","landlordId"),[landlordId]);
        console.log("33")
        const deleteUsertaskResult = await queryRunner(deleteQuery("task","landlordID"),[landlordId]);
        console.log("44")
        const deleteUsertenantsResult = await queryRunner(deleteQuery("tenants","landlordID"),[landlordId]);
        console.log("55")
        const deleteUserUserPUsersResult = await queryRunner(deleteQuery("userPUsers","llnalordId"),[landlordId]);
        console.log("66")
        const deleteUserVendorResult = await queryRunner(deleteQuery("vendor","LandlordID"),[landlordId]);
          
          res.status(200).json({message:"Landlord All Information Is Deleted"})

      }
      }else{
        res.status(400).json({message:"Landlord is not found"})
      }
    }catch{
    }
  }
  // ######################################## All Landlord Delete ########################################




  
  // ######################################## All Closed Landlord ########################################
  exports.allClosedLandlord = async(req,res)=>{
    try {
      const allClosedLandlordResult = await queryRunner(selectQuery("closedAccount"));
      if(allClosedLandlordResult[0].length == 0){
          res.status(201).json({message:"Landlord Closed Account is not found"})
        }else{
        res.status(201).json({
            message:"Get All Closed Account",
            data : allClosedLandlordResult[0]})
      }
    }catch(error){
        console.log(error);
        res.status(400).send(error.message);
  
    }
  }
  // ######################################## All Closed Landlord ########################################



 // ######################################## All Closed Landlord ########################################

  exports.createUserAdmin = async function (req, res) {
    const { firstName, lastName, email, phone, password, role, address,city,state,zipcode,image } = req.body;
    const currentDate = new Date();
    try {
      const selectResult = await queryRunner(selectQuery("superAdmin","email"), [
        email,
      ]);
      if (selectResult[0].length > 0) {
        return res.status(201).send("Email already exists");
      }
      const hashPassword = await hashedPassword(password);
      // generate a unique identifier for the user
      const salt = bcrypt.genSaltSync(10);
      const id = bcrypt
        .hashSync(lastName + new Date().getTime().toString(), salt)
        .substring(0, 10);
      const insertResult = await queryRunner(insertUsersAdmin, [firstName, lastName, email, password, phone, role, address,city,state,zipcode,image,currentDate]);
      const name = firstName + " " + lastName;
      const mailSubject = "Spade Admin Welcome Email";
      if (insertResult[0].affectedRows > 0) {
        console.log(email + " " + mailSubject + " " + name)
        await sendMailLandlord(email, mailSubject, name);
        return res.status(200).json({ message: "Users Permission User added successfully" });
      } else {
        return res.status(500).send("Failed to add User Permission User");
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
   // ######################################## All Closed Landlord ########################################


     // ######################################## All Closed Landlord ########################################
  exports.allUserAdmin = async(req,res)=>{
    try {
      const allUserAdminResult = await queryRunner(selectQuery("superAdmin"));
      if(allUserAdminResult[0].length == 0){
          res.status(201).json({message:"Super Admin Users is not found"})
        }else{
        res.status(201).json({
            message:"Get All Super Admin Users",
            data : allUserAdminResult[0]})
      }
    }catch(error){
        console.log(error);
        res.status(400).send(error.message);
  
    }
  }
  // ######################################## All Closed Landlord ########################################




  // ######################################## user Admin By Id ########################################
  exports.userAdminGetById = async function (req, res) {
    const { id } = req.query;
  try {
    const selectResult = await queryRunner(selectQuery("superAdmin", "id"), [
      id,
    ]);
    if (selectResult[0].length > 0) {
      return res.status(200).json({
        data: selectResult[0][0],
      });
    } else {
      res.status(200).json({
        message: "No admin user Found",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
    // ######################################## user Admin By Id ########################################
    
    
    
    
    // ######################################## user Admin Edit ########################################
    exports.updateAdminUser = async function (req, res) {
      const {  firstName, lastName, email, phone, password, role, address,city,state,zipcode,image, id } = req.body;
      const currentDate = new Date();
      try {
        const insertResult = await queryRunner(updateUserAdminQuery, [
          firstName, lastName, email, phone, password, role, address,city,state,zipcode,image,id]);
        if (insertResult[0].affectedRows > 0) {
          return res.status(200).json({ message: " User Updated Successfully" });
        } else {
          return res.status(500).send("Failed to Update User Permission User");
        }
      } catch (error) {
        console.log(error)
        return res.status(400).json({ message: error.message });
      }
    };
      // ######################################## user Admin Edit ########################################


      // ######################################## user Admin delete ########################################
      exports.userAdminDelete = async function (req, res) {
        const { id } = req.body;
        try {
          const selectResult = await queryRunner(deleteQuery("superAdmin", "id"), [
            id,
          ]);
          if (selectResult[0].affectedRows > 0) {
            return res.status(200).json({
              message: "Admin User Deleted Successsful"
            });
          } else {
            res.status(200).json({
              message: "No admin user Found",
            });
          }
        } catch (error) {
          res.status(400).json({
            message: error.message,
          });
        }
      };
        // ######################################## user Admin delete ########################################