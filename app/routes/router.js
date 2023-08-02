var express = require('express')
var router = express.Router()
var md5 = require('md5')
var mysql = require('mysql')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

var fabricDeConexao = require('../../config/connection-factory')
var bd = fabricDeConexao()

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

router.post('/cadastro',  (req, res) => {
    const { nome, email, senha } = req.body

    if (nome && email && senha){
    bd.query('select * from cadastro where email = ?',
    [email],
    (error, results) => {
        if(results.length > 0) {
            res.send('Email já cadastrado')
        } else {
            const hashedPassword = md5(senha)

            bd.query(
            'insert into cadastro (nome, email, senha) values (?, ?, ?)',
            [nome, email, hashedPassword],
            (error, results) => {
                if(error){
                    res.send('Erro ao cadastrar o usuário')
                } else {
                    res.send('Cadastro realizado com sucesso!')
                }
            }
            )
        }
    })
    } else {
        res.send('Por favor, preencha todos os campos')
    }
})

router.get('/cadastro-anunciante', function(req, res){
    res.render('pages/cadastro-anunciante')
})

router.post('/cadastro-anunciante', upload.single('logo'), function(req, res){
    const { nomeEmp, email, senha, cnpj } = req.body
    const logo = req.file

    if (nomeEmp && email && senha && cnpj){
    bd.query('select * from cadastro_anunciante where email = ?',
    [email],
    (error, results) => {
        if(results.length > 0) {
            res.send('Email já cadastrado')
        } else {
            const hashedPassword = md5(senha)
            const caminhoImagem = logo.path

            bd.query(
            'insert into cadastro_anunciante (nomeDaEmpresa, email, senha, cnpj) values (?, ?, ?, ?)',
            [nomeEmp, email, hashedPassword, cnpj, caminhoImagem],
            (error, results) => {
                if(error){
                    res.send('Erro ao cadastrar o usuário')
                } else {
                    res.redirect('/perfil')
                }
            }
            )
        }
    })
    } else {
        res.send('Por favor, preencha todos os campos')
    }
})

router.get('/lista-de-servicos', function(req, res){
    res.render('pages/lista-de-servicos')
})

router.get('/login', function(req, res){
    res.render('pages/login')
})

router.post('/login', (req, res) => {
    const { email, senha } = req.body

    if (email && senha) {

        bd.query(
            'SELECT * FROM cadastro_anunciante WHERE email = ?',
            [email],
            (error, results) => {
                if (results.length > 0){
                    const storedPassword = results[0].senha
                    const hashedPassword = md5(senha)

                    if(storedPassword === hashedPassword){
                        req.session.loggedin = true
                        req.session.email = email
                        console.log('Usuário autenticado?', req.session.loggedin)
                        console.log(req.session)
                        res.redirect('/perfil')
                    }else {
                        res.send('Senha incorreta')
                    }
                } else {
                    res.send('Email nao encontrado')
                }
            }
        )
    } else {
        res.send('Informe um email e senha')
    }
})

router.get('/pagamento', function(req, res){
    res.render('pages/pagamento')
})

router.get('/perfil', function(req, res){
    if(!req.session.loggedin){
        // redireciona o usuário caso ele não esteja logado
        return res.redirect('/login')
    }
    

    res.render('pages/perfil', {nomeEmp: user})
})

router.get('/anunciar', function(req, res){
    res.render('pages/anunciar')
})

router.get('/descservico', function(req, res){
    res.render('pages/descservico')
})

router.get('/faleConosco', function(req, res){
    res.render('pages/faleConosco')
})

module.exports = router