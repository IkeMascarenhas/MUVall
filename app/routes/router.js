var express = require('express')
var router = express.Router()

// conexão com o BD fica aqui (connection factory)

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

router.get('/pagamento', function(req, res){
    res.render('pages/pagamento')
})

router.get('/perfil', function(req, res){
    res.render('pages/perfil')
})

module.exports = router