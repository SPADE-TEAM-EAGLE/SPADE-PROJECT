const jwt = require('jsonwebtoken');
const { queryRunner } = require('../helper/queryRunner');
const { selectQuery } = require('../constants/queries');
const config = process.env;
const verifyToken=async(req, res, next)=>{
  const token = req.headers.authorization.split(' ')[1]
  // console.log(req.body)
  if (!token) {
    return res.status(401).send('Access Denied');
  }
  try {
    const decoded = jwt.verify(token,config.JWT_SECRET_KEY);
    const result=await queryRunner(selectQuery("users","Email"), [decoded.email])
    req.user = {
      email:decoded.email,
      userId:result[0][0].id,
      userName:result[0][0].FirstName+" "+result[0][0].LastName

    }
    
    next();
  } catch (err) {
    console.log(err)
    return res.status(400).send('Invalid Token');
  }
}
module.exports=verifyToken