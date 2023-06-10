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
exports.insertInPropertyImage =
  "INSERT INTO propertyimage (propertyID, Image) VALUES (?,?)";
exports.insertInTaskImage =
  "INSERT INTO taskimages (taskID, taskImages) VALUES (?,?)";
exports.insertInPropertyUnits =
  "INSERT INTO propertyunits (propertyID, unitNumber,Area,unitDetails,status) VALUES (?,?,?,?,?)";
exports.updateProperty =
  "UPDATE property SET landlordID = ?, propertyName = ? , address = ? , city = ? , state = ? , zipCode = ? , propertyType = ? , propertySQFT = ? , status = ?, units = ?  WHERE id = ? ";
exports.updatePropertyUnits =
  "UPDATE propertyunits SET unitNumber = ?, Area = ?, unitDetails = ?, status = ?  where id = ? AND propertyID = ? ";
exports.insertTenants =
  "INSERT INTO tenants ( landlordID, firstName, lastName, companyName, email, phoneNumber, address, city, state, zipcode, propertyID, propertyUnitID, rentAmount, gross_or_triple_lease, baseRent, tripleNet, leaseStartDate, leaseEndDate, increaseRent, tenantPassword,tenantCreated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
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
exports.insertInvoice ='INSERT INTO invoice (landlordID, tenantID, invoiceType, startDate, endDate, frequency, dueDate, repeatTerms, terms,note,status,created_at,totalAmount) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
exports.insertLineItems ='INSERT INTO invoicelineitems (invoiceID, category, property, memo, amount ) VALUES (?,?,?,?,?)';
exports.insertInvoiceImage ='INSERT INTO invoiceimages (invoiceID, InvoiceImage) VALUES (?,?)';
exports.updateUnitsTenant = 'UPDATE propertyunits SET  status = ?  where id = ? ';
exports.getTenantsById = "SELECT p.id as propertyID, p.propertyName, p.address AS pAddress, p.city AS pCity, p.state AS pState, p.zipCode AS pZipCode, p.propertyType, p.propertySQFT, p.status AS pStatus,p.units AS pUnits, t.id AS tenantID ,t.firstName,t.lastName, t.companyName, t.email AS tEmail, t.phoneNumber AS tPhoneNumber, t.Address AS tAddress, t.city AS tCity, t.state AS tState, t.zipcode AS tZipcode, t.rentAmount, t.gross_or_triple_lease, t.baseRent, t.tripleNet, t.leaseStartDate, t.leaseEndDate, t.increaseRent, pu.unitNumber, pu.Area AS unitArea, pu.unitDetails, pu.status AS unitStatus FROM tenants AS t INNER JOIN property AS p ON t.propertyID = p.id INNER JOIN propertyunits AS pu ON t.propertyUnitID = pu.id WHERE t.id = ? ";
exports.updateInvoiceStatus = 'UPDATE invoice SET  status = ?, note = ?, updated_at = ?  where id = ? AND landlordID = ? ';
exports.getAllInvoicesquery = 'SELECT i.id as invoiceID,i.dueDate, i.startDate, i.totalAmount,i.created_at ,i.invoiceType,i.status, t.firstName, t.lastName, t.phoneNumber as tPhone, p.propertyName FROM invoice as i JOIN tenants as t ON i.tenantID = t.id JOIN property as p ON t.propertyID = p.id WHERE i.landlordID = ? ';
exports.getByIdInvoicesQuery = 'SELECT i.id as invoiceID,i.dueDate, i.startDate, i.totalAmount, i.status,i.created_at, t.firstName AS tFName, t.lastName AS tLName, t.phoneNumber as tPhone, p.propertyName, pu.unitNumber, l.FirstName as landlordFName, l.LastName as landlordLName, l.phone as landlordPhone FROM invoice as i JOIN tenants as t ON i.tenantID = t.id JOIN property as p ON t.propertyID = p.id JOIN propertyunits AS pu ON t.propertyUnitID = pu.id JOIN users as l ON l.id = i.landlordID WHERE i.id = ? ';
exports.updateInvoice = 'UPDATE invoice SET  invoiceType = ? , startDate = ? , endDate = ? , frequency = ? , dueDate = ? , repeatTerms = ? , terms = ? , totalAmount = ? , note = ? , updated_at = ? where id = ? AND landlordID = ? ';
exports.selectAllTenants = `SELECT p.propertyName, p.address AS pAddress, p.city AS pCity, p.state AS pState, p.zipCode AS pZipCode, p.propertyType, p.propertySQFT, p.status AS pStatus,p.units AS pUnits, t.id AS tenantID ,t.firstName,t.lastName, t.companyName, t.email AS tEmail, t.phoneNumber AS tPhoneNumber, t.Address AS tAddress, t.city AS tCity, t.state AS tState, t.zipcode AS tZipcode, t.rentAmount, t.gross_or_triple_lease, t.baseRent, t.tripleNet, t.leaseStartDate, t.leaseEndDate, t.increaseRent, pu.unitNumber, pu.Area AS unitArea, pu.unitDetails, pu.status AS unitStatus FROM tenants AS t INNER JOIN property AS p ON t.propertyID = p.id INNER JOIN propertyunits AS pu ON t.propertyUnitID = pu.id WHERE t.landlordID = ?`;


exports.addTasksQuery = "INSERT INTO task (taskName, vendorID, tenantID, dueDate, status, priority, notes, notifyTenant, notifyVendor, created_at, updated_at, created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
exports.addVendorList = "INSERT INTO taskassignto (taskId, vendorId) VALUES (?, ?)";
