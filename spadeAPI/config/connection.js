const mysql = require("mysql2/promise");

let connection;

const createConnection = async () => {
  if (connection) return connection;

  connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "spaid",
  });

  return connection;
};
const connect = async () => {
  try {
    const connection = await createConnection();
    if (connection) {
      console.log("Connected to Database");
    }
    // Use the connection object here
  } catch (err) {
    console.error("Error connecting to database:", err);
  }
};
module.exports = { createConnection, connect };
