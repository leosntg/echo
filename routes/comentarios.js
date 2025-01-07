const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/dbMySQL');

const router = express.Router();

router.post('/:postId', async (req, res) => {
    const { conteudo } = req.body;
    const { postId } = req.params;
    const { id: idAutor } = req.user;

    try {
        await db.query(
        'INSERT INTO Comentario (conteudo, id_autor, id_postagem, data_criacao) VALUES (?, ?, ?, NOW())',
        [conteudo, idAutor, postId]
        );

        res.status(201).json({ message: 'Comentário criado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar comentário' });
    }
});

router.get('/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        const [comentarios] = await db.query(
        `SELECT c.id, c.conteudo, c.data_criacao, u.nome AS autor
        FROM Comentario c
        JOIN Usuario u ON c.id_autor = u.id
        WHERE c.id_postagem = ?
        ORDER BY c.data_criacao ASC`,
        [postId]
        );

        res.status(200).json(comentarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao listar comentários' });
    }
});

module.exports = router;