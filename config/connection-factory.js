var mysql = require("mysql");


module.exports = function(){
 return bd = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "MUVALL",
    port: 3306
  });
} 


bd.connect((err) => {
  if(err){
    throw err
  }
  console.log('Concectado ao banco de dados MySQL')
})