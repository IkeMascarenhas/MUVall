var express = require('express')
var router = express.Router()
var bcrypt = require('bcryptjs')
var salt = bcrypt.genSaltSync(12)
var mysql = require('mysql')
var { body, validationResult } = require('express-validator')
const multer = require('multer')

var fabricaDeConexao = require('../../config/connection-factory')
var bd = fabricaDeConexao()

bd.connect((err) => {
    if(err){
      throw err
    }
    console.log('Conectado ao banco de dados MySQL')
})

var UsuarioDAL = require("../models/UsuarioDAL");
var usuarioDAL = new UsuarioDAL(bd);

var { verificarUsuAutenticado, limparSessao, gravarUsuAutenticado, verificarUsuAutorizado } = require('../models/autenticador_middleware') 

const path = require('path');

var storagePasta = multer.diskStorage({
    destination: (req, file, callback)=>{
        callback(null, './app/public/imagem/perfil/')
    },
    filename:(req, file, callBack) =>{
        callBack(null, file.fieldname + '-' + DataTransfer.now() + path.extname(file.originalname))
    }
})

var upload = multer({storage: storagePasta})

router.get("/", verificarUsuAutenticado, function (req, res) {
  req.session.autenticado.login = req.query.login;
  res.render("pages/index", req.session.autenticado);
})

router.get("/cadastro", function (req, res) {
    res.render("pages/cadastro", { listaErros: null, dadosNotificacao: null, valores: { email_usu: "", nome_usu: "", senha_usu: "", dataNascimento_usu: "" } });
  });
  
  router.post("/cadastro",
    body("nome_usu")
      .isLength({ min: 3, max: 50 }).withMessage("Mínimo de 3 letras e máximo de 50!"),
    body("email_usu")
      .isEmail().withMessage("Digite um e-mail válido!"),
    body("senha_usu")
      .isStrongPassword()
      .withMessage("A senha deve ter no mínimo 8 caracteres, 1 letra maiúscula, 1 caractere especial e 1 número"),
    async function (req, res) {
      var dadosForm = {
        senha_usuario: bcrypt.hashSync(req.body.senha_usu, salt),
        nome_usuario: req.body.nome_usu,
        email_usuario: req.body.email_usu,
        dataNasc_usuario: req.body.dataNascimento_usu
      };
      const erros = validationResult(req);
      if (!erros.isEmpty()) {
        return res.render("pages/cadastro", { listaErros: erros, dadosNotificacao: null, valores: req.body })
      }
      try {
        let insert = await usuarioDAL.create(dadosForm);
        console.log(insert);
        res.render("pages/cadastro", {
          listaErros: null, dadosNotificacao: {
            titulo: "Cadastro realizado!", mensagem: "Usuário criado com o id " + insert.insertId + "!", tipo: "success"
          }, valores: req.body
        })
      } catch (e) {
        console.log(e)
        res.render("pages/cadastro", {
          listaErros: erros, dadosNotificacao: {
            titulo: "Erro ao cadastrar!", mensagem: "Verifique os valores digitados!", tipo: "error"
          }, valores: req.body
        })
      }
    });

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

router.get("/login", function (req, res) {
    res.locals.erroLogin = null
    res.render("pages/login", { listaErros: null, dadosNotificacao: null });
  });
  
router.post(
    "/login",
    body("email_usu")
      .isLength({ min: 4, max: 45 })
      .withMessage("O nome de usuário/e-mail deve ter de 8 a 45 caracteres"),
    body("senha_usu")
      .isStrongPassword()
      .withMessage("A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)"),
  
    gravarUsuAutenticado(usuarioDAL, bcrypt),
    function (req, res) {
      const erros = validationResult(req);
      if (!erros.isEmpty()) {
        return res.render("pages/login", { listaErros: erros, dadosNotificacao: null })
      }
      if (req.session.autenticado != null) {
        //mudar para página de perfil quando existir
        res.redirect("/?login=logado");
      } else {
        res.render("pages/login", { listaErros: erros, dadosNotificacao: { titulo: "Erro ao logar!", mensagem: "E-mail e/ou senha inválidos!", tipo: "error" } })
      }
});

router.get('/pagamento', function(req, res){
    res.render('pages/pagamento')
})

router.get('/perfilUsuario(admin)', function(req, res){
    res.render('pages/perfilUsuario(admin)');
})

router.post('/perfilUsuario(admin)', upload.single('logo-empresa'),
async function (req, res){
    try{
        if(!req.file){
            console.log("Falha no carregamento");
        }else{
            caminhoArquivo = "imagem/perfil/" + req.file.filename;
            dadosForm.img_peril_pasta = caminhoArquivo
        }
    }catch(e){

    }if(!req.session.loggedin){
        // redireciona o usuário caso ele não esteja logado
        return res.redirect('/login')
    }
    res.render('pages/perfilUsuario(admin)');
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

router.get('/perfilUsuario', function(req, res){
    res.render('pages/perfilUsuario')
})

router.get('/form_contratacao', function(req, res){
    res.render('pages/form_contratacao')
})
module.exports = router