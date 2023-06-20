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

exports.addResetToken =
  "UPDATE users SET token = ?, updated_at = ? where id = ?";
exports.updatePassword =
  "UPDATE users SET Password = ? where id = ? and token = ?";
exports.insertInUsers =
  "INSERT INTO users (id,FirstName, LastName, Email, Phone, Password, PlanID) VALUES (?,?, ?, ?, ?, ?, ?)";
exports.insertInProperty =
  "INSERT INTO property (landlordID, propertyName, address, city, state, zipCode, propertyType, propertySQFT,status,units) VALUES (?,?,?,?,?,?,?,?,?,?)";
exports.insertInPropertyImage = "INSERT INTO propertyimage (propertyID, Image) VALUES (?,?)";
exports.insertInTaskImage =
"INSERT INTO taskimages (taskID, taskImages) VALUES (?,?)";
exports.insertInPropertyUnits =
  "INSERT INTO propertyunits (propertyID, unitNumber,Area,unitDetails,status) VALUES (?,?,?,?,?)";
exports.updateProperty =
  "UPDATE property SET landlordID = ?, propertyName = ? , address = ? , city = ? , state = ? , zipCode = ? , propertyType = ? , propertySQFT = ? , status = ?, units = ?  WHERE id = ? ";
exports.updatePropertyUnits =
  "UPDATE propertyunits SET unitNumber = ?, Area = ?, unitDetails = ? where id = ? AND propertyID = ? ";
exports.insertTenants = "INSERT INTO tenants ( landlordID, firstName, lastName, companyName, email, phoneNumber, address, city, state, zipcode, propertyID, propertyUnitID, rentAmount, gross_or_triple_lease, baseRent, tripleNet, leaseStartDate, leaseEndDate, increaseRent, tenantPassword,tenantCreated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
// exports.UpdateTenants = 'UPDATE tenants SET landlordID = ?, firstName = ?, lastName = ?, companyName = ?, email = ?, phoneNumber = ?, address = ?, city = ?, state = ?, zipcode = ?, propertyID = ?, propertyUnitID = ?, rentAmount = ?, gross_or_triple_lease = ?, baseRent = ?, tripleNet = ?, leaseStartDate = ?, leaseEndDate = ?, increaseRent = ?, tenantPassword = ?  ';
exports.UpdateTenants = 'UPDATE tenants SET tenantPassword = ?, tenantUpdated_at = ? WHERE id = ?  ';
exports.addResetTokenTenants ='UPDATE tenants SET token = ?, tenantUpdated_at = ? where id = ?';
exports.updatePasswordTenant ="UPDATE tenants SET tenantPassword = ? , tenantUpdated_at = ? where id = ? AND token = ?";
exports.selectPropertyTenant = "SELECT p.propertyName, p.address AS pAddress, p.city AS pCity, p.state AS pState, p.zipCode AS pZipCode, p.propertyType, p.propertySQFT, p.status AS pStatus,p.units AS pUnits, t.id AS tenantID ,t.firstName,t.lastName, t.companyName, t.email AS tEmail, t.phoneNumber AS tPhoneNumber, t.Address AS tAddress, t.city AS tCity, t.state AS tState, t.zipcode AS tZipcode, t.rentAmount, t.gross_or_triple_lease, t.baseRent, t.tripleNet, t.leaseStartDate, t.leaseEndDate, t.increaseRent, pu.unitNumber, pu.Area AS unitArea, pu.unitDetails, pu.status AS unitStatus FROM tenants AS t INNER JOIN property AS p ON t.propertyID = p.id INNER JOIN propertyunits AS pu ON t.propertyUnitID = pu.id WHERE t.landlordID = ? ";
exports.insertincreaseRentData = 'INSERT INTO tenantincreaserent ( tenantID, propertyID , date, increaseRentAmount) VALUES (?,?,?,?)';
exports.updatePropertyUnitsTenant = 'UPDATE propertyunits SET  status = ?  where id = ? AND propertyID = ? ';
exports.insertAlternatePhoneData = 'INSERT INTO tenantalternatephone ( tenantID, phoneName , phoneNumber) VALUES (?,?,?)';
exports.insertAlternateEmailData = 'INSERT INTO tenantalternateemail ( tenantID, emailName , alternateEmail) VALUES (?,?,?)';
exports.getUnitsCount = 'SELECT COUNT(propertyID) as unitCount FROM `propertyunits` WHERE propertyID = ? ';
exports.insertMoreUnits='INSERT INTO propertyunits (propertyID, unitNumber,Area,unitDetails,status) VALUES (?,?,?,?,?)';
exports.putUnitsUpdate = 'UPDATE property SET  units = ?  where id = ? ';
exports.insertTenantAttachFile ='INSERT INTO tenantattachfiles (landlordID, tenantID, fileName) VALUES (?,?,?)';
exports.insertInvoice ='INSERT INTO invoice (landlordID, tenantID, invoiceType, startDate, endDate, frequency, dueDate,daysDue, repeatTerms, terms,note,status,created_at,totalAmount) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
exports.insertLineItems ='INSERT INTO invoicelineitems (invoiceID, category, property, memo, amount ) VALUES (?,?,?,?,?)';
exports.insertInvoiceImage ='INSERT INTO invoiceimages (invoiceID, InvoiceImage) VALUES (?,?)';
exports.updateUnitsTenant = 'UPDATE propertyunits SET  status = ?  where id = ? ';
exports.getTenantsById = `SELECT p.id AS propertyID, p.propertyName, p.address AS pAddress, p.city AS pCity, p.state AS pState, p.zipCode AS pZipCode, p.propertyType, p.propertySQFT, p.status AS pStatus, p.units AS pUnits, t.id AS tenantID, t.firstName, t.lastName, t.companyName, t.email AS tEmail, t.phoneNumber AS tPhoneNumber, t.Address AS tAddress, t.city AS tCity, t.state AS tState, t.zipcode AS tZipcode, t.rentAmount, t.gross_or_triple_lease, t.baseRent, t.tripleNet, t.leaseStartDate, t.leaseEndDate, t.increaseRent, pu.unitNumber, pu.Area AS unitArea, pu.unitDetails, pu.status AS unitStatus, GROUP_CONCAT(pi.image) AS images
FROM tenants AS t
INNER JOIN property AS p ON t.propertyID = p.id
INNER JOIN propertyunits AS pu ON t.propertyUnitID = pu.id
INNER JOIN propertyimage AS pi ON p.id = pi.propertyID
WHERE t.id = ?
GROUP BY t.id;`;
exports.updateInvoiceStatus = 'UPDATE invoice SET  status = ?, note = ?, updated_at = ?  where id = ? AND landlordID = ? ';
exports.getAllInvoicesquery = 'SELECT i.id as invoiceID, i.dueDate, i.daysDue , i.startDate,i.endDate,i.repeatTerms,i.terms ,i.note, i.totalAmount, i.frequency,i.created_at, i.invoiceType, i.status, t.firstName, t.lastName, t.id as tenantID, t.phoneNumber as tPhone, p.propertyName, GROUP_CONCAT(ii.InvoiceImage) as invoiceImages FROM invoice as i JOIN tenants as t ON i.tenantID = t.id JOIN property as p ON t.propertyID = p.id LEFT JOIN invoiceimages as ii ON i.id = ii.invoiceID WHERE i.landlordID = ? GROUP BY i.id';
exports.resendEmailQuery = 'SELECT * FROM tenants JOIN invoice ON tenants.id = invoice.tenantID WHERE invoice.id = ?';
exports.getByIdInvoicesQuery = 'SELECT i.id as invoiceID,i.dueDate, i.daysDue , i.startDate, i.totalAmount, i.status,i.created_at, t.firstName AS tFName, t.lastName AS tLName, t.phoneNumber as tPhone, p.propertyName, pu.unitNumber, l.FirstName as landlordFName, l.LastName as landlordLName, l.phone as landlordPhone FROM invoice as i JOIN tenants as t ON i.tenantID = t.id JOIN property as p ON t.propertyID = p.id JOIN propertyunits AS pu ON t.propertyUnitID = pu.id JOIN users as l ON l.id = i.landlordID WHERE i.id = ? ';
exports.updateInvoice = 'UPDATE invoice SET tenantID = ?, invoiceType = ? , startDate = ? , endDate = ? , frequency = ? , dueDate = ? ,daysDue=? ,repeatTerms = ? , terms = ? , totalAmount = ? , note = ? , updated_at = ? where id = ? AND landlordID = ? ';
// invoiceType, startDate, endDate, frequency, dueDays, repeatTerms, terms,totalAmount,additionalNotes,currentDate,invoiceID,userId
exports.selectAllTenants = `SELECT p.id as propertyID, p.propertyName, p.address AS pAddress, p.city AS pCity, p.state AS pState, p.zipCode AS pZipCode, p.propertyType, p.propertySQFT, p.status AS pStatus,p.units AS pUnits, t.id AS tenantID ,t.firstName,t.lastName, t.companyName, t.email AS tEmail, t.phoneNumber AS tPhoneNumber, t.Address AS tAddress, t.city AS tCity, t.state AS tState, t.zipcode AS tZipcode, t.rentAmount, t.gross_or_triple_lease, t.baseRent, t.tripleNet, t.leaseStartDate, t.leaseEndDate, t.increaseRent, pu.id as propertyUnitID ,pu.unitNumber, pu.Area AS unitArea, pu.unitDetails, pu.status AS unitStatus FROM tenants AS t INNER JOIN property AS p ON t.propertyID = p.id INNER JOIN propertyunits AS pu ON t.propertyUnitID = pu.id WHERE t.landlordID = ?`;
exports.addTasksQuery = "INSERT INTO task (taskName, tenantID, dueDate,status, priority, notes, notifyTenant, notifyVendor, created_at , createdBy) VALUES (?,?,?,?,?,?,?,?,?,?)";
exports.addVendorList = "INSERT INTO taskassignto (taskId, vendorId) VALUES (?, ?)";
// exports.getLandlordTenant = 'SELECT t.firstName,t.lastName,t.email,t.companyName,l.FirstName,l.LastName,l.Phone,l.Email FROM tenants as t JOIN invoice as i ON t.id = i.tenantID JOIN users as l ON i.landlordID = l.id WHERE i.landlordID = ? AND i.tenantID = ?';
exports.getLandlordTenant = 'SELECT t.firstName ,t.lastName ,t.email ,t.companyName , l.FirstName , l.LastName , l.Phone , l.Email FROM tenants as t JOIN task as tsk ON t.id = tsk.tenantID JOIN users as l ON tsk.landlordID = l.id WHERE tsk.landlordID = ? AND tsk.tenantID = ?';
exports.PropertyUnitsVacant = 'SELECT * FROM `propertyunits`WHERE propertyID = ? AND status = ? AND unitNumber !=""';
exports.Alltasks = 'SELECT tk.id, tk.taskName, tk.dueDate, tk.status, tk.priority, tk.notes, tk.createdBy,tk.created_at, p.propertyName, pu.unitNumber, t.firstName as tfirstName, t.lastName as tlastName FROM `task`as tk JOIN tenants as t ON tk.tenantID = t.id JOIN property as p ON t.propertyID = p.id JOIN propertyunits as pu ON t.propertyUnitID = pu.id WHERE tk.landlordID = ?';
exports.taskByIDQuery = 'SELECT tk.id, tk.taskName, tk.dueDate, tk.status, tk.priority, tk.notes, tk.createdBy,tk.created_at, p.propertyName, pu.unitNumber, t.firstName as tfirstName, t.lastName as tlastName FROM `task`as tk JOIN tenants as t ON tk.tenantID = t.id JOIN property as p ON t.propertyID = p.id JOIN propertyunits as pu ON t.propertyUnitID = pu.id WHERE tk.id = ?';
exports.resendEmailQuery = 'SELECT * FROM tenants JOIN invoice ON tenants.id = invoice.tenantID WHERE invoice.id = ?';
exports.updateTenants = "UPDATE tenants SET firstName = ? , lastName = ? , companyName = ? , email = ? , phoneNumber = ? , address = ? , city = ? , state = ? , zipcode = ? , propertyID = ? , propertyUnitID = ? , rentAmount = ? , gross_or_triple_lease = ? , baseRent = ? , tripleNet = ? , leaseStartDate = ? , leaseEndDate = ? , increaseRent = ? , tenantUpdated_at = ? WHERE id = ?";
exports.updateTasksQuery = "UPDATE task SET taskName = ? , tenantID = ? , dueDate = ? , status = ? , priority = ? , notes = ? , notifyTenant = ? , notifyVendor = ? , updated_at = ? where id = ? ";
exports.selectVendorCategory = "SELECT * FROM `vendorcategory` JOIN `vendor` ON `vendorcategory`.`id` = `vendor`.`categoryID` WHERE `vendor`.`LandlordID` = ?";
exports.propertyTaskQuery = "SELECT tk.id, tk.taskName, tk.dueDate, tk.status, tk.priority, tk.notes, tk.createdBy,tk.created_at, p.propertyName, pu.unitNumber, t.firstName as tfirstName, t.lastName as tlastName FROM `task`as tk JOIN tenants as t ON tk.tenantID = t.id JOIN property as p ON t.propertyID = p.id JOIN propertyunits as pu ON t.propertyUnitID = pu.id WHERE t.propertyID = ?";
exports.tenantTaskQuery = "SELECT tk.id, tk.taskName, tk.dueDate, tk.status, tk.priority, tk.notes, tk.createdBy,tk.created_at, p.propertyName, pu.unitNumber, t.firstName as tfirstName, t.lastName as tlastName FROM `task`as tk JOIN tenants as t ON tk.tenantID = t.id JOIN property as p ON t.propertyID = p.id JOIN propertyunits as pu ON t.propertyUnitID = pu.id where tk.tenantID  = ?";
exports.getAllInvoiceTenantQuery = "SELECT i.id as invoiceID, i.dueDate, i.daysDue , i.startDate,i.endDate,i.repeatTerms,i.terms ,i.note, i.totalAmount, i.frequency,i.created_at, i.invoiceType, i.status, t.firstName, t.lastName, t.id as tenantID, t.phoneNumber as tPhone, p.propertyName, GROUP_CONCAT(ii.InvoiceImage) as invoiceImages FROM invoice as i JOIN tenants as t ON i.tenantID = t.id JOIN property as p ON t.propertyID = p.id LEFT JOIN invoiceimages as ii ON i.id = ii.invoiceID WHERE i.tenantID = ? GROUP BY i.id;";

