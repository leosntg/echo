const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/dbMySQL');

const router = express.Router();

router.post('/', async (req, res) => {
    const { conteudo } = req.body;
    const { id: idAutor } = req.user;

    try {
        const [result] = await db.query(
        'INSERT INTO Postagem (conteudo, id_autor, data_criacao) VALUES (?, ?, NOW())',
        [conteudo, idAutor]
        );

        res.status(201).json({ message: 'Postagem criada com sucesso', postagemId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar postagem' });
    }
});

router.get('/', async (req, res) => {
    try {
        const [postagens] = await db.query(
            `SELECT p.id, p.conteudo, p.data_criacao, u.id AS userId, u.nome AS autor
            FROM Postagem p
            JOIN Usuario u ON p.id_autor = u.id
            ORDER BY p.data_criacao DESC`
        );

        res.status(200).json(postagens);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao listar postagens' });
    }
});

module.exports = router;