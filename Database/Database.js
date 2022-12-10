const mysql = require("mysql2/promise");

//this method returns a pool (a bunch of connections) object
const pool = mysql.createPool({
  //CREATING A CONNECTION TO DATABSE

  //database is running on our PC so the host is local
  host: "localhost",
  database: "dbs_project",
  user: "root",
  password: "1234",
});

module.exports = pool;