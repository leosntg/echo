const express = require('express');
const db = require('../config/dbMySQL');
const Joi = require('joi');
const { driver } = require('../config/dbNeo4j');

const router = express.Router();

router.post('/', async (req, res) => {
    const schema = Joi.object({
        conteudo: Joi.string().max(500).required()
    });

    const { error, value } = schema.validate(req.body);

    if (error) return res.status(400).json({ message: error.message });

    const { conteudo } = value;
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
            `SELECT
                p.id,
                p.conteudo,
                p.data_criacao,
                p.id_autor,
                COUNT(c.id_postagem) AS curtidas
            FROM Postagem p
            LEFT JOIN Curtida c ON p.id = c.id_postagem
            GROUP BY p.id
            ORDER BY p.id DESC`
        );

        const session = driver.session();
        const tx = session.beginTransaction();

        try {
            const postagensComAutores = await Promise.all(
                postagens.map(async (postagem) => {
                    const result = await tx.run(
                        `MATCH (u:Usuario)
                         WHERE ID(u) = $idAutor
                         RETURN ID(u) AS userId, u.nome AS nome, u.foto_perfil AS fotoPerfil`,
                        { idAutor: postagem.id_autor }
                    );

                    const autor = result.records[0];
                    return {
                        ...postagem,
                        userId: autor ? autor.get('userId').low : null,
                        autor: autor ? autor.get('nome') : 'Usuário não encontrado',
                        fotoPerfil: autor ? autor.get('fotoPerfil') : null,
                    };
                })
            );

            await tx.commit();
            session.close();

            res.status(200).json(postagensComAutores);
        } catch (error) {
            await tx.rollback();
            session.close();
            throw error;
        }
    } catch (error) {
        console.error('Erro ao buscar postagens:', error);
        res.status(500).json({ message: 'Erro ao listar postagens' });
    }
});

module.exports = router;