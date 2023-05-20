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

exports.updateProperty='UPDATE property SET landlordID = ?, propertyName = ? , address = ? , city = ? , state = ? , zipCode = ? , propertyType = ? , propertySQFT = ? , status = ?, units = ?  WHERE id = ? ';
