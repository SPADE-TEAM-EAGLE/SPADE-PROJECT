exports.selectQuery=(table,...field)=>{
    if(field.length===1){
        return `SELECT * FROM ${table} WHERE ${field[0]} = ?`
    }else if(field.length>1){
        return `SELECT * FROM ${table} WHERE ${field[0]} = ? and ${field[1]} = ?`
    }else{
        return `SELECT * FROM ${table}`
    }
}

exports.deleteQuery = (table, ...field)=>{
if(field.length === 1){
    return `DELETE FROM ${table} WHERE ${field[0]} = ?` 
}else if(field.length === 2){
    return`DELETE FROM ${table} WHERE ${field[0]} = ? AND ${field[1]} = ?`
}
}




exports.addResetToken='UPDATE users SET token = ?, updated_at = ? where id = ?';
exports.updatePassword="UPDATE users SET Password = ? where id = ? and token = ?"
exports.insertInUsers='INSERT INTO users (id,FirstName, LastName, Email, Phone, Password, PlanID) VALUES (?,?, ?, ?, ?, ?, ?)';
exports.insertInProperty='INSERT INTO property (landlordID, propertyName, address, city, state, zipCode, propertyType, propertySQFT,status,units) VALUES (?,?,?,?,?,?,?,?,?,?)';
exports.insertInPropertyImage='INSERT INTO propertyimage (propertyID, Image) VALUES (?,?)';
exports.insertInPropertyUnits='INSERT INTO propertyunits (propertyID, unitNumber,Area,unitDetails,status) VALUES (?,?,?,?,?)';
exports.updateProperty='UPDATE property SET landlordID = ?, propertyName = ? , address = ? , city = ? , state = ? , zipCode = ? , propertyType = ? , propertySQFT = ? , status = ?, units = ?  WHERE id = ? ';
exports.updatePropertyUnits='UPDATE propertyunits SET unitNumber = ?, Area = ?, unitDetails = ?, status = ?  where id = ? AND propertyID = ? ';
exports.insertTenants = 'INSERT INTO tenants ( landlordID, firstName, lastName, companyName, email, phoneNumber, address, city, state, zipcode, propertyID, propertyUnitID, rentAmount, gross_or_triple_lease, baseRent, tripleNet, leaseStartDate, leaseEndDate, increaseRent, tenantPassword,tenantCreated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
// exports.UpdateTenants = 'UPDATE tenants SET landlordID = ?, firstName = ?, lastName = ?, companyName = ?, email = ?, phoneNumber = ?, address = ?, city = ?, state = ?, zipcode = ?, propertyID = ?, propertyUnitID = ?, rentAmount = ?, gross_or_triple_lease = ?, baseRent = ?, tripleNet = ?, leaseStartDate = ?, leaseEndDate = ?, increaseRent = ?, tenantPassword = ?  ';
exports.UpdateTenants = 'UPDATE tenants SET tenantPassword = ?, tenantUpdated_at = ? WHERE id = ?  ';


