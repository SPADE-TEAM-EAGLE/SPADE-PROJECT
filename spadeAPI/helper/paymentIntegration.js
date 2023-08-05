const config = process.env;
const safecharge = require('safecharge');
const { request } = require('https'); // Use the built-in https module for HTTPS requests
const sha256 = require('js-sha256');
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
