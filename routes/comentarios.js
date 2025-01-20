const express = require('express');
const db = require('../config/dbMySQL');
const { driver } = require('../config/dbNeo4j');

const router = express.Router();

router.post('/:postId', async (req, res) => {
    const { conteudo } = req.body;
    const { postId } = req.params;
    const { id: idAutor } = req.user;

    try {
        const [result] = await db.query(
            'INSERT INTO Comentario (conteudo, id_autor, id_postagem, data_criacao) VALUES (?, ?, ?, NOW())',
            [conteudo, idAutor, postId]
        );

        const session = driver.session();
        try {
            const resultNeo4j = await session.run(
                `MATCH (u:Usuario)
                 WHERE ID(u) = $idAutor
                 RETURN u.nome AS nome, u.foto_perfil AS fotoPerfil`,
                { idAutor }
            );

            const autor = resultNeo4j.records[0];
            session.close();

            res.status(201).json({
                id: result.insertId,
                conteudo,
                id_postagem: postId,
                data_criacao: new Date(),
                autor: autor
                    ? {
                          id: idAutor,
                          nome: autor.get('nome'),
                          fotoPerfil: autor.get('fotoPerfil'),
                      }
                    : { id: idAutor, nome: 'Usuário não encontrado' },
                message: 'Comentário criado com sucesso',
            });
        } catch (error) {
            session.close();
            throw error;
        }
    } catch (error) {
        console.error('Erro ao criar comentário:', error);
        res.status(500).json({ message: 'Erro ao criar comentário' });
    }
});

router.get('/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        const [comentarios] = await db.query(
            `SELECT c.id, c.conteudo, c.data_criacao, c.id_autor
            FROM Comentario c
            WHERE c.id_postagem = ?
            ORDER BY c.data_criacao ASC`,
            [postId]
        );

        const comentariosComAutores = await Promise.all(
            comentarios.map(async (comentario) => {
                const session = driver.session();
                try {
                    const result = await session.run(
                        `MATCH (u:Usuario)
                         WHERE ID(u) = $idAutor
                         RETURN u.nome AS nome`,
                        { idAutor: comentario.id_autor }
                    );

                    const autor = result.records[0];
                    session.close();

                    return {
                        ...comentario,
                        autor: autor ? autor.get('nome') : 'Usuário não encontrado',
                    };
                } catch (error) {
                    session.close();
                    throw error;
                }
            })
        );

        res.status(200).json(comentariosComAutores);
    } catch (error) {
        console.error('Erro ao listar comentários:', error);
        res.status(500).json({ message: 'Erro ao listar comentários' });
    }
});

module.exports = router;