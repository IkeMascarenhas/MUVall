var express = require('express')
var router = express.Router()
var bcrypt = require('bcryptjs')
var salr = bcrypt.genSaltSync(12)
var mysql = require('mysql')
var { body, validationResult } = require('express-validator')
const multer = require('multer')

var fabricDeConexao = require('../../config/connection-factory')
const session = require('express-session')
var bd = fabricDeConexao()

bd.connect((err) => {
    if(err){
      throw err
    }
    console.log('Conectado ao banco de dados MySQL')
})
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

router.get('/', function(req, res){
    res.render('pages/index')
})

router.get("/cadastro", function (req, res) {
    res.render("pages/cadastro", { listaErros: null, dadosNotificacao: null, valores: { nome_usu: "", nomeusu_usu: "", email_usu: "", senha_usu: "" } });
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
        dataNascimento_usu: req.body.dataNascimento_usu
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
    res.render('pages/perfil');
})

router.post('/perfil', upload.single('logo-empresa'),
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
    res.render('pages/perfil');
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