const nodemailer = require("nodemailer");
const {createTransporter}=require('../helper/googleAuth')
const constants=process.env
const sendMail = async (email, mailSubject, random, name) => { 
try {
  let transpoter = await createTransporter();
    // var transpoter = nodemailer.createTransport({
    //     host: "smtp.gmail.com",
    //     port: 587,
    //     secure: false,
    //     requireTLS: true,
    //     auth: {
    //         user: "aj8706786@gmail.com",
    //         pass: "ovakebhlatasckzq"
    //     }
    // });
    var mailOptions = {
        from: constants.EMAIL_HOST,
        to: email,
        // to:"aj8706786@gmail.com",
        subject:mailSubject,
        html: `<body style="	margin: 0;
          background: #FEFEFE;
          color: #585858;
        ">
          <!-- Preivew text -->
          <span class="preheader" style="display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;border-collapse: collapse;border: 0px;"></span> 
          <!-- Carpool logo -->
          <table align="center" border="0" cellspacing="0" cellpadding="0" style="	font-size: 15px;
          line-height: 23px;
          max-width: 500px;
          min-width: 460px;
          text-align: center;
        ">
            <tbody><tr>
              <td style="	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
          vertical-align: top;
            border: none !important;
        ">
                <img src="./Logo.png" class="carpool_logo" width="232" style="	display: block;
          margin: 0 auto;
        margin: 30px auto;">
              </td>
            </tr>
            <!-- Header -->
            <tr>
              <td class="sectionlike imageless_section" style="	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
          vertical-align: top;
            border: none !important;
          background: #1672BA;
          padding-bottom: 10px;
        padding-bottom: 20px;"></td>
            </tr>
            <!-- Content -->
            <tr>
              <td class="section" style="	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
          vertical-align: top;
            border: none !important;
          background: #1672BA;
          padding: 0 20px;
        ">
                <table border="0" cellspacing="0" cellpadding="0" class="section_content" style="	font-size: 15px;
          line-height: 23px;
          max-width: 500px;
          min-width: 460px;
          text-align: center;
          width: 100%;
          background: #fff;
        ">
                  <tbody><tr>
                    <td class="section_content_padded" style="	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
          vertical-align: top;
            border: none !important;
        padding: 0 35px 40px;">
                      <h1 style="	font-size: 20px;
          font-weight: 500;
          margin-top: 40px;
          margin-bottom: 0;
          color: black;
          font-family: figtree;
        ">Hi <span style="color: #1672BA;font-weight: 700; font-size: 25px;">${name}</span>,</h1>
                      <p class="near_title last" style="margin-top: 10px;margin-bottom: 0; color: gray; font-family: figtree;">Please verify that your email address , and that you entered it when signing up for Spade Rent.</p>
                      <div style="	display: block;
          width: 100%;
          max-width: 300px;
          background: black;
          border-radius: 8px;
          color: #fff;
          font-size: 25px;
          padding: 12px 0;
          margin: 30px auto 0;
          font-weight: 700;
          letter-spacing: 20px; 
          text-decoration: none;
        " > <span >${random}</span></div>
                       
                    </td>
                  </tr>
                </tbody></table>
              </td>
            </tr>
            <!-- Signature -->
            <tr>
              <td class="section" style="	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
          vertical-align: top;
            border: none !important;
          background: #1672BA;
          padding: 0 20px;
        ">
                <table border="0" cellspacing="0" cellpadding="0" class="section_content section_zag" style="	font-size: 15px;
          line-height: 23px;
          max-width: 500px;
          min-width: 460px;
          text-align: center;
          width: 100%;
          background: #fff;
        background: #F4FBF9;">
                  <tbody><tr>
                    <td class="signature" style="	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
          vertical-align: top;
            border: none !important;
        padding: 20px;">
                      <p class="marginless" style="margin: 0; font-family: figtree;">Thank You, <br>Spade Rent Team</p>
                    </td>
                  </tr>
                </tbody></table>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td class="section dummy_row" style="	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
          vertical-align: top;
            border: none !important;
          background: #1672BA;
          padding: 0 20px;
        padding-top: 20px !important;"></td>
            </tr>
            <tr>
              <td style="	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
          vertical-align: top;
            border: none !important;
        ">
                <table border="0" cellspacing="0" cellpadding="0" class="section_content" style="	font-size: 15px;
          line-height: 23px;
          max-width: 500px;
          min-width: 460px;
          text-align: center;
          width: 100%;
          background: #fff;
        ">
                  <tbody><tr>
                    <td class="footer_like" style="	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
          vertical-align: top;
            border: none !important;
        background: #1672BA; "><img src="https://carpool-email-assets.s3.amazonaws.com/shared/footer@2x.png" alt="" width="500" class="img_section" style="	display: block;
          margin: 0 auto;
          width: 100%;
          max-width: 500px;
        "></td>
                  </tr>
                  <tr>
                    <td class="footer" style="	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
          vertical-align: top;
            border: none !important;
          padding: 0 20px 30px;
          background: #1672BA;
        ">
                      <table border="0" cellspacing="0" cellpadding="0" class="footer_content" style="	font-size: 15px;
          line-height: 23px;
          max-width: 500px;
          min-width: 460px;
          text-align: center;
          width: 100%;
          font-size: 12px;
          line-height: initial;
          color: #005750;
        ">

        </table>
                    </td>
                  </tr>
                </tbody></table>
              </td>
            </tr>
            <!-- Legal footer -->
            <tr>
              <td style="	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
          vertical-align: top;
            border: none !important;
        ">
                <p class="footer_legal" style="	padding: 20px 0 40px;
          margin: 0;
          font-size: 12px;
          color: #A5A5A5;
          line-height: 1.5;
        ">
                If you did not enter this email address when signing up for Spade Rent service, disregard this message.<br><br>
                © 2017 Google Inc. 1600 Amphitheatre Parkway, Mountain View, CA 94043
        <br><br>
        
        This is a mandatory service email from Spade Rent.
        </p>
              </td>
            </tr>
          </tbody></table>
        
        </body>`
    }

    transpoter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Error occur to send email" + error);
        } else {
            // console.log("email send sucessfully" + info.response);
            console.log("email send sucessfully");
        }
    })
}
catch (error) {
    console.log("sendmail "+error.message);
}
}
module.exports = sendMail;
