const mysql = require("mysql2/promise");
let connection;
const createConnection = async () => {
  if (connection) return connection;
connection = await mysql.createConnection({
    host: "spaderent.cwaiqakemhu8.us-east-1.rds.amazonaws.com",
    port:"3306",
    user:"admin",
    password:"matz1234",
    database:"spade_Rent"
  });
  return connection;
};
const connect = async () => {
  try {
    const connection = await createConnection();
    if (connection) {
      console.log("Connected to Database");
    }
  } catch (err) {
    console.error("Error connecting to database:", err);
  }
};
module.exports = { createConnection, connect };
