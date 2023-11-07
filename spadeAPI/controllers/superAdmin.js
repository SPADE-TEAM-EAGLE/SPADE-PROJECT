const user = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { serialize } = require("cookie");
const {
  selectQuery,
  deleteQuery,
  allLandlordQuery
} = require("../constants/queries");
const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
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