const express = require('express');
const path = require('path');
const cors = require('cors');
const API_CONFIG = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/node', express.static(path.join(__dirname), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
    }
}));

// Servir a pasta 'static' para o primeiro site
app.use('/static', express.static(path.join(__dirname, '..', 'loja', 'static')));

// Rota para carregar a página principal do primeiro site (pagina.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'loja', 'templates', 'pagina.html'));
});

// Rota para carregar a página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'login', 'templates', 'login.html'));
});

// Servir os arquivos CSS e JavaScript para o login
app.use('/static/CSS', express.static(path.join(__dirname, '..', 'login', 'static', 'CSS')));
app.use('/static/JavaScript', express.static(path.join(__dirname, '..', 'login', 'static', 'JavaScript')));

// Servir a pasta 'staticfiles' para acessar arquivos CSS e JS
app.use('/staticfiles', express.static(path.join(__dirname, '..', 'administrador', 'staticfiles')));

// Rota para carregar a página 'cadastrar.html' no caminho '/administrador/cadastrar'
app.get('/administrador/cadastrar', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'administrador', 'templates', 'cadastrar.html'));
});

// Rota para carregar a página de produtos
app.get('/administrador/produtos', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'administrador', 'templates', 'produtos.html'));
});

// Rota para carregar a página de atualização
app.get('/administrador/atualizar', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'administrador', 'templates', 'editar-produto.html'));
});

// Rota para carregar a página de produto
app.get('/produto/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'loja', 'templates', 'produto.html'));
});

app.get('/categoria/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'loja', 'templates', 'todosprodutos.html'));
});

// Rota para carregar a página do carrinho
app.get('/carrinho/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'carrinho_de_compra', 'index.html'));
});

// Servir arquivos estáticos do carrinho
app.use('/carrinho.js', express.static(path.join(__dirname, '..', 'carrinho_de_compra', 'static')));

// Iniciar o servidor
app.listen(API_CONFIG.NODE_PORT, () => {
    console.log(`Servidor rodando em http://localhost:${API_CONFIG.NODE_PORT}`);
});
