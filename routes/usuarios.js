const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/dbMySQL');
const jwt = require('jsonwebtoken');
const { session } = require('../config/dbNeo4j');

const router = express.Router();

router.post('/cadastrar', async (req, res) => {
    const { nome, email, senha } = req.body;
    const hashedSenha = await bcrypt.hash(senha, 10);

    try {
        const result = await session.run(
        `CREATE (u:Usuario {nome: $nome, email: $email, senha: $senha, tipo: 2, data_criacao: $data}) RETURN u, id(u) AS userId`,
        { nome, email, senha: hashedSenha, data: new Date().toISOString().split('T')[0] }
        );

        const createdUser = result.records[0].get('u').properties;
        const userId = result.records[0].get('userId').low;

        const token = jwt.sign(
        { id: userId, email: createdUser.email, nome: createdUser.nome },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
        );

        res.cookie('jwt', token, { httpOnly: true });
        res.status(201).send('Usuário cadastrado com sucesso!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao cadastrar usuário.');
    }
});

router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const result = await session.run(
        `MATCH (u:Usuario {email: $email}) RETURN u.senha AS senha, u.nome AS nome, u.email AS email, id(u) AS userId`,
        { email }
        );

        if (result.records.length === 0) {
            return res.status(401).send('Email ou senha incorretos.');
        }

        const user = result.records[0];
        const userId = result.records[0].get('userId').low;
        const hashedSenha = user.get('senha');

        const senhaValida = await bcrypt.compare(senha, hashedSenha);

        if (!senhaValida) {
            return res.status(401).send('Email ou senha incorretos.');
        }

        const token = jwt.sign(
        { id: userId, email: user.get('email'), nome: user.get('nome') },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
        );

        res.cookie('jwt', token, { httpOnly: true });
        res.status(200).send('Login realizado com sucesso!');
    } catch (err) {
        console.error(err);

        res.status(500).send('Erro ao realizar login.');
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/login');
});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const userResult = await session.run(
            `MATCH (u:Usuario) WHERE ID(u) = $userId
            RETURN u.nome AS nome, u.email AS email, u.data_criacao AS dataCriacao`,
            { userId: parseInt(userId, 10) }
        );

        if (userResult.records.length === 0) {
            return res.status(404).send('Usuário não encontrado.');
        }

        const user = userResult.records[0];
        const userData = {
            nome: user.get('nome'),
            email: user.get('email'),
            dataCriacao: user.get('dataCriacao'),
        };

        const [posts] = await db.query(
            'SELECT conteudo, DATE_FORMAT(data_criacao, "%d/%m/%Y") AS dataCriacao FROM Postagem WHERE id_autor = ? ORDER BY id DESC',
            [userId]
        );

        res.status(200).json({ usuario: userData, postagens: posts });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar dados do perfil.');
    }
});


module.exports = router;