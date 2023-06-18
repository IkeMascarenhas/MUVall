var express = require('express')
var router = express.Router()
var bcrypt = require('bcrypt')
var mysql = require('mysql')

const bd = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "MUVALL",
    port: 3306
});

bd.connect((err) => {
    if(err){
      throw err
    }
    console.log('Concectado ao banco de dados MySQL')
  })

router.get('/', function(req, res){
    res.render('pages/index')
})

router.get('/cadastro', function(req, res){
    res.render('pages/cadastro')
})

router.get('/cadastro-anunciante', function(req, res){
    res.render('pages/cadastro-anunciante')
})

router.get('/lista-de-servicos', function(req, res){
    res.render('pages/lista-de-servicos')
})

router.get('/login', function(req, res){
    res.render('pages/login')
})

router.post('/login', (req, res) => {
    const { email, senha } = req.body

    if(email && senha) {
        bd.query(
            'SELECT * FROM cadastro WHERE email = ?',
            [email],
            (error, results) => {
                if (results.length > 0) {
                    bcrypt.compare(senha, results[0].senha, (err, match) => {
                        if (match) {
                            req.session.loggedin = true
                            req.session.email = email
                            res.redirect('/')
                        } else {
                            res.send('Senha incorreta')
                        }
                    })
                } else {
                    res.send('Email não encontrado')
                }
            }
        )
    } else {
        res.send('Email e senha incorretos')
    }
})

router.get('/pagamento', function(req, res){
    res.render('pages/pagamento')
})

router.get('/perfil', function(req, res){
    res.render('pages/perfil')
})

module.exports = router