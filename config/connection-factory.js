const mysql = require("mysql2");

module.exports = function () {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pietro09Pisi@", // Your database password
    database: "muvall",
    port: 3306,
    authPlugins: {
      mysql_native_password: () => ({
        data: Buffer.from(""),
        next: () => null,
      }),
    },
  });
};
