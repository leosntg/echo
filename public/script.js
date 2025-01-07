const apiUrl = 'http://localhost:3000/api';

async function carregarPostagens() {
    try {
        const response = await fetch(`${apiUrl}/postagens`);
        const postagens = await response.json();

        const postSection = document.querySelector('.post-section');
        postSection.innerHTML = '';

        postagens.forEach(postagem => {
            const postHtml = `
                <div class="post">
                    <div class="post-header">
                        <img src="${postagem.foto_perfil ?? '/images/profile1.jpg'}" alt="Foto de perfil" class="profile-pic">
                        <div>
                            <p class="username">${postagem.autor}</p>
                            <p class="post-date">${new Date(postagem.data_criacao).toLocaleString()}</p>
                        </div>
                    </div>
                    <div class="post-content">
                        <p>${postagem.conteudo}</p>
                    </div>
                    <div class="post-actions">
                        <button class="like-btn" data-id="${postagem.id}">Curtir</button>
                        <button class="comment-btn" data-id="${postagem.id}">Comentar</button>
                    </div>
                </div>
            `;
            postSection.innerHTML += postHtml;
        });

        document.querySelectorAll('.like-btn').forEach(button => {
            button.addEventListener('click', () => curtirPostagem(button.dataset.id));
        });

        document.querySelectorAll('.comment-btn').forEach(button => {
            button.addEventListener('click', () => comentarPostagem(button.dataset.id));
        });
    } catch (error) {
        console.error('Erro ao carregar postagens:', error);
    }
}

async function curtirPostagem(postId) {
    try {
        alert(`Postagem ${postId} curtida!`);
    } catch (error) {
        console.error('Erro ao curtir a postagem:', error);
    }
}

function comentarPostagem(postId) {
    const comentario = prompt('Digite seu comentário:');
    if (comentario) {
        alert(`Comentário enviado para a postagem ${postId}: "${comentario}"`);
    }
}

async function registrarUsuario(event) {
    event.preventDefault();

    const nome = document.querySelector('#nome').value;
    const email = document.querySelector('#email').value;
    const senha = document.querySelector('#senha').value;

    try {
        const response = await fetch(`${apiUrl}/usuarios/cadastrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha }),
        });

        if (response.ok) {
            alert('Usuário cadastrado com sucesso!');
            window.location.href = '/login';
        } else {
            const error = await response.json();
            alert(`Erro: ${error.error}`);
        }
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
    }
}

async function loginUsuario(event) {
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const senha = document.querySelector('#senha').value;

    try {
        const response = await fetch(`${apiUrl}/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
        });

        if (response.ok) {
            const data = await response.json();
            alert(`Bem-vindo, ${data.usuario.nome}!`);
            window.location.href = '/';
        } else {
            const error = await response.json();
            alert(`Erro: ${error.error}`);
        }
    } catch (error) {
        console.error('Erro ao realizar login:', error);
    }
}

async function criarPostagem(event) {
    event.preventDefault();

    const conteudo = document.querySelector('#conteudo').value;

    try {
        const response = await fetch(`${apiUrl}/postagens`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conteudo }),
        });

        if (response.ok) {
            alert('Postagem criada com sucesso!');
            window.location.href = '/';
        } else {
            const error = await response.json();
            alert(`Erro: ${error.error}`);
        }
    } catch (error) {
        console.error('Erro ao criar postagem:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.querySelector('#form-cadastro');
    const loginForm = document.querySelector('#form-login');
    const postagemForm = document.querySelector('#form-postagem');

    if (cadastroForm) cadastroForm.addEventListener('submit', registrarUsuario);
    if (loginForm) loginForm.addEventListener('submit', loginUsuario);
    if (postagemForm) postagemForm.addEventListener('submit', criarPostagem);

    if (window.location.pathname === '/') {
        carregarPostagens();
    }
});