const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const usuariosRoutes = require('./routes/usuarios');
const postagensRoutes = require('./routes/postagens');
const comentariosRoutes = require('./routes/comentarios');
const curtidasRoutes = require('./routes/curtidas');
const verifyToken = require('./middlewares/authMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);

app.set('layout', './layout')
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/postagens', verifyToken, postagensRoutes);
app.use('/api/comentarios', verifyToken, comentariosRoutes);
app.use('/api/curtidas', verifyToken, curtidasRoutes);

app.get('/', verifyToken, (req, res) => {
    res.render('index', { autenticado: true });
});

app.get('/cadastrar', (req, res) => {
    res.render('cadastrar', { autenticado: false });
});

app.get('/login', async (req, res) => {
    res.render('login', { autenticado: false });
});

app.get('/criar-postagem', verifyToken, (req, res) => {
    res.render('criar_postagem', { autenticado: true });
});

app.get('/perfil', verifyToken, (req, res) => {
    res.render('perfil', { autenticado: true });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});