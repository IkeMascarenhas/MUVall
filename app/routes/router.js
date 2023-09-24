var express = require('express')
var router = express.Router()
var bcrypt = require('bcryptjs')
var salr = bcrypt.genSaltSync(12)
var mysql = require('mysql')
var { body, validationResult } = require('express-validator')

var fabricDeConexao = require('../../config/connection-factory')
const session = require('express-session')
var bd = fabricDeConexao()

bd.connect((err) => {
    if(err){
      throw err
    }
    console.log('Conectado ao banco de dados MySQL')
})

router.get('/', function(req, res){
    res.render('pages/index')
})

router.get('/cadastro', function(req, res){
    res.render('pages/cadastro')
})

router.get('/cadastro_concluido', function(req, res){
    res.render('pages/cadastro_concluido'); // Certifique-se de que o nome do arquivo corresponde ao nome do seu arquivo EJS
});

router.post('/cadastro',  (req, res) => {
    const { nome_usu, email_usu, senha_usu, dataNascimento_usu} = req.body

    if (nome_usu && email_usu && senha_usu && dataNascimento_usu){
    bd.query('select * from cadastro where email_usu = ?',
    [email_usu],
    (error, results) => {
        if(results.length > 0) {
            res.send('Email já cadastrado')
        } else {
            const hashedPassword = bcrypt.hashSync(senha_usu)

            bd.query(
            'insert into cadastro (nome_usu, email_usu, senha_usu, dataNascimento_usu ) values (?, ?, ?, ?)',
            [nome_usu,email_usu, hashedPassword,dataNascimento_usu],
            (error, results) => {
                if(error){
                    res.send('Erro ao cadastrar o usuário')
                } else {
                    res.redirect('/cadastro_concluido')
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

router.post('/cadastro-anunciante', function(req, res){
    const { nomeEmpresa, email, senha, cnpj } = req.body
    

    if (nomeEmpresa && email && senha && cnpj){
    bd.query('select * from cadastro_anunciante where email = ?',
    [email],
    (error, results) => {
        if(results.length > 0) {
            res.send('Email já cadastrado')
        } else {
            const hashedPassword = bcrypt.hashSync(senha)
            
            bd.query(
            'insert into cadastro_anunciante (nomeDaEmpresa, email, senha, cnpj) values (?, ?, ?, ?)',
            [nomeEmpresa, email, hashedPassword, cnpj],
            (error, results) => {
                if(error){
                    res.send('Erro ao cadastrar o usuário')
                    throw error
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
                    const hashedPassword = bcrypt.hashSync(senha)

                    if(bcrypt.compareSync(storedPassword, hashedPassword)){
                        req.session.loggedin = true
                        req.session.email = email
                        console.log('Usuário autenticado?', req.session.loggedin)
                        res.redirect('/perfil')
                        const nomeEmp = results[0].nomeDaEmpresa
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
    bd.query('SELECT * from cadastro_anunciante WHERE email = ?',
        [req.session.email],
        (error, results) =>{
            const emailBD = results[0].email
            if(emailBD == req.session.email){
                var nomeEmpresa = results[0].nomeDaEmpresa 
                res.render('pages/perfil', {nomeEmp: nomeEmpresa})
            }
        })
})
router.get('/excluirConta', function(req, res){
    res.render('pages/login')
})
router.post('/excluirContaAnunciante', function(req, res){
    const btn = req.body

    bd.query('DELETE from cadastro_anunciante WHERE email = ?',
    [req.session.email],
    (error, results) =>{
    if(error){
        throw error
    }else{
        console.log('Conta excluída com sucesso!')
        res.redirect('/login')
    }
    })
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

router.get('/avaliar', function(req, res){
    res.render('pages/avaliar')
})

router.get('/editarPerfil', function(req, res){
    res.render('pages/editarPerfil')
})

router.get('/form_contratacao', function(req, res){
    res.render('pages/form_contratacao')
})

module.exports = router