exports.taskHTML0 = (
    tenantName,
    dueDays,
    taskName,
    assignedTo,
    priority,
    landlordName,
    companyName,
    landLordContactInformation
  ) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Quicksand&display=swap" rel="stylesheet">
        <title>Document</title>
        <style>
        body {
          font-family: 'Quicksand', sans-serif;
          width: 100%;
          height: 100%;        
          background: #fff;
          font-size: 18px;
          height: 100vh;
          max-width: 80%;
          margin: 20px auto;
          padding: 10px;    
          font-weight: 600;    
        }   
        
        div {
          background-color: aliceblue;
          padding: 20px 10px;
          border-radius: 10px;
        }
  
        ol {
          margin-left: -25px;
        }
        </style>
        
    </head>
    <body>
    <div>
     <center><img alt="Spade Rent" src="https://res.cloudinary.com/djhjn0ngj/image/upload/v1685012561/Logo_2_is7u6m.png" width="155" style="
    margin-bottom: 15px;
    "></center>            
        <h4>Dear <span style="  color: #1467B0; ">${tenantName},</span></h4>
        <p>We hope this email finds you well. We wanted to remind you of some upcoming property maintenance tasks that are
        scheduled in the near future. These tasks are important for maintaining the quality and safety of our property.
        </p>
        
        <p>Please take note of the following maintenance tasks:</p>
        <ul type="none" style="none">
        <li>
          <p>Date: <b>${dueDays}</b></p>
          <p>Task: <b>${taskName}</b></p>
          <p>Assigned To: <b>${assignedTo}</b></p>
          <p>Priority: <b>${priority}</b></p>
        </li>
        </ul>
        
        <p>
        It is crucial that these tasks are completed to ensure the smooth operation and longevity of the property. We kindly request
      your cooperation in allowing our maintenance team to access the premises during the designated time for efficient
      completion of these tasks.
        </p>
        
        <p>
        Should you have any questions or concerns regarding these maintenance tasks or need to reschedule, please don't hesitate
        to contact our property management team at <b>${landLordContactInformation}</b>. We are here to assist you.
        </p>
        
        <p>
        Thank you for your cooperation in keeping our property well-maintained and safe for everyone. We appreciate your attention
        to this matter.
        </p>
        
        <p>
        Best regards,
        </p>
        
        <h4><span style="  color: #1467B0; ">${landlordName},</span></h4>
        <h4><span style="  color: #1467B0; ">${companyName},</span></h4>
      </div>
    </body>
    </html>`;
  };
exports.taskHTML1 = (
    
    tenantName,
    dueDays,
    taskName,
    assignedTo,
    priority,
    landlordName,
    companyName,
    landLordContactInformation
  ) => {
    return `

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Quicksand&display=swap" rel="stylesheet">
        <title>Document</title>
        <style>
        body {
          font-family: 'Quicksand', sans-serif;
          width: 100%;
          height: 100%;        
          background: #fff;
          font-size: 18px;
          height: 100vh;
          max-width: 80%;
          margin: 20px auto;
          padding: 10px;    
          font-weight: 600;    
        }   
        
        div {
          background-color: aliceblue;
          padding: 20px 10px;
          border-radius: 10px;
        }
  
        ol {
          margin-left: -25px;
        }
        </style>
        
    </head>
    <body>
  
      <div style="text-align: center;">
          <center><img alt="Spade Rent" src="https://res.cloudinary.com/djhjn0ngj/image/upload/v1685012561/Logo_2_is7u6m.png" width="155" style="
         margin-bottom: 15px;
         "></center>            
               <td><img src="../assets/images/task-update-template.jpg" alt="" style="height: 150px; width: 100%; margin-bottom: 20px; border-radius: 25px;"></td>
  
             <h4>Dear <span style="  color: #1467B0; ">${tenantName},</span></h4>
             <p>We hope this email finds you well. We wanted to remind you of some upcoming property maintenance tasks that are
             scheduled in the near future. These tasks are important for maintaining the quality and safety of our property.
             </p>
             
             <p>Please take note of the following maintenance tasks:</p>
             <ul type="none" >
             <li>
               <p>Date: <b>${dueDays}</b></p>
               <p>Task: <b>${taskName}</b></p>
               <p>Assigned To: <b>${assignedTo}</b></p>
               <p>Priority: <b>${priority}</b></p>
             </li>
             </ul>
             
             <p>
             It is crucial that these tasks are completed to ensure the smooth operation and longevity of the property. We kindly request
           your cooperation in allowing our maintenance team to access the premises during the designated time for efficient
           completion of these tasks.
             </p>
             
             <p>
             Should you have any questions or concerns regarding these maintenance tasks or need to reschedule, please don't hesitate
             to contact our property management team at <b>${landLordContactInformation}</b>. We are here to assist you.
             </p>
             
             <p>
             Thank you for your cooperation in keeping our property well-maintained and safe for everyone. We appreciate your attention
             to this matter.
             </p>
             
             <p>
             Best regards,
             </p>
             
             <h4><span style="  color: #1467B0; ">${landlordName},</span></h4>
             <h4><span style="  color: #1467B0; ">${companyName},</span></h4>
           </div>
    </body>
    </html>

    `;
  };