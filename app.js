const express = require('express')
var session = require('express-session')
const app = express()
const porta = 9999

app.use(express.static('app/public'))

app.set('view engine', 'ejs')
app.set('views', './app/views')

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(
    session({
        secret: 'pietromacacocadeobd',
        resave: true,
        saveUninitialized: true,
    })
)

var rotas = require('./app/routes/router')
app.use('/', rotas)

app.listen(porta, ()=> {
    console.log(`Servidor ouvindo na porta ${porta}`)
})