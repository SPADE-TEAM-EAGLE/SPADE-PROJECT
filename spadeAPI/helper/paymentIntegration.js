const config = process.env;
const safecharge = require('safecharge');
const { request } = require('https'); // Use the built-in https module for HTTPS requests
const sha256 = require('js-sha256');
const utf8 = require('utf8');
safecharge.initiate(config.merchantId, config.merchantSiteId, config.Secret_Key);

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
    const {currency,amount} = req.body;
  const apiUrl = config.APIKey;
  const requestData = {
    merchantId: config.merchantId,
    merchantSiteId: config.merchantSiteId,
    clientRequestId: config.clientRequestId,
    clientUniqueId: config.clientUniqueId,
    currency: currency,
    amount: amount,
    // transactionType: "Auth",
    userTokenId:"12345",
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
const requestData = {
  // merchantId: "6400701569295268447",
  // merchantSiteId: "244298",
  // clientRequestId: "561ccf70-336b-11ee-a309-4f00ef0ed1ad",
  merchantId: config.merchantId,
  merchantSiteId: config.merchantSiteId,
  userTokenId: "1234",
  clientRequestId: config.clientRequestId,
  firstName: "Michael",
  lastName: "Smith",
  address: "4310 Lemon Tree Ln, Houston, TX 77088",
  state: "TX",
  city:"Austin",
  zip:"77088",
  countryCode: "US",
  phone: "2818765489",
  locale: "en_US",
  email: "john.smith@test.com",
  // dateOfBirth: "01-01998",
  county:"USA",
  timeStamp: timestamp,
  checksum: sha256(config.merchantId+config.merchantSiteId+"1234"+config.clientRequestId+"Michael"+ "Smith"+"4310 Lemon Tree Ln, Houston, TX 77088"+"TX"+"Austin"+"77088"+"US"+"2818765489"+"en_US"+"john.smith@test.com"+"USA"+timestamp+config.Secret_Key),
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
  const requestData = {
    merchantId: config.merchantId, 
    merchantSiteId: config.merchantSiteId,
    name: "Monthly Basics",
    initialAmount: "50.67",
    recurringAmount: "50.67",
    currency: "USD",
    startAfter: {
      day: "0",
      month: "1",
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
    checksum: sha256(config.merchantId+config.merchantSiteId+"Monthly Basics"+"50.67"+"50.67"+"USD"+timestamp+config.Secret_Key),
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
  const requestData = {
    merchantId: config.merchantId, 
    merchantSiteId: config.merchantSiteId,
    planId: "9228",
    userTokenId: "12345",
    userPaymentOptionId: "97342878",
    initialAmount: "50.67",
    recurringAmount: "50.67",
    currency: "USD",
    endAfter: {
      day: "0",
      month: "12",
      year: "0"
  },
//   recurringPeriod: {
//     day: "0",
//     month: "1",
//     year: "0"
// },
// endAfter: {
//     day: "0",
//     month: "0",
//     year: "0"
// },
  timeStamp: timestamp,
    // clientRequestId: config.clientRequestId,
    // timeStamp: timestamp,
    checksum: sha256(config.merchantId+config.merchantSiteId+"12345"+"9228"+"97342878"+"50.67"+"50.67"+"USD"+timestamp+config.Secret_Key),
  };
  // console.log(requestData.checksum);
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

  exports.createSubscription = async (req,res) => {
    const requestData = {
      merchantId: config.merchantId,
      merchantSiteId: config.merchantSiteId,
      userTokenId: "1235",
      clientRequestId: config.clientRequestId,
      timeStamp: timestamp,
      checksum: sha256(config.merchantId+config.merchantSiteId+"1235"+config.clientRequestId+timestamp+config.Secret_Key),
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

