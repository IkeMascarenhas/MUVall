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
const e = require('express')

var storagePasta = multer.diskStorage({
    destination: (req, file, callback)=>{
        callback(null, './app/public/imagem/perfil/')
    },
    filename:(req, file, callBack) =>{
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({storage: storagePasta})

router.get("/", verificarUsuAutenticado, function (req, res) {
  req.session.autenticado.login = req.query.login;
  res.render("pages/index", req.session.autenticado);
})

router.get("/sair", limparSessao, function (req, res) {
  res.redirect("/");
});

// router.get("/excluir", function (req, res) {
//   usuarioDAL.delete(id_usuario)
//   res.redirect("/");
// });

router.get("/cadastro", function (req, res) {
    res.render("pages/cadastro", { listaErros: null, dadosNotificacao: null, autenticado:null, valores: { email_usu: "", nome_usu: "", senha_usu: "", dataNascimento_usu: "" } });
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
    res.render("pages/login", { listaErros: null, dadosNotificacao: null, autenticado: null });
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

router.get('/perfilUsuario', verificarUsuAutorizado([1, 2, 3], verificarUsuAutenticado,"pages/restrito"), async function (req, res) {
  try {
    let results = await usuarioDAL.findID(req.session.autenticado.id);
    console.log(results);
    let campos = {
      nome_usu: results[0].nome_usuario, email_usu: results[0].email_usuario, dataNasc_usu: results[0].dataNasc_usuario,
      img_perfil: results[0].img_perfil, senha_usu: ""
    }
    res.render("pages/perfilUsuario", { listaErros: null, dadosNotificacao: null, valores: campos, autenticado: req.body.autenticado })
  } catch (e) {
    res.render("pages/perfilUsuario", {
      listaErros: null, dadosNotificacao: null, valores: {
        img_perfil: "", nome_usu: "", email_usu: "", senha_usu: ""
      }
    })
    console.log(e)
  }
});

router.post('/perfilUsuario', upload.single('img-perfil'),
body("nome_usu")
  .isLength({ min: 3, max: 50 }).withMessage("Mínimo de 3 letras e máximo de 50!"),
body("email_usu")
  .isEmail().withMessage("Digite um e-mail válido!"),
verificarUsuAutorizado([1, 2, 3], "pages/restrito"),
verificarUsuAutenticado,
async function (req, res) {
  const erros = validationResult(req);
  console.log(erros)
  if (!erros.isEmpty()) {
    return res.render("pages/perfilUsuario", { listaErros: erros, dadosNotificacao: null, valores: req.body })
  }
  try {
    var dadosForm = {
      nome_usuario: req.body.nome_usu,
      email_usuario: req.body.email_usu,
      dataNasc_usuario: req.body.dataNascimento_usu,
      // img_perfil: null,
      tipo_usuario: 1,
      status_usuario: 1,
      id: req.session.autenticado.id
    };
    console.log("senha: " + req.body.senha_usu)
    if (req.body.senha_usu != '') {
        dadosForm.senha_usuario = bcrypt.hashSync(req.body.senha_usu, salt);
    }
    if (!req.file) {
      console.log("Falha no carregamento");
    } else {
      caminhoArquivo = "imagem/perfil/" + req.file.filename;
      dadosForm.img_perfil = caminhoArquivo
    }
    console.log(dadosForm);

    let resultUpdate = await usuarioDAL.update(dadosForm);
    if (!resultUpdate.isEmpty) {
      if (resultUpdate.changedRows == 1) {
        var result = await usuarioDAL.findID(req.session.autenticado.id);
        var autenticado = {
          autenticado: result[0].nome_usuario,
          email_usu: result[0].email_usuario,
          id: result[0].id_usuario,
          tipo: result[0].tipo_usuario,
          img_perfil: result[0].img_perfil,
        };
        
        req.session.autenticado = autenticado;
        let campos = {
          nome_usu: result[0].nome_usuario, email_usu: result[0].email_usuario, dataNasc_usu: result[0].dataNasc_usuario,
          img_perfil: result[0].img_perfil, senha_usu: ""
        }
        res.render("pages/perfilUsuario", { listaErros: null, dadosNotificacao: { titulo: "Perfil atualizado com sucesso!", mensagem: "", tipo: "success" }, valores: campos, autenticado: req.body.autenticado});
      }
    }
  } catch (e) {
    console.log(e)
    res.render("pages/perfilUsuario", { listaErros: erros, dadosNotificacao: { titulo: "Erro ao atualizar o perfil!", mensagem: "Verifique os valores digitados!", tipo: "error" }, valores: req.body, autenticado: req.body.autenticado })
  }

});
router.get('/anunciar', verificarUsuAutenticado, verificarUsuAutorizado(2, 'pages/restrito'), function(req, res){
    
  res.render('pages/anunciar', {autenticado: req.session.autenticado})
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

router.get('/form_contratacao', function(req, res){
    res.render('pages/form_contratacao')
})


router.get("/painel_adm", verificarUsuAutorizado([2, 3], "pages/restrito"), verificarUsuAutenticado, async (req, res) => {
  try {
    const usuarios = await buscarUsuariosDoBanco();
    
    bd.query("SELECT COUNT(id_usuario) AS total_usuarios FROM usuario", (error, results) => {
      if (error) {
        console.error("Erro ao contar usuários:", error);
        res.status(500).send("Erro ao contar usuários.");
      } else {
        const totalUsuarios = results[0].total_usuarios;
        
        res.render("pages/painel_adm", {
          listaErros: null,
          dadosNotificacao: null,
          valores: { nome: "", email: "", senha: "", img_perfil: ""},
          autenticado: req.session.autenticado,
          login: req.session.autenticado,
          tipo_usuario: req.session.autenticado.tipo,
          img_perfil: req.session.autenticado.img_perfil,
          usuarios: usuarios,
          totalUsuarios: totalUsuarios, 
        });
      }
    });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).send("Erro ao buscar usuários.");
  }
});

async function buscarUsuariosDoBanco() {
  return new Promise((resolve, reject) => {
    bd.query("SELECT * FROM usuario", (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

router.post("/desativar-usuario/:id", verificarUsuAutorizado([2, 3], "pages/restrito"), verificarUsuAutenticado, async (req, res) => {
  const id = req.params.id;

  try {
    await usuarioDAL.delete(id);
    res.status(200).send("Usuário desativado com sucesso.");
    console.log("Usuário desativado com sucesso.");
  } catch (error) {
    console.error("Erro ao desativar o usuário:", error);
    res.status(500).send("Erro ao desativar o usuário.");
    console.log("Erro ao desativar o usuário.");
  }
});

router.post("/reativar-usuario/:id", verificarUsuAutorizado([2, 3], "pages/restrito"), verificarUsuAutenticado, async (req, res) => {
  const id = req.params.id;

  try {
    await usuarioDAL.reactivate(id);
    res.status(200).send("Usuário reativado com sucesso.");
    console.log("Usuário reativado com sucesso.");
  } catch (error) {
    console.error("Erro ao reativar o usuário:", error);
    res.status(500).send("Erro ao reativar o usuário.");
    console.log("Erro ao reativar o usuário.");
  }
});

router.get("/painel_admFILIPE", async (req, res) =>{
  res.render("pages/painel_admFILIPE")
})

module.exports = router