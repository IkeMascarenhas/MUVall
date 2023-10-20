const mysql = require("mysql2");

module.exports = function () {
  return mysql.createConnection({
    host: "containers-us-west-68.railway.app",
    user: "root",
    password: "z09YyLXnJ4yTEo8AF8Cx", // Your database password
    database: "railway",
    port: 5500
  });
};
