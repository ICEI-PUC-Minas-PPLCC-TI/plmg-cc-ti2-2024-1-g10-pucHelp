document.addEventListener('DOMContentLoaded', function() {
    // Verifica se há uma matrícula de usuário armazenada no sessionStorage
    var matriculaUsuario = sessionStorage.getItem('matricula');
    var id_usuario = sessionStorage.getItem('id_usuario');

    // Realiza uma requisição GET para obter os dados do usuário do back-end
    fetch(`http://localhost:8080/usuario/${id_usuario}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((response) => response.json())
    .then((usuario) => {
        console.log(usuario);
        // Verifica se os dados do usuário foram recebidos corretamente
        if (usuario) {
            // Preenche os elementos HTML com os dados do usuário
            document.querySelector('.profile-img').setAttribute('src', usuario.foto);
            document.querySelector('.username').textContent = usuario.nome;
            document.querySelectorAll('.info p')[0].textContent = "Unidade: " + usuario.unidade;
            document.querySelectorAll('.info p')[1].textContent = "Curso: " + usuario.curso;
            document.querySelectorAll('.info p')[2].textContent = "Período: " + usuario.periodo;
            document.querySelectorAll('.info p')[3].textContent = "Email: " + usuario.email;

            // Verifica se o usuário logado é o mesmo do perfil exibido
            var idUsuarioLogado = sessionStorage.getItem('id_usuario');
            if (usuario.id == idUsuarioLogado) {
                // Se sim, exibe o ícone de edição
                document.getElementById('edit-profile').style.display = 'block';
            }
        } else {
            console.error("Erro ao obter os dados do usuário do back-end");
        }
    })
    .catch((error) => {
        console.error("Erro:", error);
        alert("Erro ao obter os dados do usuário.");
    });
});

// Código para obter as publicações do usuário
document.addEventListener('DOMContentLoaded', function() {
    var idUsuario = sessionStorage.getItem('id_usuario');

    fetch(`http://localhost:8080/publicacoes/byUser/${idUsuario}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((response) => response.ok ? response.json() : null)
    .then((publicacoes) => {
        const postsContainer = document.querySelector('.posts-container');

        if (publicacoes && publicacoes.length > 0) {
            publicacoes.forEach(function(publicacao) {
                console.log(publicacao);
                var postContainer = document.createElement('div');
                postContainer.classList.add('post');

                var postImage = document.createElement('img');
                postImage.src = publicacao.imagem;
                postImage.alt = "Post Image";
                postContainer.appendChild(postImage);

                var postCaption = document.createElement('p');
                postCaption.textContent = publicacao.conteudo;
                postContainer.appendChild(postCaption);

                var commentsContainer = document.createElement('div');
                commentsContainer.classList.add('comments');

                if (publicacao.comentarios && publicacao.comentarios.length > 0) {
                    publicacao.comentarios.forEach(function(comentario) {
                        var comment = document.createElement('div');
                        comment.classList.add('comment');

                        var profileImg = document.createElement('img');
                        profileImg.classList.add('profile-img');
                        profileImg.src = comentario.foto;
                        profileImg.alt = "Profile Image";
                        comment.appendChild(profileImg);

                        var commentInfo = document.createElement('div');
                        var username = document.createElement('a');
                        username.classList.add('username');
                        username.textContent = comentario.usuario;
                        username.href = "perfil.html";
                        commentInfo.appendChild(username);

                        var commentText = document.createElement('p');
                        commentText.textContent = comentario.texto;
                        commentInfo.appendChild(commentText);

                        comment.appendChild(commentInfo);
                        commentsContainer.appendChild(comment);
                    });
                }

                postContainer.appendChild(commentsContainer);
                postsContainer.appendChild(postContainer);
            });
        } else {
            console.error("Não há publicações");
            var noPostsMessage = document.createElement('p');
            noPostsMessage.textContent = "Não há publicações.";
            noPostsMessage.classList.add('no-posts-message');
            postsContainer.appendChild(noPostsMessage);
        }
    })
    .catch((error) => {
        console.error("Erro:", error);
        alert("Erro ao obter as publicações do usuário.");
    });
});

