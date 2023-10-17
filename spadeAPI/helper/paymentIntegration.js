const config = process.env;
const safecharge = require('safecharge');
const { request } = require('https'); // Use the built-in https module for HTTPS requests
const sha256 = require('js-sha256');
const utf8 = require('utf8');
const { query } = require('express');
// const { queryRunner } = require('./queryRunner');
const { selectQuery } = require('../constants/queries');
safecharge.initiate(config.merchantId, config.merchantSiteId, config.Secret_Key);
const { queryRunner } = require('./queryRunner')
const { updateUser } = require("./../constants/queries")

// ############################ timestamp #################################
function getTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
  const timestamp = getTimestamp(); 
// ############################ timestamp #################################

exports.saveCard = async (req,res) => {
  const {currency,amount} = req.body;
const apiUrl = config.APIKey;
const requestData = {
  merchantId: config.merchantId,
  merchantSiteId: config.merchantSiteId,
  clientRequestId: config.clientRequestId,
  clientUniqueId: config.clientUniqueId,
  currency: currency,
  amount: amount,
  timeStamp: timestamp,
  checksum: sha256(config.merchantId+config.merchantSiteId+config.clientRequestId+amount+currency+timestamp+config.Secret_Key)

};

const requestOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  }
};

const reqq = request(apiUrl, requestOptions, (response) => {
  let responseData = ''; 
  response.on('data', (chunk) => {
    responseData += chunk;
  }); 
  response.on('end', () => {
    try {
      const data = JSON.parse(responseData);
      // console.log(data);
      res.status(200).json({
          // data
          sessionToken:data.sessionToken,
          clientUniqueId:data.clientUniqueId,
          merchantId:data.merchantId,
          merchantSiteId:data.merchantSiteId,
      })
    } catch (error) {
      console.error('Error parsing response:', error);
      res.status(400).json({
          message:"Error parsing response",
          error,
      })
    }
  });
}); 
reqq.on('error', (error) => {
  console.error('Error sending request:', error);
  res.status(400).json({
      message:"Error sending request",
      error,
  })
}); 
// Send the request body
reqq.write(JSON.stringify(requestData));
reqq.end();
};

exports.openOrder = async (req,res) => {
    const {currency,amount,userId} = req.body;
  const apiUrl = config.APIKey;
  const requestData = {
    merchantId: config.merchantId,
    merchantSiteId: config.merchantSiteId,
    clientRequestId: config.clientRequestId,
    clientUniqueId: config.clientUniqueId,
    currency: currency,
    amount: amount,
    transactionType: "Auth",
    userTokenId:userId,
    timeStamp: timestamp,
    checksum: sha256(config.merchantId+config.merchantSiteId+config.clientRequestId+amount+currency+timestamp+config.Secret_Key)
  };
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  };

  const reqq = request(apiUrl, requestOptions, (response) => {
    let responseData = ''; 
    response.on('data', (chunk) => {
      responseData += chunk;
    }); 
    response.on('end', () => {
      try {
        const data = JSON.parse(responseData);
        // console.log(data);
        res.status(200).json({
            // data
            sessionToken:data.sessionToken,
            clientUniqueId:data.clientUniqueId,
            merchantId:data.merchantId,
            merchantSiteId:data.merchantSiteId,
        })
      } catch (error) {
        console.error('Error parsing response:', error);
        res.status(400).json({
            message:"Error parsing response",
            error,
        })
      }
    });
  }); 
  reqq.on('error', (error) => {
    console.error('Error sending request:', error);
    res.status(400).json({
        message:"Error sending request",
        error,
    })
  }); 
  // Send the request body
  reqq.write(JSON.stringify(requestData));
  reqq.end();
};

// ###################################### CREATE USER #############################################################
exports.createUserPayment = async (req,res) => {
  const {userId,firstName,lastName,address,state,city,zip,countryCode,phone,locale,email,county} = req.body;
const requestData = {
  // merchantId: "6400701569295268447",
  // merchantSiteId: "244298",
  // clientRequestId: "561ccf70-336b-11ee-a309-4f00ef0ed1ad",
  merchantId: config.merchantId,
  merchantSiteId: config.merchantSiteId,
  userTokenId: userId,
  clientRequestId: config.clientRequestId,
  firstName: firstName,
  lastName: lastName,
  address: address,
  state: state,
  city:city,
  zip:zip,
  countryCode: countryCode,
  phone: phone,
  locale: "en_US",
  email: email,
  // dateOfBirth: "01-01998",
  county:"USA",
  timeStamp: timestamp,
  checksum: sha256(config.merchantId+config.merchantSiteId+userId+config.clientRequestId+firstName+lastName+address+state+city+zip+countryCode+phone+"en_US"+email+"USA"+timestamp+config.Secret_Key),
  // checksum: sha256("6400701569295268447"+"244298"+"123"+"561ccf70-336b-11ee-a309-4f00ef0ed1ad"+"John"+ "Smith"+"US"+"john.smith@test.com"+timestamp+"xp8GrYWC6n9wHbxWuDwRPtAPICRLbBvvY2DuLYVRu8v5ip4GHPNymd0MA8KsEpbU"),
  // checksumConcatenation: config.merchantId+config.merchantSiteId+"123"+config.clientRequestId+"John"+ "Smith"+timestamp+config.Secret_Key 
};
// 90547429
// Console checksum
// console.log(requestData.checksumConcatenation);
console.log(requestData.checksum);

const requestOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  }
};
const reqq = request("https://ppp-test.nuvei.com/ppp/api/v1/createUser.do", requestOptions, (response) => {
  let responseData = ''; 
  response.on('data', (chunk) => {
    responseData += chunk;
  }); 
  response.on('end', () => {
    try {

      const data = JSON.parse(responseData);
      
      res.status(200).json({
          data
      })
    } catch (error) {
      console.error('Error parsing response:', error);
      res.status(400).json({
          message:"Error parsing response",
          error,
      })
    }
  });
}); 
reqq.on('error', (error) => {
  console.error('Error sending request:', error);
  res.status(400).json({
      message:"Error sending request",
      error,
  })
}); 
reqq.write(JSON.stringify(requestData));
reqq.end();
};
// ###################################### CREATE USER #############################################################

// ###################################### Get USER Details #############################################################
exports.getUserDetailsPayment = async (req,res) => {
  const requestData = {
    merchantId: config.merchantId,
    merchantSiteId: config.merchantSiteId,
    userTokenId: "1234",
    clientRequestId: config.clientRequestId,
    timeStamp: timestamp,
    checksum: sha256(config.merchantId+config.merchantSiteId+"1234"+config.clientRequestId+timestamp+config.Secret_Key),
  };
  console.log(requestData.checksum);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  };
  const reqq = request("https://ppp-test.nuvei.com/ppp/api/v1/getUserDetails.do", requestOptions, (response) => {
    let responseData = ''; 
    response.on('data', (chunk) => {
      responseData += chunk;
    }); 
    response.on('end', () => {
      try {
        console.log(responseData);
        const data = JSON.parse(responseData);
        res.status(200).json({
            data
        })
      } catch (error) {
        console.error('Error parsing response:', error);
        res.status(400).json({
            message:"Error parsing response",
            error,
        })
      }
    });
  }); 
  reqq.on('error', (error) => {
    console.error('Error sending request:', error);
    res.status(400).json({
        message:"Error sending request",
        error,
    })
  }); 
  reqq.write(JSON.stringify(requestData));
  reqq.end();
  };
  // ###################################### Get USER Details #############################################################

  // ###################################### Create Plan #############################################################
exports.createPlanPayment = async (req,res) => {
  const {name,initialAmount,recurringAmount,currency} = req.body;
  const requestData = {
    merchantId: config.merchantId, 
    merchantSiteId: config.merchantSiteId,
    name: name,
    initialAmount: initialAmount,
    recurringAmount: recurringAmount,
    currency: currency,
    startAfter: {
      day: "0",
      month: "0",
      year: "0"
  },
  recurringPeriod: {
    day: "0",
    month: "1",
    year: "0"
},
// endAfter: {
//     day: "0",
//     month: "0",
//     year: "0"
// },
  timeStamp: timestamp,
    // clientRequestId: config.clientRequestId,
    // timeStamp: timestamp,
    checksum: sha256(config.merchantId+config.merchantSiteId+name+initialAmount+recurringAmount+currency+timestamp+config.Secret_Key),
  };
  // console.log(requestData.checksum);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  };
  const reqq = request("https://ppp-test.nuvei.com/ppp/api/createPlan.do", requestOptions, (response) => {
    let responseData = ''; 
    response.on('data', (chunk) => {
      responseData += chunk;
    }); 
    response.on('end', () => {
      try {
        console.log(responseData);
        const data = JSON.parse(responseData);
        res.status(200).json({
            data
        })
      } catch (error) {
        console.error('Error parsing response:', error);
        res.status(400).json({
            message:"Error parsing response",
            error,
        })
      }
    });
  }); 
  reqq.on('error', (error) => {
    console.error('Error sending request:', error);
    res.status(400).json({
        message:"Error sending request",
        error,
    })
  }); 
  reqq.write(JSON.stringify(requestData));
  reqq.end();
  };
  // ###################################### Create Plan #############################################################

    // ###################################### Create Subsription #############################################################
exports.createSubscriptionPayment = async (req,res) => {
  const {initialAmount,recurringAmount,currency,planId,userTokenId,upoId} = req.body;
  const requestData = {
    merchantId: config.merchantId, 
    merchantSiteId: config.merchantSiteId,
    // planId: planId,
    userTokenId: userTokenId,
    userPaymentOptionId: upoId,
    initialAmount: initialAmount,
    recurringAmount: recurringAmount,
    currency: currency,
    startAfter: {
    day: "3",
    month: "2",
    year: "1"
},


  timeStamp: timestamp,
    
    // checksum: sha256(config.merchantId+config.merchantSiteId+userTokenId+planId+upoId+initialAmount+recurringAmount+currency+timestamp+config.Secret_Key),
  };
  console.log(config.merchantId,config.merchantSiteId,userTokenId,planId,upoId,initialAmount,recurringAmount,currency,timestamp,config.Secret_Key)
  console.log(config.merchantId+config.merchantSiteId+userTokenId+planId+upoId+initialAmount+recurringAmount+currency+timestamp+config.Secret_Key);

  const result=await queryRunner(selectQuery("plan", "id"), [
    planId
  ]);
  const {nuveiId,monthlyAnnual}=result[0][0];
  if(monthlyAnnual=="Monthly"){
    requestData.recurringPeriod = {
      day: "1",
      month: "0",
      year: "0"
    }
    requestData.endAfter= {
      day: "6",
      month: "7",
      year: "8"
  }
  
  }else{
    requestData.recurringPeriod = {
      day: "1",
      month: "0",
      year: "0"
    }
    requestData.endAfter= {
      day: "6",
      month: "7",
      year: "8"
  }
}
requestData.planId=nuveiId;
requestData.checksum=sha256(config.merchantId+config.merchantSiteId+userTokenId+nuveiId+upoId+initialAmount+recurringAmount+currency+timestamp+config.Secret_Key)
console.log(requestData)
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  };
  const reqq = request("https://ppp-test.nuvei.com/ppp/api/createSubscription.do", requestOptions, (response) => {
    let responseData = ''; 
    response.on('data', (chunk) => {
      responseData += chunk;
    }); 
    response.on('end', () => {
      try {
        console.log(responseData);
        const data = JSON.parse(responseData);
        res.status(200).json({
            data
        })
      } catch (error) {
        console.error('Error parsing response:', error);
        res.status(400).json({
            message:"Error parsing response",
            error,
        })
      }
    });
  }); 

  reqq.on('error', (error) => {
    console.error('Error sending request:', error);
    res.status(400).json({
        message:"Error sending request",
        error,
    })
  }); 
  reqq.write(JSON.stringify(requestData));
  reqq.end();
  };
  // ###################################### Create Subsription #############################################################
