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
  merchantId: config.merchantId,
  merchantSiteId: config.merchantSiteId,
  userTokenId: "123",
  clientRequestId: config.clientRequestId,
  firstName: "John",
  lastName: "Smith",
  address: "some street",
  state: "Sindh",
  city:"Karachi",
  zip:"234567",
  countryCode: "GB",
  phone: "090078601",
  locale: "en_UK",
  email: "john.smith@test.com",
  dateOfBirth: "01-01-2023",
  county:"Pakistan",
  timeStamp: timestamp,
  // checksum: sha256(config.merchantId)+config.merchantSiteId)+"123")+utf8.encode(config.clientRequestId)+utf8.encode("John")+ utf8.encode("Smith")+utf8.encode(timestamp)+utf8.encode(config.Secret_Key))
  checksum: sha256(config.merchantId+config.merchantSiteId+"123"+config.clientRequestId+"John"+ "Smith"+timestamp+config.Secret_Key)
};
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









// ###################################### CREATE USER #############################################################
// const axios = require('axios'); // Import the axios library for making HTTP requests

// exports.createUserPaymentasdfgh = async (req, res) => {
//     const url = "https://ppp-test.nuvei.com/ppp/api/v1/createUser.do";
    
//     const headers = {
//         "merchantId": config.merchantId,
//         "secretKey": config.Secret_Key
//     };
    
//     const payload = {

//         "userType": "individual",
//         "userTokenId": "123",
//         "firstName": "John",
//         "lastName": "Doe",
//         "email": "john.doe@example.com",
//         "phone": "123-456-7890",
//         "billingAddress": {
//             "street1": "123 Main Street",
//             "city": "Anytown",
//             "state": "CA",
//             "zipCode": "12345"
//         },
//         "shippingAddress": {
//             "street1": "456 Elm Street",
//             "city": "Anytown",
//             "state": "CA",
//             "zipCode": "12345"
//         }
//     };

//     try {
//         const response = await axios.post(url, payload, { headers });
        
//         if (response.status === 200) {
//             console.log(response.data);
//             res.status(200).json(response.data); // Send the response back to the client
//         } else {
//             console.log(response.status);
//             res.status(response.status).send('Error occurred'); // Send an error response
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error'); // Handle any exceptions
//     }
// };

// ###################################### CREATE USER #############################################################