exports.invoiceHTML0 = (tenantName, dueDays, invoiceID, landlordName,businessName) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <h4>Dear <span style="  color: #1467B0; ">${tenantName},</span></h4>
        <br>
        <p>Please find attached your rent and Due Date: <b>${dueDays}</b> If you have any questions,
              please let us know. </p>
    
              <p>Have a great day and thank you for your business<b>!</b></p>
    
              <p>Sincerely</p>
              <h4>${landlordName}</h4> 
              <p>${businessName}</p>
    </body>
    </html>`;
  };
exports.invoiceHTML1 = (tenantName, dueDays, invoiceID, landlordName,businessName) => {
    return `<!doctype html>
    <html lang="en">
    
    <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
            integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    
        <title>Hello, world!</title>
    </head>
    
    <body>
        <div class="container" style="margin-top: 150px;">
            <div class="row">
                <div class="col-lg-2"></div> 
                <div class="col-lg-8 text-center" style="background: #1467b0; color: #fff; padding: 25px;">
                    <h4>Dear <span style="color: #000;">${tenantName},</span></h4>
                    <br>
                    <p>Please find attached your rent invoice with number and Due Date: <b>${dueDays}</b> If you have any questions,
                        please let us know. </p>
    
                    <p>Have a great day and thank you for your business<b>!</b></p>
    
                    <p>Sincerely</p>
                    <h4>${landlordName}</h4> 
                    <p>${businessName}</p>
    
                </div>
                
            </div>
        </div>
    
    </body>
    
    </html>`;
  };

