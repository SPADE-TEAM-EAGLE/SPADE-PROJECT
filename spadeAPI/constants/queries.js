exports.selectQuery = (table, ...field) => {
  if (field.length === 1) {
    // console.log(table,field[0])
    return `SELECT * FROM ${table} WHERE ${field[0]} = ?`;
  } 
  else if (field.length > 1) {
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
// check tenant invoice all paid or not
exports.checkTenantInvoicePaidQuery = `SELECT * FROM invoice WHERE tenantID = ? AND status = 'Unpaid'`;
// update isTenantAccount in tenant table by id
exports.updateTenantAccountQuery = `UPDATE tenants SET isTenantAccount = ? WHERE id = ?`;
exports.updateUserAccountQuery = `UPDATE users SET isUserAccount = ? WHERE id = ?`;

exports.deleteUserAccountData = {
  property: `DELETE FROM property WHERE landlordID = ?`,
  task: `DELETE FROM task WHERE landlordID = ?`,
  invoice: `DELETE FROM invoice WHERE landlordID = ?`,
  tenants: `DELETE FROM tenants WHERE landlordID = ?`,
  deletePropertyImages: `DELETE FROM propertyimage WHERE propertyID IN (SELECT id FROM property WHERE landlordID = ?);`,
  deletePropertyUnits: `DELETE FROM propertyunits WHERE propertyID IN (SELECT id FROM property WHERE landlordID = ?);`,
  deleteUserData: `DELETE FROM users WHERE id = ?`,
};
exports.deleteTenantAccountData = {
  task: `DELETE FROM task WHERE tenantID = ?`,
  invoice: `DELETE FROM invoice WHERE tenantID = ?`,
  deleteTenantData: `DELETE FROM tenants WHERE id = ?`,
}
exports.updateAllTenantsAccountQuery = `UPDATE tenants SET isTenantAccount = ? WHERE landlordID = ?`;
// check my all tenants invoices are paid
exports.checkMyAllTenantsInvoicePaidQuery = `SELECT * FROM invoice WHERE landlordID = ? AND status = 'Unpaid'`;
exports.checkMyAllTenantsInvoicePaidQuerytenant = `SELECT * FROM invoice WHERE tenantID = ? AND status = 'Unpaid'`;
// get user data by id
exports.getUserById = `SELECT active As isUserActive ,image,FirstName,LastName FROM users WHERE id = ?`;
// exports.getTenantById = `SELECT active As isTenantActive ,FirstName,LastName, Image FROM tenants LEFT JOIN tenantattachfiles ON tenants.id = tenantattachfiles.tenantID WHERE tenants.id = ?`;
exports.getTenantById = `SELECT active As isTenantActive ,FirstName,LastName,image FROM tenants WHERE tenants.id = ?`;
// SELECT 'user' AS type, id, email, name FROM users WHERE email = ?
// UNION
// SELECT 'tenant' AS type, id, email, name FROM tenants WHERE email = ?;

// update user Active or Deactive
exports.updateUserActive = `UPDATE users SET active = ? WHERE Email = ?`;
exports.updateTenantActive = `UPDATE tenants SET active = ? WHERE email = ?`;

// update all notify to 1 where landlord id = id
exports.updateAllNotifyReadQuery = {
  property: `UPDATE property SET notify = ? WHERE landlordID = ?`,
  task: `UPDATE task SET notify = ? WHERE landlordID = ?`,
  invoice: `UPDATE invoice SET notify = ? WHERE landlordID = ?`,
  tenants: `UPDATE tenants SET notify = ? WHERE landlordID = ?`,
};
exports.updateAllTenantNotifyReadQuery = {
  property: `UPDATE property SET tenantNotify = ? WHERE property.id = ?`,
  task: `UPDATE task SET tenantNotify = ? WHERE task.tenantID = ?`,
  invoice: `UPDATE invoice SET tenantNotify = ? WHERE invoice.tenantID = ?`,
};

// update vendor for these fields firstName,lastName,businessName,streetAddress,city,zip,workPhone,phone,email,categoryID
exports.updateVendor = `UPDATE vendor SET firstName = ?,lastName = ?,businessName = ?,streetAddress = ?,city = ?,state = ?,zip = ?,workPhone = ?,phone = ?,email = ?,categoryID = ? WHERE id = ?`;

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
AND task.created_at >= ?
AND task.created_at <= ?;
`;
exports.getTaskGraphDataByPropertyId = `
SELECT
    tenants.propertyID,
    COUNT(DISTINCT task.id) AS taskCount,
    SUM(CASE WHEN task.status = 'in progress' THEN 1 ELSE 0 END) AS onGoingTaskCount,
    SUM(CASE WHEN task.status = 'completed' THEN 1 ELSE 0 END) AS finishedTaskCount
FROM
    task
INNER JOIN
    tenants ON task.tenantID = tenants.id
WHERE
    tenants.propertyID = ? 
    AND task.landlordID = ?
    AND task.created_at >= ?
    AND task.created_at <= ?
GROUP BY
    tenants.propertyID;
`;
// SELECT SUM(invoice.totalAmount) AS totalPaid FROM invoice
exports.getInvoiceGraphData = `
SELECT
    SUM(invoice.totalAmount) AS totalAmount,
    COUNT(CASE WHEN invoice.status = 'paid' THEN 1 ELSE NULL END) AS totalPaid,
    COUNT(CASE WHEN invoice.status = 'Unpaid' THEN 1 ELSE NULL END) AS totalUnPaid
FROM
    invoice
WHERE
    invoice.landlordID = ?
    AND invoice.created_at >= ?
    AND invoice.created_at <= ?;
`;
exports.getInvoiceGraphDataByPropertyId = `
SELECT
    SUM(invoice.totalAmount) AS totalAmount,
    COUNT(CASE WHEN invoice.status = 'paid' THEN 1 ELSE 0 END) AS totalPaid,
    COUNT(CASE WHEN invoice.status = 'Unpaid' THEN 1 ELSE 0 END) AS totalUnPaid
FROM
    invoice
INNER JOIN
    tenants ON invoice.tenantID = tenants.id
WHERE
    tenants.propertyID = ?  
    AND invoice.landlordID = ?
    AND invoice.created_at >= ?
    AND invoice.created_at <= ?
GROUP BY
    tenants.propertyID;
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

exports.updateTenantPropertyNotifyReadUnRead =
  "UPDATE property SET tenantNotify = ? WHERE id = ?";
exports.updateTenantTaskNotifyReadUnRead =
  "UPDATE task SET tenantNotify = ? WHERE id = ?";
exports.updateTenantInvoiceNotifyReadUnRead =
  "UPDATE invoice SET tenantNotify = ? WHERE id = ?";

exports.createInvoiceCategories =
  "INSERT INTO InvoiceCategories (categorieName,landLordId) VALUES (?,?)";
// updated category query setTaxes, catId, userId
exports.updateInvoiceCategories =
  "UPDATE InvoiceCategories SET categorieName = ?,setTaxes = ? WHERE id = ? AND landLordId = ?";

// exports.getPropertyReport =
//   "SELECT property.id, property.propertyName, property.propertyType,property.address,property.city,property.state,property.zipCode,property.units, tenants.firstName,tenants.lastName,tenants.email , tenants.phoneNumber FROM property JOIN tenants ON property.id = tenants.propertyID WHERE property.landlordID = ?";
exports.getPropertyReport =`SELECT 
property.id,
property.propertyName,
property.propertyType,
property.address,
property.city,
property.state,
property.zipCode,
property.units,
tenants.firstName,
tenants.lastName,
tenants.email,
tenants.phoneNumber,
COALESCE(occupied_units.count, 0) as occupied_units_count,
COALESCE(vacant_units.count, 0) as vacant_units_count,
CASE 
    WHEN COALESCE(occupied_units.count, 0) > (property.units / 2) THEN 'Occupied'
    ELSE 'Vacant'
END as occupancy_status
FROM property 
JOIN tenants ON property.id = tenants.propertyID
LEFT JOIN (
SELECT propertyID, COUNT(*) as count
FROM propertyunits
WHERE status = 'Occupied'
GROUP BY propertyID
) as occupied_units ON property.id = occupied_units.propertyID
LEFT JOIN (
SELECT propertyID, COUNT(*) as count
FROM propertyunits
WHERE status = 'Vacant'
GROUP BY propertyID
) as vacant_units ON property.id = vacant_units.propertyID
WHERE property.landlordID = ?;

`
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
invoice.status,
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
exports.getPropertyDashboardData = `
  SELECT
  property.propertyCount,
  propertyunits.vacantCount,
  propertyunits.occupiedCount,
  task.onGoingTaskCount,
  task.finishedTaskCount,
  task.totalTask,
  invoice.totalAmount,
  invoice.totalPaidAmount,
  invoice.totalUnPaidAmount,
  invoice.totalPaidCount,
  invoice.totalUnPaidCount
FROM
  (SELECT
      property.id AS propertyId,
      COUNT(DISTINCT property.id) AS propertyCount
  FROM
      property
  WHERE
      property.id = ?) AS property
LEFT JOIN
  (SELECT
      propertyId,
      SUM(CASE WHEN status = 'Vacant' THEN 1 ELSE 0 END) AS vacantCount,
      SUM(CASE WHEN status = 'Occupied' THEN 1 ELSE 0 END) AS occupiedCount
  FROM
      propertyunits
  GROUP BY
      propertyId) AS propertyunits ON property.propertyId = propertyunits.propertyId
LEFT JOIN
  (SELECT
      tenants.propertyID AS propertyId,
      COUNT(CASE WHEN task.status = 'in progress' THEN 1 END) AS onGoingTaskCount,
      COUNT(CASE WHEN task.status = 'completed' THEN 1 END) AS finishedTaskCount,
      COUNT(task.id) AS totalTask
  FROM
      tenants
  LEFT JOIN
      task ON tenants.id = task.tenantID
  GROUP BY
      tenants.propertyID) AS task ON property.propertyId = task.propertyId
LEFT JOIN
  (SELECT
      tenants.propertyID AS propertyId,
      SUM(CASE WHEN invoice.status = 'paid' THEN invoice.totalAmount ELSE 0 END) AS totalPaidAmount,
      SUM(CASE WHEN invoice.status = 'Unpaid' THEN invoice.totalAmount ELSE 0 END) AS totalUnPaidAmount,
      COUNT(CASE WHEN invoice.status = 'paid' THEN 1 END) AS totalPaidCount,
      COUNT(CASE WHEN invoice.status = 'Unpaid' THEN 1 END) AS totalUnPaidCount,
      SUM(invoice.totalAmount) AS totalAmount
  FROM
      tenants
  LEFT JOIN
      invoice ON tenants.id = invoice.tenantID
  GROUP BY
      tenants.propertyID) AS invoice ON property.propertyId = invoice.propertyId;
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
    property.tenantNotify,
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
    task.tenantNotify,
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
LEFT JOIN 
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
invoice.tenantNotify,
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
`;
// ORDER BY
// invoice.created_at DESC;

// insertNotify notify
exports.insertNotify =
  "INSERT INTO notification (landlordID, emailNotification, pushNotification, textNotification) VALUES (?,?,?,?)";
exports.updateNotify = "UPDATE notification SET emailNotification = ? , pushNotification = ?, textNotification = ? WHERE landlordID = ? ";
exports.addResetToken =
  "UPDATE users SET token = ?, updated_at = ? where id = ?";
exports.addResetTokenTenant =
  "UPDATE tenants SET token = ?, tenantUpdated_at = ? where id = ?";
exports.updatePasswordLandlord =
  // "UPDATE users SET Password = ? where id = ? and token = ?";
  "UPDATE users SET Password = ? , updated_at = ? where id = ? AND token = ?";
exports.insertInUsers =
  "INSERT INTO users (id,FirstName, LastName, Email, Phone, Password, PlanID,created_at) VALUES (?,?, ?, ?, ?, ?, ?, ?)";
// updated user query
exports.updateUser =
  "UPDATE users SET FirstName = ?, LastName = ?, Email = ?, Phone = ?, updated_at = ?, BusinessName = ?, streetAddress = ?, BusinessAddress = ?, image = ?, imageKey = ?, PACity = ?, PAState = ?, PAZipcode = ?, BACity  = ?, BAState = ?, BAZipcode = ? WHERE id = ?";
// update plan id in user table
exports.updatePlanId = "UPDATE users SET PlanID = ? WHERE id = ?";
exports.insertInProperty =
  "INSERT INTO property (landlordID, propertyName, address, city, state, zipCode, propertyType, propertySQFT,status,units,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
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
  "INSERT INTO tenants ( landlordID, firstName, lastName, companyName, email, phoneNumber, address, city, state, zipcode, propertyID, propertyUnitID, rentAmount, gross_or_triple_lease, baseRent, tripleNet, leaseStartDate, leaseEndDate, increaseRent, tenantPassword,tenantCreated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
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
exports.insertTenantAttachFile = "INSERT INTO tenantattachfiles (landlordID, tenantID, Image,imageKey, uploadDate) VALUES (?,?,?,?,?)";
exports.getTenantAttachFile = "SELECT tf.id, tf.Image, tf.ImageKey, tf.uploadDate, t.firstName,t.lastName, p.propertyName, p.address, p.city, p.state, p.zipCode  FROM tenantattachfiles as tf join tenants as t ON tf.tenantID = t.id join property as p ON t.propertyID = p.id where tf.tenantID = ? ";
exports.insertInvoice =
  "INSERT INTO invoice (landlordID, tenantID, invoiceType, startDate, endDate, frequency, dueDate,daysDue, repeatTerms, terms,note,status,created_at,totalAmount,notify, recurringNextDate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
exports.insertLineItems =
  "INSERT INTO invoicelineitems (invoiceID, category, memo,amount,tax) VALUES (?,?,?,?,?)";
exports.insertInvoiceImage =
  "INSERT INTO invoiceimages (invoiceID, Image,imageKey) VALUES (?,?,?)";
exports.updateUnitsTenant =
  "UPDATE propertyunits SET  status = ?  where id = ? ";
exports.getTenantsById = `SELECT l.Phone AS landlordPhone, p.id AS propertyID, p.propertyName, p.address AS pAddress, p.city AS pCity, p.state AS pState, p.zipCode AS pZipCode, p.propertyType, p.propertySQFT, p.status AS pStatus, p.units AS pUnits, t.id AS tenantID, t.landlordID, t.firstName, t.lastName, t.companyName, i.recurringNextDate,t.email AS tEmail, t.phoneNumber AS tPhoneNumber, t.Address AS tAddress,t.image AS tenantImage ,t.city AS tCity, t.state AS tState, t.zipcode AS tZipcode, t.rentAmount, t.gross_or_triple_lease, t.baseRent, t.tripleNet, t.leaseStartDate, t.leaseEndDate, t.increaseRent, pu.unitNumber, pu.Area AS unitArea, pu.unitDetails, pu.status AS unitStatus, GROUP_CONCAT(pi.image) AS images
FROM tenants AS t
LEFT JOIN property AS p ON t.propertyID = p.id
LEFT JOIN invoice AS i ON t.id = i.tenantID
LEFT JOIN users AS l ON t.landlordID=l.id

LEFT JOIN propertyunits AS pu ON t.propertyUnitID = pu.id
LEFT JOIN propertyimage AS pi ON p.id = pi.propertyID
WHERE t.id = ?
GROUP BY t.id;`;
exports.updateTenantsProfile =
  "UPDATE tenants SET firstName = ?, lastName = ?, companyName = ?, email = ?, phoneNumber = ?, address = ?, city = ?, state = ?, zipcode = ?, Image = ?, ImageKey = ? WHERE id = ?";
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
t.companyName AS tCompany,
t.email as tEmail,
p.propertyName,
p.address,
p.city,
p.state,
p.zipCode,
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
exports.selectAllTenants = `SELECT
p.id as propertyID,
p.propertyName,
p.address AS pAddress,
p.city AS pCity,
p.state AS pState,
p.zipCode AS pZipCode,
p.propertyType,
p.propertySQFT,
p.status AS pStatus,
p.units AS pUnits,
i.recurringNextDate,
t.id AS tenantID,
t.firstName,
t.lastName,
t.companyName,
t.email AS tEmail,
t.phoneNumber AS tPhoneNumber,
t.Address AS tAddress,
t.city AS tCity,
t.state AS tState,
t.zipcode AS tZipcode,
t.rentAmount,
t.gross_or_triple_lease,
t.baseRent,
t.tripleNet,
t.leaseStartDate,
t.leaseEndDate,
t.tenantCreated_at,
t.increaseRent,
t.tenantCreated_at,
t.image,
t.active,
pu.id as propertyUnitID,
pu.unitNumber,
pu.Area AS unitArea,
pu.unitDetails,
pu.status AS unitStatus,
GROUP_CONCAT(ta.Image) AS tenantImages
FROM tenants AS t 
INNER JOIN property AS p ON t.propertyID = p.id 
INNER JOIN propertyunits AS pu ON t.propertyUnitID = pu.id 
LEFT JOIN invoice AS i ON t.id = i.tenantID
LEFT JOIN tenantattachfiles AS ta ON t.id = ta.tenantID
WHERE t.landlordID = ?
GROUP BY t.id;
`;
exports.addTasksQuery =
  "INSERT INTO task (taskName, tenantID, dueDate,status, priority, notes, notifyTenant, notifyVendor, created_at , createdBy,landlordID) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
exports.addTasksQuerytenant =
  "INSERT INTO task (taskName, tenantID, dueDate,status, priority, notes, notifyTenant, created_at , createdBy,landlordID) VALUES ( ?,?,?,?,?,?,?,?,?,?)";
exports.addVendorList =
  "INSERT INTO taskassignto (taskId, vendorId) VALUES (?, ?)";
exports.addVendor = "INSERT INTO vendor (firstName,lastName,businessName,streetAddress,city,state,zip,workPhone,phone,email,categoryID,landlordID) VALUES (?, ?,?,?,?,?,?,?,?,?,?,?)";
exports.getVendors = `SELECT v.*, vc.category
FROM vendor v
JOIN vendorcategory vc ON v.categoryID = vc.id
WHERE v.landlordID = ?`;
// exports.getLandlordTenant = 'SELECT t.firstName,t.lastName,t.email,t.companyName,l.FirstName,l.LastName,l.Phone,l.Email FROM tenants as t JOIN invoice as i ON t.id = i.tenantID JOIN users as l ON i.landlordID = l.id WHERE i.landlordID = ? AND i.tenantID = ?';
exports.getLandlordTenant =
  "SELECT t.firstName ,t.lastName ,t.email ,t.companyName , l.FirstName , l.LastName , l.Phone , l.Email FROM tenants as t JOIN task as tsk ON t.id = tsk.tenantID JOIN users as l ON tsk.landlordID = l.id WHERE tsk.landlordID = ? AND tsk.tenantID = ?";
exports.PropertyUnitsVacant =
  'SELECT * FROM `propertyunits`WHERE propertyID = ? AND status = ? AND unitNumber !=""';
// exports.Alltasks = `SELECT
// tk.id,
// tk.taskName,
// tk.dueDate,
// tk.status,
// tk.priority,
// tk.notes,
// tk.createdBy,
// tk.created_at,
// p.propertyName,
// pu.unitNumber,
// t.firstName AS tfirstName,
// t.lastName AS tlastName,
// t.phoneNumber AS tenantPhone,
// t.id AS tenantID,
// JSON_ARRAYAGG(JSON_OBJECT('imageKey', ti.imageKey, 'Image', ti.Image)) AS taskImages
// FROM
// task AS tk
// JOIN
// tenants AS t ON tk.tenantID = t.id
// JOIN
// property AS p ON t.propertyID = p.id
// JOIN
// propertyunits AS pu ON t.propertyUnitID = pu.id
// LEFT JOIN
// taskimages AS ti ON tk.id = ti.taskID
// WHERE
// tk.landlordID = ?
// GROUP BY
// tk.id;
// `;

// Those task is not included which was createdBy Tenant
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
tk.landlordID = ? AND createdBy != "Tenant"
GROUP BY
tk.id
`;
exports.AlltasksTenantsLandlord = `SELECT
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
tk.landlordID = ? AND createdBy = "Tenant"
GROUP BY
tk.id
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
  "SELECT i.id as invoiceID, i.dueDate, i.daysDue , i.startDate,i.endDate,i.repeatTerms,i.terms ,i.note, i.totalAmount, i.frequency,i.created_at, i.invoiceType, i.status, t.firstName, t.lastName, t.id as tenantID, t.phoneNumber as tPhone, p.propertyName FROM invoice as i JOIN tenants as t ON i.tenantID = t.id JOIN property as p ON t.propertyID = p.id LEFT JOIN invoiceimages as ii ON i.id = ii.invoiceID WHERE i.tenantID = ? GROUP BY i.id;";
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

// updateTenants profile data
exports.updateTenantsProfile =
  "UPDATE tenants SET firstName = ?, lastName = ?, companyName = ?, email = ?, phoneNumber = ?, Address = ?, city = ?, state = ?, zipcode = ?, Image = ?, ImageKey = ? WHERE id = ?";
  // create new Message in messages table
// exports.insertMessage =
// "INSERT INTO messages (message,chatId,messageType, created_at,sender,userType) VALUES (?,?,?,?,?,?)";
exports.insertMessage =
"INSERT INTO messages (message,chatId,messageType, created_at,sender,userType,receiverID,isRead) VALUES (?,?,?,?,?,?,?,?)";

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
exports.getMessageCount =
`select count(message) from messages where isRead = "1" AND receiverID = ?`;

exports.updateMessageCountLandlord =
`UPDATE messages SET isRead = "0" where receiverID = ? AND sender = ?`;
exports.updateMessageCount =
`UPDATE messages SET isRead = "0" where receiverID = ?`;

exports.getMessageCountByID =
`select count(message) from messages where isRead = "1" AND receiverID = ? AND sender = ?`;
// dashboard task Count
exports.taskCount = `SELECT count(CASE WHEN status = "not started" THEN 0 END ) as notStarted, COUNT(CASE WHEN status = "in progress" then 0 END ) as inProgress, COUNT(CASE WHEN status = "completed" THEN 0 END) as completed FROM spade_Rent.task WHERE landlordID = ? AND  task.created_at >= ? AND task.created_at <= ?`;

// dashboard invoice Amount
exports.invoiceAmountQuery = `SELECT
SUM(totalAmount) AS TotalAmount,
SUM(CASE WHEN status = "paid" THEN totalAmount ELSE 0 END) AS TotalDeposit,
SUM(CASE WHEN status = "uncollectible" OR status = "Unpaid" THEN totalAmount ELSE 0 END) AS PendingBalance
FROM spade_Rent.invoice
WHERE landlordID = ? AND invoice.created_at >= ? AND invoice.created_at <= ?`;
exports.getPropertyDashboardData = `
SELECT
property.propertyCount,
propertyunits.vacantCount,
propertyunits.occupiedCount,
task.onGoingTaskCount,
task.finishedTaskCount,
task.totalTask,
invoice.totalAmount,
invoice.totalPaidAmount,
  invoice.totalUnPaidAmount,
  invoice.totalPaidCount,
  invoice.totalUnPaidCount
FROM
  (SELECT
      property.id AS propertyId,
      COUNT(DISTINCT property.id) AS propertyCount
  FROM
      property
  WHERE
      property.id = ?) AS property
LEFT JOIN
  (SELECT
      propertyId,
      SUM(CASE WHEN status = 'Vacant' THEN 1 ELSE 0 END) AS vacantCount,
      SUM(CASE WHEN status = 'Occupied' THEN 1 ELSE 0 END) AS occupiedCount
      FROM
      propertyunits
      GROUP BY
      propertyId) AS propertyunits ON property.propertyId = propertyunits.propertyId
LEFT JOIN
  (SELECT
      tenants.propertyID AS propertyId,
      COUNT(CASE WHEN task.status = 'in progress' THEN 1 END) AS onGoingTaskCount,
      COUNT(CASE WHEN task.status = 'completed' THEN 1 END) AS finishedTaskCount,
      COUNT(task.id) AS totalTask
      FROM
      tenants
  LEFT JOIN
      task ON tenants.id = task.tenantID
  GROUP BY
  tenants.propertyID) AS task ON property.propertyId = task.propertyId
  LEFT JOIN
  (SELECT
      tenants.propertyID AS propertyId,
      SUM(CASE WHEN invoice.status = 'paid' THEN invoice.totalAmount ELSE 0 END) AS totalPaidAmount,
      SUM(CASE WHEN invoice.status = 'Unpaid' THEN invoice.totalAmount ELSE 0 END) AS totalUnPaidAmount,
      COUNT(CASE WHEN invoice.status = 'paid' THEN 1 END) AS totalPaidCount,
      COUNT(CASE WHEN invoice.status = 'Unpaid' THEN 1 END) AS totalUnPaidCount,
      SUM(invoice.totalAmount) AS totalAmount
  FROM
  tenants
  LEFT JOIN
  invoice ON tenants.id = invoice.tenantID
  GROUP BY
  tenants.propertyID) AS invoice ON property.propertyId = invoice.propertyId;
`;
exports.getAllTenantsQuery = `SELECT DISTINCT tenants.firstName, tenants.lastName, tenants.email
FROM tenants
JOIN invoice ON tenants.id = invoice.tenantID
WHERE invoice.landlordID = ? AND invoice.status = 'paid';
`;
exports.getLandlordDetailedQuery = `SELECT DISTINCT users.FirstName, users.LastName, users.Email
FROM users
JOIN invoice ON users.id = invoice.landlordID
WHERE invoice.tenantID = ? AND invoice.status = 'paid';
`;

exports.updateAllStatusVacantQuery = `UPDATE propertyunits, tenants SET propertyunits.status = ? WHERE tenants.propertyID = propertyunits.propertyID AND tenants.id = ?`;
exports.unpaidAmountQuery = `SELECT SUM(totalAmount) AS totalAmount FROM spade_Rent.invoice WHERE tenantID = ? AND status = 'Unpaid'`;
exports.updateAuthQueryTenant=`UPDATE tenants SET auth = ? WHERE id = ?`;
exports.updateAuthQuery=`UPDATE users SET auth = ? WHERE id = ?`;
exports.updateEmailTemplates = "UPDATE users SET tenantEmail = ? , invoiceEmail = ?, taskEmail = ?, userEmail = ? WHERE id = ? ";
exports.updateEmailTemplates = "UPDATE users SET tenantEmail = ? , invoiceEmail = ?, taskEmail = ?, userEmail = ? WHERE id = ? ";
exports.addProspectusQuery = "INSERT INTO prospectus (landlordId,firstName,lastName,phoneNumber,email,propertyInfo,unitInfo,prospectDetail,sourceCampaign,moveDate,rentAmount,prospectusStatus,createdDate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
exports.getProspectusByIdQuery = `SELECT p.propertyName, p.address, p.city, p.state, p.zipCode, pu.unitNumber, pu.Area, pu.unitDetails, pu.status, (SELECT count(unitNumber) from propertyunits WHERE propertyID = p.id )as totalunits , (SELECT count(unitNumber) from propertyunits WHERE status = "Occupied" AND propertyID = p.id )as totalOccupied,  (SELECT count(unitNumber) from propertyunits WHERE status = "Vacant" AND propertyID = p.id )as totalVacant FROM property as p join propertyunits as pu on pu.propertyID = p.id where p.id = ? and pu.id = ?`;
exports.UpdateProspectusQuery = "UPDATE prospectus set firstName = ? , lastName = ? , phoneNumber = ? , email = ? , propertyInfo = ? , unitInfo = ? , prospectDetail = ? , sourceCampaign = ? , rentAmount = ? , prospectusStatus = ? , updatedDate = ? WHERE id = ?";
exports.UpdateProspectusStatusQuery = "UPDATE prospectus set prospectusStatus = ? , updatedDate = ? WHERE id = ?";
// exports.prospectusInsightQD = "SELECT SUM(CASE WHEN prospectusStatus = 'DisQualified' THEN 1 ELSE 0 END) AS disqualified, SUM(CASE WHEN prospectusStatus = 'Qualified' THEN 1 ELSE 0 END) AS Qualified FROM spade_Rent.prospectus WHERE landlordId = ? AND createdDate >= ? AND createdDate <= ? ";
exports.prospectusInsightQD = "WITH Months AS (SELECT 1 AS Month UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 ) SELECT m.Month AS Month, COALESCE(SUM(CASE WHEN p.prospectusStatus = 'DisQualified' THEN 1 ELSE 0 END), 0) AS Disqualified, COALESCE(SUM(CASE WHEN p.prospectusStatus = 'Qualified' THEN 1 ELSE 0 END), 0) AS Qualified FROM Months m LEFT JOIN spade_Rent.prospectus p ON m.Month = EXTRACT(MONTH FROM p.createdDate) AND EXTRACT(YEAR FROM p.createdDate) = ? AND p.landlordId = ? GROUP BY m.Month ORDER BY m.Month";
exports.prospectusInsightEN = "SELECT count(prospectusStatus) as totalProspectus, SUM(CASE WHEN prospectusStatus = 'Engaged' THEN 1 ELSE 0 END) AS Engaged, SUM(CASE WHEN prospectusStatus = 'Nurturing' THEN 1 ELSE 0 END) AS Nurturing FROM spade_Rent.prospectus WHERE landlordId = ? AND createdDate >= ? AND createdDate <= ?";
exports.propertyUnitCount = "SELECT *, sum(CASE WHEN propertyunits.status = 'Vacant' then 1 else 0 END ) as Vacant, sum(CASE WHEN propertyunits.status = 'Occupied' then 1 else 0 END ) as Occupied FROM spade_Rent.propertyunits where propertyID = ? ";
// exports.updateBusinessLogo = "UPDATE users SET businessLogo = ? , businessLogoKey = ? where id = ? ";
exports.updateBusinessLogo = "UPDATE users SET businessLogo = ? where id = ? ";
exports.updateUserEmail =
"UPDATE users SET Email = ?, updated_at = ? where id = ?";
exports.checkProperty = "SELECT * FROM property where propertyName = ? AND address = ? AND landlordID = ? ";
exports.prospectusTimeQuery = "SELECT firstName, lastName, prospectusStatus, email FROM spade_Rent.prospectus WHERE  landlordId = ? AND createdDate >= ? AND createdDate <= ? ";
exports.checkUpaidInvoiceQuery = `SELECT firstName, lastName, email FROM tenants join invoice on tenants.id = invoice.tenantID WHERE invoice.tenantID = ? AND invoice.status = 'Unpaid'`;
exports.addProspectusSources = "INSERT INTO prospectusSources (landlordId,sourcesCampaign) VALUES (?,?)";
exports.sourcesCampaignInsight = "SELECT COUNT(*) AS campaignCount, CASE WHEN ps.sourcesCampaign IS NOT NULL THEN ps.sourcesCampaign ELSE 'NotFound' END AS sourceCampaign FROM prospectus p LEFT JOIN prospectusSources ps ON p.sourceCampaign = ps.id WHERE p.landlordId = ? AND p.createdDate >= ? AND p.createdDate <= ? GROUP BY p.sourceCampaign ORDER BY p.sourceCampaign DESC";
exports.dashboardProspectusInsight = "SELECT prospectusStatus, COUNT(*) AS count FROM prospectus GROUP BY prospectusStatus HAVING prospectusStatus IN ('qualified', 'disqualified') UNION ALL SELECT 'Active' AS prospectusStatus, COUNT(*) AS count FROM prospectus WHERE prospectusStatus NOT IN ('Qualified', 'Disqualified') AND landlordId = ? AND createdDate >= ? AND createdDate <= ?";
