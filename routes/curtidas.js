const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/dbMySQL');

const router = express.Router();

router.post('/postagem/:postId', async (req, res) => {
    const { postId } = req.params;
    const { id: idUsuario } = req.user;

    try {
        await db.query(
        'INSERT INTO Curtida (id_usuario, id_postagem, data_criacao) VALUES (?, ?, NOW())',
        [idUsuario, postId]
        );

        res.status(201).json({ message: 'Curtida na postagem registrada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao curtir postagem' });
    }
});

router.post('/comentario/:comentarioId', async (req, res) => {
    const { comentarioId } = req.params;
    const { id: idUsuario } = req.user;

    try {
        await db.query(
        'INSERT INTO Curtida (id_usuario, id_comentario, data_criacao) VALUES (?, ?, NOW())',
        [idUsuario, comentarioId]
        );

        res.status(201).json({ message: 'Curtida no comentário registrada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao curtir comentário' });
    }
});

router.get('/postagem/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        const [curtidas] = await db.query(
        `SELECT u.id, u.nome
        FROM Curtida c
        JOIN Usuario u ON c.id_usuario = u.id
        WHERE c.id_postagem = ?`,
        [postId]
        );

        res.status(200).json(curtidas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao listar curtidas da postagem' });
    }
});

router.get('/comentario/:comentarioId', async (req, res) => {
    const { comentarioId } = req.params;

    try {
        const [curtidas] = await db.query(
        `SELECT u.id, u.nome
        FROM Curtida c
        JOIN Usuario u ON c.id_usuario = u.id
        WHERE c.id_comentario = ?`,
        [comentarioId]
        );

        res.status(200).json(curtidas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao listar curtidas do comentário' });
    }
});

module.exports = router;