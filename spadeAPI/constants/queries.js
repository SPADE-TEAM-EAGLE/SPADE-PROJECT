exports.selectQuery = (table, ...field) => {
  if (field.length === 1) {
    // console.log(table,field[0])
    return `SELECT * FROM ${table} WHERE ${field[0]} = ?`;
  } else if (field.length > 1) {
    return `SELECT * FROM ${table} WHERE ${field[0]} = ? and ${field[1]} = ?`;
  } else {
    return `SELECT * FROM ${table}`;
  }
};

exports.selectEmailQuery = (table, ...field) => {
  if (field.length === 1) {
    // console.log(table,field[0])
    return `SELECT email FROM ${table} WHERE ${field[0]} = ?`;
  } else if (field.length > 1) {
    return `SELECT email FROM ${table} WHERE ${field[0]} = ? and ${field[1]} = ?`;
  } else {
    return `SELECT email FROM ${table}`;
  }
};

exports.selectNameQuery = (table, col1, col2, ...field) => {
  if (field.length === 1) {
    // console.log(table,field[0])
    return `SELECT ${col1}, ${col2} FROM ${table} WHERE ${field[0]} = ?`;
  } else if (field.length > 1) {
    return `SELECT ${col1}, ${col2} FROM ${table} WHERE ${field[0]} = ? and ${field[1]} = ?`;
  } else {
    return `SELECT ${col1}, ${col2} FROM ${table}`;
  }
};

exports.selectAnyQuery = (table, col1, ...field) => {
  if (field.length === 1) {
    // console.log(table,field[0])
    return `SELECT ${col1} FROM ${table} WHERE ${field[0]} = ?`;
  } else if (field.length > 1) {
    return `SELECT ${col1} FROM ${table} WHERE ${field[0]} = ? and ${field[1]} = ?`;
  } else {
    return `SELECT ${col1} FROM ${table}`;
  }
};

exports.deleteQuery = (table, ...field) => {
  if (field.length === 1) {
    return `DELETE FROM ${table} WHERE ${field[0]} = ?`;
  } else if (field.length === 2) {
    return `DELETE FROM ${table} WHERE ${field[0]} = ? AND ${field[1]} = ?`;
  }
};
// check chat whether reciever and sender id  recieverID senderID
exports.checkChatQuery = `SELECT * FROM chats WHERE receiverID = ? AND senderId = ? OR senderId = ? AND receiverID = ?`;
exports.checkTenantsChatQuery = `SELECT * FROM chats WHERE senderId = ? AND  receiverID = ?  OR receiverID = ? AND senderId = ?  `;

// get user data by id
exports.getUserById = `SELECT * FROM users WHERE id = ?`;
// update user Active or Deactive
exports.updateUserActive = `UPDATE users SET active = ? WHERE Email = ?`;
// creat api get total properties of landlord and vacant or occupied properties using join with units table
exports.getPropertiesGraphData = `SELECT
COUNT(DISTINCT property.id) AS propertyCount,
SUM(CASE WHEN propertyunits.status = 'Vacant' THEN 1 ELSE 0 END) AS vacantCount,
SUM(CASE WHEN propertyunits.status = 'Occupied' THEN 1 ELSE 0 END) AS occupiedCount
FROM
property
LEFT JOIN
propertyunits ON property.id = propertyunits.propertyID
WHERE 
property.landlordID = ?
AND STR_TO_DATE(property.created_at, '%Y-%m-%d') >= STR_TO_DATE(?, '%Y-%m-%d')  
AND STR_TO_DATE(property.created_at, '%Y-%m-%d') <= STR_TO_DATE(?, '%Y-%m-%d'); 
`;
exports.getTaskGraphData = `SELECT
COUNT(DISTINCT task.id) AS taskCount,
SUM(CASE WHEN task.status = 'in progress' THEN 1 ELSE 0 END) AS onGoingTaskCount,
SUM(CASE WHEN task.status = 'completed' THEN 1 ELSE 0 END) AS finishedTaskCount
FROM
task
WHERE
task.landlordID = ?
AND STR_TO_DATE(task.created_at, '%Y-%m-%d') >= STR_TO_DATE(?, '%Y-%m-%d')  
AND STR_TO_DATE(task.created_at, '%Y-%m-%d') <= STR_TO_DATE(?, '%Y-%m-%d'); 
`;
// SELECT SUM(invoice.totalAmount) AS totalPaid FROM invoice
exports.getInvoiceGraphData = `
SELECT
    SUM(invoice.totalAmount) AS totalAmount,
    (SELECT SUM(invoice.totalAmount) FROM invoice WHERE invoice.status = 'paid') AS totalPaid,
    (SELECT SUM(invoice.totalAmount) FROSM invoice WHERE invoice.status = 'Unpaid') AS totalUnPaid
FROM
    invoice
WHERE
    invoice.landlordID = ?
    AND STR_TO_DATE(invoice.created_at, '%Y-%m-%d') >= STR_TO_DATE(?, '%Y-%m-%d')
    AND STR_TO_DATE(invoice.created_at, '%Y-%m-%d') <= STR_TO_DATE(?, '%Y-%m-%d');
`;
// delete all images where property id = id from propertyImage
exports.delteImageFromDb = "DELETE FROM propertyimage WHERE imageKey = ?";
exports.delteImageForInvoiceImages =
  "DELETE FROM invoiceimages WHERE imageKey = ?";
exports.delteImageForTaskImages = "DELETE FROM taskimages WHERE ImageKey = ?";

// delete invoice categories by id and landLordId
exports.deleteInvoiceCategories =
  "DELETE FROM InvoiceCategories WHERE id = ? AND landLordId = ?";
exports.deleteVendorCategories =
  "DELETE FROM vendorcategory WHERE id = ? AND landLordId = ?";

exports.updatePropertyNotifyReadUnRead =
  "UPDATE property SET notify = ?  WHERE id = ? ";
exports.updateTenantNotifyReadUnRead =
  "UPDATE tenants SET notify = ?  WHERE id = ? ";
exports.updateTaskNotifyReadUnRead =
  "UPDATE task SET notify = ?  WHERE id = ? ";
exports.updateInvoiceNotifyReadUnRead =
  "UPDATE invoice SET notify = ?  WHERE id = ? ";

exports.createInvoiceCategories =
  "INSERT INTO InvoiceCategories (categorieName,landLordId) VALUES (?,?)";
// updated category query setTaxes, catId, userId
exports.updateInvoiceCategories =
  "UPDATE InvoiceCategories SET categorieName = ?,setTaxes = ? WHERE id = ? AND landLordId = ?";

exports.getPropertyReport =
  "SELECT property.id, property.propertyName, property.propertyType,property.address,property.city,property.state,property.zipCode,property.units, tenants.firstName,tenants.lastName,tenants.email , tenants.phoneNumber FROM property JOIN tenants ON property.id = tenants.propertyID WHERE property.landlordID = ?";
exports.getTenantReport =
  "SELECT tenants.id AS tenantID, tenants.companyName, tenants.firstName, tenants.lastName,tenants.leaseStartDate,tenants.leaseEndDate,tenants.phoneNumber,property.propertyType,property.propertyName,property.id AS propertyId ,property.units FROM tenants JOIN property ON tenants.propertyID = property.id WHERE tenants.landlordID = ?";
exports.getTaskReportData =
  "SELECT task.id AS taskID, task.taskName, task.priority, task.dueDate, task.created_at, task.createdBy, task.status, vendor.lastName, vendor.firstName, property.propertyName, property.units FROM task JOIN tenants ON task.tenantID = tenants.id JOIN property ON tenants.propertyID = property.id JOIN vendor ON task.vendorID = vendor.id WHERE task.landlordID = ?";
exports.getInvoiceReportData = `SELECT
invoice.id AS invoiceID,
invoice.created_at,
invoice.totalAmount,
invoice.dueDate,
invoice.recurringNextDate,
property.propertyName,
property.address,
property.city,
property.state,
property.zipCode,
users.Phone AS userPhone, -- Assuming 'user' is the table that contains the 'Phone' column
tenants.email,
tenants.phoneNumber,
tenants.firstName,
tenants.lastName
FROM
invoice
JOIN
tenants ON tenants.id = invoice.tenantID
JOIN
property ON property.id = tenants.propertyID
JOIN
users ON users.id = tenants.landlordID -- Assuming 'user' is the table that contains the 'Phone' column
WHERE
invoice.landlordID = ?;
`;
exports.getLeaseReport =
  "SELECT tenants.firstName, tenants.lastName, tenants.leaseEndDate AS LeaseExpire, tenants.phoneNumber, property.propertyType,property.id AS propertyId ,property.propertyName, property.units FROM tenants JOIN property ON tenants.propertyID = property.id WHERE tenants.landlordID = ?";
// getTotalAmount getTotalAmountUnpaid getTotalAmountPaid getNumPropertyTenant
// get total amount from invoice table
exports.getTotalAmount =
  "SELECT SUM(invoice.totalAmount) AS totalAmount FROM invoice WHERE invoice.landlordID = ?";
// get total amount where status is unpaid
exports.getTotalAmountUnpaid =
  "SELECT SUM(invoice.totalAmount) AS totalUnPaid FROM invoice WHERE invoice.landlordID = ? AND invoice.status = 'Unpaid'";
// get total amount where status is paid
exports.getTotalAmountPaid =
  "SELECT SUM(invoice.totalAmount) AS totalPaid FROM invoice WHERE invoice.landlordID = ? AND invoice.status = 'paid'";
// get num propery and tenant of landlord
exports.getTotalAmountUnpaid =
  "SELECT SUM(invoice.totalAmount) AS totalUnPaid FROM invoice WHERE invoice.landlordID = ? AND invoice.status = 'Unpaid'";

exports.getTenantTotalAmountPaid =
  "SELECT SUM(invoice.totalAmount) AS totalPaid FROM invoice WHERE invoice.tenantID = ? AND invoice.status = 'paid'";
exports.getTenantTotalAmountUnpaid =
  "SELECT SUM(invoice.totalAmount) AS totalUnPaid FROM invoice WHERE invoice.tenantID = ? AND invoice.status = 'Unpaid'";
exports.getTenantTotalAmount =
  "SELECT SUM(invoice.totalAmount) AS totalAmount FROM invoice WHERE invoice.tenantID = ?";

exports.getNumPropertyTenant = `SELECT 
    (SELECT COUNT(property.id) FROM property WHERE property.landlordID = ?) AS propertyCount,
    (SELECT COUNT(tenants.id) FROM tenants WHERE tenants.landlordID = ?) AS tenantCount;
`;

exports.getAmountByCategoriesID =
  "SELECT InvoiceCategories.setTaxes FROM InvoiceCategories WHERE InvoiceCategories.id = ? AND InvoiceCategories.landLordId = ?";

exports.getTenantNotify = `SELECT 
tenants.id AS tenantID,
tenants.companyName, tenants.firstName, tenants.lastName, tenants.phoneNumber,tenants.tenantCreated_at, tenants.notify, property.propertyName ,property.address,property.propertyType,property.units,
GROUP_CONCAT(tenantattachfiles.Image) AS Image,
GROUP_CONCAT(tenantattachfiles.ImageKey) AS ImageKey
FROM 
tenants
LEFT JOIN
tenantattachfiles ON tenantattachfiles.tenantID = tenants.id
JOIN
    property ON property.id = tenants.propertyID
WHERE 
tenants.landlordID = ?
GROUP BY 
tenants.companyName, tenants.firstName, tenants.lastName, tenants.phoneNumber,tenantCreated_at,property.propertyName ,property.address,property.propertyType,property.units
ORDER BY 
tenantCreated_at DESC;`;

exports.getPropertyNotify = `SELECT 
    property.id AS propertyID,
    property.propertyName,
    property.address,
    property.city,
    property.propertyType,
    property.created_at,
    property.notify,
    property.city,
    GROUP_CONCAT(propertyimage.Image) AS Image,
    GROUP_CONCAT(propertyimage.ImageKey) AS ImageKey
FROM 
    property
LEFT JOIN 
    propertyimage ON property.id = propertyimage.propertyID
WHERE 
    property.landlordID = ?
GROUP BY 
    property.id, property.propertyName, property.address, property.propertyType, property.created_at
ORDER BY 
    property.created_at DESC;
`;

exports.createLead =
  "INSERT INTO leads (firstName, middleName, lastName, phoneNum,Email,propertyInfo,unitInfo,leadDetails,sourceCampaign,landlordId) VALUES (?,?,?,?,?,?,?,?,?,?)";

exports.getTaskNotify = `SELECT 
    task.id AS taskID,
    task.taskName,
    task.notify,
    task.status,
    task.priority,
    task.created_at,
    tenants.firstName,
    tenants.lastName,
    tenants.email,
    tenants.Address,
    tenants.city,
    GROUP_CONCAT(taskimages.Image) AS Image,
    GROUP_CONCAT(taskimages.ImageKey) AS ImageKey
FROM 
    task
  LEFT JOIN
    taskimages ON task.id = taskimages.taskID
JOIN 
    tenants ON task.tenantID = tenants.id
WHERE 
    task.landlordID = ?
GROUP BY 
    task.id, task.taskName, task.status, task.priority, task.created_at
ORDER BY 
    task.created_at DESC;
`;

exports.getInvoiceNotify = `SELECT 
invoice.id AS invoiceID,
invoice.invoiceType,
invoice.startDate,
invoice.notify,
invoice.endDate,
invoice.status,
invoice.totalAmount,
invoice.created_at,
tenants.firstName,
tenants.lastName,
tenants.email,
tenants.Address,
tenants.city,
GROUP_CONCAT(invoiceimages.Image) AS Image,
GROUP_CONCAT(invoiceimages.ImageKey) AS ImageKey
FROM 
invoice
LEFT JOIN
invoiceimages ON invoice.id = invoiceimages.invoiceID
JOIN
    tenants ON invoice.tenantID = tenants.id
WHERE 
invoice.landlordID = ?
GROUP BY 
invoice.id, invoice.invoiceType, invoice.status, invoice.startDate, invoice.endDate, invoice.created_at
ORDER BY 
invoice.created_at DESC;
`;

// tenant notify query
exports.getTenantPropertyNotify = `SELECT 
    property.id AS propertyID,
    property.propertyName,
    property.address,
    property.notify,
    property.propertyType,
    property.created_at,
    property.city,
    users.FirstName AS landlordFirstName,
    users.LastName AS landlordLastName,
    users.id AS landlordID,
    users.image AS landlordImage,
    GROUP_CONCAT(propertyimage.Image) AS propertyImage,
    GROUP_CONCAT(propertyimage.ImageKey) AS propertyImageKey
FROM 
    property
JOIN 
    tenants ON property.id = tenants.propertyID
JOIN 
    users ON users.id = tenants.landlordID
LEFT JOIN 
    propertyimage ON property.id = propertyimage.propertyID
WHERE 
    tenants.id = ?
GROUP BY 
    property.id, property.propertyName, property.address, property.propertyType, property.created_at
ORDER BY 
    property.created_at DESC;
`;

exports.getTenantTaskNotify = `SELECT 
    task.id AS taskID,
    task.taskName,
    task.status,
    task.priority,
    task.notify,
    task.created_at,
    tenants.firstName,
    tenants.lastName,
    tenants.email,
    tenants.Address,
    tenants.city,
    users.FirstName AS landlordFirstName,
    users.LastName AS landlordLastName,
    users.id AS landlordID,
    users.image AS landlordImage,
    GROUP_CONCAT(taskimages.Image) AS Image,
    GROUP_CONCAT(taskimages.ImageKey) AS ImageKey
FROM 
    task
JOIN 
    users ON users.id = task.landlordID
JOIN 
    tenants ON task.tenantID = tenants.id
JOIN 
    taskimages ON task.id = taskimages.taskID
WHERE 
    task.tenantID = ?
GROUP BY 
    task.id, task.taskName, task.status, task.priority, task.created_at
ORDER BY 
    task.created_at DESC;
`;

exports.getTenantInvoiceNotify = `SELECT 
invoice.id AS invoiceID,
invoice.invoiceType,
invoice.startDate,
invoice.notify,
invoice.endDate,
invoice.status,
invoice.totalAmount,
invoice.created_at,
users.FirstName AS landlordFirstName,
users.LastName AS landlordLastName,
users.id AS landlordID,
users.image AS landlordImage,
GROUP_CONCAT(invoiceimages.Image) AS Image,
GROUP_CONCAT(invoiceimages.ImageKey) AS ImageKey
FROM 
invoice
LEFT JOIN 
invoiceimages ON invoice.id = invoiceimages.invoiceID
JOIN
    users ON users.id = invoice.landlordID 
WHERE 
invoice.tenantID = ?
GROUP BY 
invoice.id, invoice.invoiceType, invoice.status, invoice.startDate, invoice.endDate, invoice.created_at
ORDER BY 
invoice.created_at DESC;
`;

// insertNotify notify
exports.insertNotify =
  "INSERT INTO notification (landlordID, emailNotification, pushNotification, textNotification) VALUES (?,?,?,?)";
exports.updateNotify =
  "UPDATE notification SET emailNotification = ? , pushNotification = ?, textNotification = ? WHERE landlordID = ? ";
exports.addResetToken =
  "UPDATE users SET token = ?, updated_at = ? where id = ?";
exports.updatePasswordLandlord =
  // "UPDATE users SET Password = ? where id = ? and token = ?";
  "UPDATE users SET Password = ? , updated_at = ? where id = ? AND token = ?";
exports.insertInUsers =
  "INSERT INTO users (id,FirstName, LastName, Email, Phone, Password, PlanID,created_at) VALUES (?,?, ?, ?, ?, ?, ?, ?)";
// updated user query
exports.updateUser =
  "UPDATE users SET FirstName = ?, LastName = ?, Email = ?, Phone = ?, updated_at = ?, BusinessName = ?, streetAddress = ?, BusinessAddress = ?, image = ? , imageKey = ? WHERE id = ?";
// update plan id in user table
exports.updatePlanId = "UPDATE users SET PlanID = ? WHERE id = ?";
exports.insertInProperty =
  "INSERT INTO property (landlordID, propertyName, address, city, state, zipCode, propertyType, propertySQFT,status,units,created_at,notify) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
exports.insertInPropertyImage =
  "INSERT INTO propertyimage (propertyID, Image, imageKey) VALUES (?,?,?)";
exports.insertInTaskImage =
  "INSERT INTO taskimages (taskID, Image, ImageKey) VALUES (?,?,?)";
exports.insertInPropertyUnits =
  "INSERT INTO propertyunits (propertyID, unitNumber,Area,unitDetails,status) VALUES (?,?,?,?,?)";
exports.updateProperty =
  "UPDATE property SET landlordID = ?, propertyName = ? , address = ? , city = ? , state = ? , zipCode = ? , propertyType = ? , propertySQFT = ? , status = ?, units = ?  WHERE id = ? ";
exports.updatePropertyUnits =
  "UPDATE propertyunits SET unitNumber = ?, Area = ?, unitDetails = ? where id = ? AND propertyID = ? ";
exports.insertTenants =
  "INSERT INTO tenants ( landlordID, firstName, lastName, companyName, email, phoneNumber, address, city, state, zipcode, propertyID, propertyUnitID, rentAmount, gross_or_triple_lease, baseRent, tripleNet, leaseStartDate, leaseEndDate, increaseRent, tenantPassword,tenantCreated_at,notify) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
// exports.UpdateTenants = 'UPDATE tenants SET landlordID = ?, firstName = ?, lastName = ?, companyName = ?, email = ?, phoneNumber = ?, address = ?, city = ?, state = ?, zipcode = ?, propertyID = ?, propertyUnitID = ?, rentAmount = ?, gross_or_triple_lease = ?, baseRent = ?, tripleNet = ?, leaseStartDate = ?, leaseEndDate = ?, increaseRent = ?, tenantPassword = ?  ';
exports.UpdateTenants =
  "UPDATE tenants SET tenantPassword = ?, tenantUpdated_at = ? WHERE id = ?  ";
exports.addResetTokenTenants =
  "UPDATE tenants SET token = ?, tenantUpdated_at = ? where id = ?";
exports.updatePasswordTenant =
  "UPDATE tenants SET tenantPassword = ? , tenantUpdated_at = ? where id = ? AND token = ?";
exports.selectPropertyTenant =
  "SELECT p.propertyName, p.address AS pAddress, p.city AS pCity, p.state AS pState, p.zipCode AS pZipCode, p.propertyType, p.propertySQFT, p.status AS pStatus,p.units AS pUnits, t.id AS tenantID ,t.firstName,t.lastName, t.companyName, t.email AS tEmail, t.phoneNumber AS tPhoneNumber, t.Address AS tAddress, t.city AS tCity, t.state AS tState, t.zipcode AS tZipcode, t.rentAmount, t.gross_or_triple_lease, t.baseRent, t.tripleNet, t.leaseStartDate, t.leaseEndDate, t.increaseRent, pu.unitNumber, pu.Area AS unitArea, pu.unitDetails, pu.status AS unitStatus FROM tenants AS t INNER JOIN property AS p ON t.propertyID = p.id INNER JOIN propertyunits AS pu ON t.propertyUnitID = pu.id WHERE t.landlordID = ? ";
exports.insertincreaseRentData =
  "INSERT INTO tenantincreaserent ( tenantID, propertyID , date, increaseRentAmount) VALUES (?,?,?,?)";
exports.updatePropertyUnitsTenant =
  "UPDATE propertyunits SET  status = ?  where id = ? AND propertyID = ? ";
exports.insertAlternatePhoneData =
  "INSERT INTO tenantalternatephone ( tenantID, phoneName , phoneNumber) VALUES (?,?,?)";
exports.insertAlternateEmailData =
  "INSERT INTO tenantalternateemail ( tenantID, emailName , alternateEmail) VALUES (?,?,?)";
exports.getUnitsCount =
  "SELECT COUNT(propertyID) as unitCount FROM `propertyunits` WHERE propertyID = ? ";
exports.insertMoreUnits =
  "INSERT INTO propertyunits (propertyID, unitNumber,Area,unitDetails,status) VALUES (?,?,?,?,?)";
exports.putUnitsUpdate = "UPDATE property SET  units = ?  where id = ? ";
exports.insertTenantAttachFile =
  "INSERT INTO tenantattachfiles (landlordID, tenantID, fileName,imageKey) VALUES (?,?,?,?)";
exports.insertInvoice =
  "INSERT INTO invoice (landlordID, tenantID, invoiceType, startDate, endDate, frequency, dueDate,daysDue, repeatTerms, terms,note,status,created_at,totalAmount, recurringNextDate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
exports.insertLineItems =
  "INSERT INTO invoicelineitems (invoiceID, category, property, memo,amount,tax) VALUES (?,?,?,?,?,?)";
exports.insertInvoiceImage =
  "INSERT INTO invoiceimages (invoiceID, Image,imageKey) VALUES (?,?,?)";
exports.updateUnitsTenant =
  "UPDATE propertyunits SET  status = ?  where id = ? ";
exports.getTenantsById = `SELECT p.id AS propertyID, p.propertyName, p.address AS pAddress, p.city AS pCity, p.state AS pState, p.zipCode AS pZipCode, p.propertyType, p.propertySQFT, p.status AS pStatus, p.units AS pUnits, t.id AS tenantID, t.landlordID, t.firstName, t.lastName, t.companyName, t.email AS tEmail, t.phoneNumber AS tPhoneNumber, t.Address AS tAddress, t.city AS tCity, t.state AS tState, t.zipcode AS tZipcode, t.rentAmount, t.gross_or_triple_lease, t.baseRent, t.tripleNet, t.leaseStartDate, t.leaseEndDate, t.increaseRent, pu.unitNumber, pu.Area AS unitArea, pu.unitDetails, pu.status AS unitStatus, GROUP_CONCAT(pi.image) AS images
FROM tenants AS t
INNER JOIN property AS p ON t.propertyID = p.id
INNER JOIN propertyunits AS pu ON t.propertyUnitID = pu.id
INNER JOIN propertyimage AS pi ON p.id = pi.propertyID
WHERE t.id = ?
GROUP BY t.id;`;
exports.updateInvoiceStatus =
  "UPDATE invoice SET  status = ?, note = ?, updated_at = ?  where id = ? AND landlordID = ? ";
exports.getAllInvoicesquery = `SELECT
i.id AS invoiceID,
i.dueDate,
i.daysDue,
i.startDate,
i.endDate,
i.repeatTerms,
i.recurringNextDate,
i.terms,
i.note,
i.totalAmount,
i.frequency,
i.created_at,
i.invoiceType,
i.status,
t.firstName,
t.lastName,
t.id AS tenantID,
t.phoneNumber AS tPhone,
p.propertyName,
JSON_ARRAYAGG(JSON_OBJECT('imageKey', ii.imageKey, 'Image', ii.Image)) AS invoiceImages
FROM
invoice AS i
JOIN tenants AS t ON i.tenantID = t.id
JOIN property AS p ON t.propertyID = p.id
LEFT JOIN invoiceimages AS ii ON i.id = ii.invoiceID
WHERE
i.landlordID = ?
GROUP BY
i.id;
`;
exports.resendEmailQuery =
  "SELECT * FROM tenants JOIN invoice ON tenants.id = invoice.tenantID WHERE invoice.id = ?";
exports.getByIdInvoicesQuery =
  "SELECT i.id as invoiceID,i.dueDate, i.daysDue , i.startDate, i.totalAmount, i.status,i.created_at, t.firstName AS tFName, t.lastName AS tLName, t.phoneNumber as tPhone, p.propertyName, pu.unitNumber, l.FirstName as landlordFName, l.LastName as landlordLName, l.phone as landlordPhone FROM invoice as i JOIN tenants as t ON i.tenantID = t.id JOIN property as p ON t.propertyID = p.id JOIN propertyunits AS pu ON t.propertyUnitID = pu.id JOIN users as l ON l.id = i.landlordID WHERE i.id = ? ";
exports.updateInvoice =
  "UPDATE invoice SET tenantID = ?, invoiceType = ? , startDate = ? , endDate = ? , frequency = ? , dueDate = ? ,daysDue=? ,repeatTerms = ? , terms = ? , totalAmount = ? , note = ? , updated_at = ? where id = ? AND landlordID = ? ";
// invoiceType, startDate, endDate, frequency, dueDays, repeatTerms, terms,totalAmount,additionalNotes,currentDate,invoiceID,userId
exports.selectAllTenantsProperty = `SELECT p.id as propertyID, p.propertyName, p.address AS pAddress, p.city AS pCity, p.state AS pState, p.zipCode AS pZipCode, p.propertyType, p.propertySQFT, p.status AS pStatus,p.units AS pUnits, t.id AS tenantID ,t.firstName,t.lastName, t.companyName, t.email AS tEmail, t.phoneNumber AS tPhoneNumber, t.Address AS tAddress, t.city AS tCity, t.state AS tState, t.zipcode AS tZipcode, t.rentAmount, t.gross_or_triple_lease, t.baseRent, t.tripleNet, t.leaseStartDate, t.leaseEndDate, t.increaseRent, pu.id as propertyUnitID ,pu.unitNumber, pu.Area AS unitArea, pu.unitDetails, pu.status AS unitStatus FROM tenants AS t INNER JOIN property AS p ON t.propertyID = p.id INNER JOIN propertyunits AS pu ON t.propertyUnitID = pu.id WHERE t.propertyID = ?`;
exports.selectAllTenants = `SELECT p.id as propertyID, p.propertyName, p.address AS pAddress, p.city AS pCity, p.state AS pState, p.zipCode AS pZipCode, p.propertyType, p.propertySQFT, p.status AS pStatus, p.units AS pUnits, i.recurringNextDate , t.id AS tenantID, t.firstName, t.lastName, t.companyName, t.email AS tEmail, t.phoneNumber AS tPhoneNumber, t.Address AS tAddress, t.city AS tCity, t.state AS tState, t.zipcode AS tZipcode, t.rentAmount, t.gross_or_triple_lease, t.baseRent, t.tripleNet, t.leaseStartDate, t.leaseEndDate, t.increaseRent, pu.id as propertyUnitID, pu.unitNumber, pu.Area AS unitArea, pu.unitDetails, pu.status AS unitStatus 
FROM tenants AS t 
INNER JOIN property AS p ON t.propertyID = p.id 
INNER JOIN propertyunits AS pu ON t.propertyUnitID = pu.id 
LEFT JOIN invoice AS i ON t.id = i.tenantID
WHERE t.landlordID = ?;
`;
exports.addTasksQuery =
  "INSERT INTO task (taskName, tenantID, dueDate,status, priority, notes, notifyTenant, notifyVendor, created_at , createdBy,landlordID) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
exports.addVendorList =
  "INSERT INTO taskassignto (taskId, vendorId) VALUES (?, ?)";
exports.addVendor =
  "INSERT INTO vendor (firstName,lastName,businessName,streetAddress,city,zip,workPhone,phone,email,categoryID,landlordID) VALUES (?, ?,?,?,?,?,?,?,?,?,?)";
exports.getVendors = `SELECT v.*, vc.category
FROM vendor v
JOIN vendorcategory vc ON v.categoryID = vc.id
WHERE v.landlordID = ?`;
// exports.getLandlordTenant = 'SELECT t.firstName,t.lastName,t.email,t.companyName,l.FirstName,l.LastName,l.Phone,l.Email FROM tenants as t JOIN invoice as i ON t.id = i.tenantID JOIN users as l ON i.landlordID = l.id WHERE i.landlordID = ? AND i.tenantID = ?';
exports.getLandlordTenant =
  "SELECT t.firstName ,t.lastName ,t.email ,t.companyName , l.FirstName , l.LastName , l.Phone , l.Email FROM tenants as t JOIN task as tsk ON t.id = tsk.tenantID JOIN users as l ON tsk.landlordID = l.id WHERE tsk.landlordID = ? AND tsk.tenantID = ?";
exports.PropertyUnitsVacant =
  'SELECT * FROM `propertyunits`WHERE propertyID = ? AND status = ? AND unitNumber !=""';
exports.Alltasks = `SELECT
tk.id,
tk.taskName,
tk.dueDate,
tk.status,
tk.priority,
tk.notes,
tk.createdBy,
tk.created_at,
p.propertyName,
pu.unitNumber,
t.firstName AS tfirstName,
t.lastName AS tlastName,
t.phoneNumber AS tenantPhone,
t.id AS tenantID,
JSON_ARRAYAGG(JSON_OBJECT('imageKey', ti.imageKey, 'Image', ti.Image)) AS taskImages
FROM
task AS tk
JOIN
tenants AS t ON tk.tenantID = t.id
JOIN
property AS p ON t.propertyID = p.id
JOIN
propertyunits AS pu ON t.propertyUnitID = pu.id
LEFT JOIN
taskimages AS ti ON tk.id = ti.taskID
WHERE
tk.landlordID = ?
GROUP BY
tk.id;
`;
exports.taskByIDQuery =
  "SELECT tk.id, tk.taskName, tk.dueDate, tk.status, tk.priority, tk.notes, tk.createdBy,tk.created_at, p.propertyName, pu.unitNumber, t.firstName as tfirstName, t.lastName as tlastName FROM `task`as tk JOIN tenants as t ON tk.tenantID = t.id JOIN property as p ON t.propertyID = p.id JOIN propertyunits as pu ON t.propertyUnitID = pu.id WHERE tk.id = ?";
exports.resendEmailQuery =
  "SELECT * FROM tenants JOIN invoice ON tenants.id = invoice.tenantID WHERE invoice.id = ?";
exports.updateTenants =
  "UPDATE tenants SET firstName = ? , lastName = ? , companyName = ? , email = ? , phoneNumber = ? , address = ? , city = ? , state = ? , zipcode = ? , propertyID = ? , propertyUnitID = ? , rentAmount = ? , gross_or_triple_lease = ? , baseRent = ? , tripleNet = ? , leaseStartDate = ? , leaseEndDate = ? , increaseRent = ? , tenantUpdated_at = ? WHERE id = ?";
exports.selectVendorCategory =
  "SELECT * FROM `vendorcategory` JOIN `vendor` ON `vendorcategory`.`id` = `vendor`.`categoryID` WHERE `vendor`.`LandlordID` = ?";

exports.propertyTaskQuery = `
SELECT 
    tk.id, tk.taskName, tk.dueDate, tk.status, tk.priority, tk.notes, tk.createdBy, tk.created_at,
    p.propertyName, p.address, pu.unitNumber,
    t.firstName AS tfirstName, t.lastName AS tlastName
FROM 
    task AS tk
JOIN 
    tenants AS t ON tk.tenantID = t.id
JOIN 
    property AS p ON t.propertyID = p.id
JOIN 
    propertyunits AS pu ON t.propertyUnitID = pu.id
WHERE 
    t.propertyID = ?
`;
exports.tenantTaskQuery =
  "SELECT tk.id, tk.taskName, tk.dueDate, tk.status, tk.priority, tk.notes, tk.createdBy,tk.created_at, p.propertyName, pu.unitNumber, t.firstName as tfirstName, t.lastName as tlastName FROM `task`as tk JOIN tenants as t ON tk.tenantID = t.id JOIN property as p ON t.propertyID = p.id JOIN propertyunits as pu ON t.propertyUnitID = pu.id where tk.tenantID  = ?";
exports.getAllInvoiceTenantQuery =
  "SELECT i.id as invoiceID, i.dueDate, i.daysDue , i.startDate,i.endDate,i.repeatTerms,i.terms ,i.note, i.totalAmount, i.frequency,i.created_at, i.invoiceType, i.status, t.firstName, t.lastName, t.id as tenantID, t.phoneNumber as tPhone, p.propertyName, GROUP_CONCAT(ii.InvoiceImage) as invoiceImages FROM invoice as i JOIN tenants as t ON i.tenantID = t.id JOIN property as p ON t.propertyID = p.id LEFT JOIN invoiceimages as ii ON i.id = ii.invoiceID WHERE i.tenantID = ? GROUP BY i.id;";
exports.AlltasksTenantsQuery = `SELECT
tk.id,
tk.taskName,
tk.dueDate,
tk.status,
tk.priority,
tk.notes,
tk.createdBy,
tk.created_at,
p.propertyName,
pu.unitNumber,
t.firstName AS tfirstName,
t.lastName AS tlastName,
t.phoneNumber AS tenantPhone,
t.id AS tenantID,
GROUP_CONCAT(ti.Image) AS ImageKey
FROM
task AS tk
JOIN
tenants AS t ON tk.tenantID = t.id
JOIN
property AS p ON t.propertyID = p.id
JOIN
propertyunits AS pu ON t.propertyUnitID = pu.id
LEFT JOIN
taskimages AS ti ON tk.id = ti.taskID
WHERE
tk.tenantID = ?
GROUP BY
tk.id;
`;
exports.updateTasksQuery =
  "UPDATE task SET taskName = ? , tenantID = ? , dueDate = ? , status = ? , priority = ? , notes = ? , notifyTenant = ? , notifyVendor = ? , updated_at = ? where id = ? ";
exports.updatePassword =
  "UPDATE users SET Password = ? , updated_at = ? where id = ? ";
exports.updatePasswordTenantSetting =
  "UPDATE tenants SET tenantPassword = ? , tenantUpdated_at = ? where id = ? ";
exports.updateEmailQuery = "UPDATE users SET Email = ? where Email = ? ";
exports.updateVerifiedStatusQuery =
  "UPDATE users SET userVerified = ? where id = ? ";
exports.recurringInvoice =
  "SELECT * FROM invoice WHERE DATE(recurringNextDate) = CURDATE() AND CURDATE() BETWEEN startDate AND endDate ";
exports.recurringInvoiceCheck =
  "SELECT * FROM invoice WHERE DATE(created_at) = CURDATE() AND landlordID = ? AND tenantID = ? AND invoiceType = ? ";

// add category in vendorcategory table
exports.addVendorCategory =
  "INSERT INTO vendorcategory (category,landLordId) VALUES (?,?)";
exports.updateVendorCategory =
  "UPDATE vendorcategory SET category=? where id=? AND landLordId=?";
// exports.createInvoiceCategories = "INSERT INTO InvoiceCategories (categorieName,landLordId) VALUES (?,?)";

// added some column fields
exports.createInvoiceCategories =
  "INSERT INTO InvoiceCategories (categorieName,landLordId,setTaxes,taxable) VALUES (?,?,?,?)";
exports.updateInvoiceCategories =
  "UPDATE InvoiceCategories SET categorieName = ?,setTaxes = ?, taxable=? WHERE id = ? AND landLordId = ?";

// =============================================chats start=====================================================================================
exports.insertChat =
  "INSERT INTO chats (senderId, receiverID, created_at) VALUES (?,?,?)";
// find already exist chat between two users
exports.findChat =
  "SELECT * FROM chats WHERE (senderId = ? AND receiverID = ?) OR (senderID = ? AND receiverID = ?)";

// create new Message in messages table
exports.insertMessage =
  "INSERT INTO messages (message,chatId,messageType, created_at,sender,userType) VALUES (?,?,?,?,?,?)";

// get all chats of user by senderId using joining chats and users table
exports.getChatUsers = `
SELECT c.id AS chatId, c.senderId, c.receiverID, c.created_at, u.id AS userId, u.FirstName, u.LastName, u.Email, u.Phone, u.image, u.imageKey FROM chats AS c
JOIN 
users AS u ON c.senderId = u.id 
WHERE c.receiverID = ?
ORDER BY c.created_at DESC`;

exports.getChatTenants = `
SELECT c.id AS chatId, c.senderId, c.receiverID, c.created_at, t.id AS tenantId, t.firstName, t.lastName, t.email, t.phoneNumber FROM chats AS c
JOIN 
tenants AS t ON c.receiverID = t.id 
WHERE c.senderId = ?
ORDER BY c.created_at DESC`;

// get all messages of chat by chatId
exports.getMessages =
  "SELECT * FROM messages WHERE chatId = ? ORDER BY created_at ASC";
