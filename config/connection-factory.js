const mysql = require("mysql");

module.exports = function () {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@ITB123456", // Your database password
    database: "muvall",
    port: 3306
  });
};
