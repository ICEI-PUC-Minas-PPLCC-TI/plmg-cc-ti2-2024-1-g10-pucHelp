document.addEventListener("DOMContentLoaded", function () {
    if (!sessionStorage.getItem("id_usuario")) {
        // Se não estiver logado, exibe um alerta
        alert("Você precisa estar logado para acessar esta página.");
        
        // Redireciona para a página de login após 1 segundo
        setTimeout(function() {
            window.location.href = "login.html"; // Altere para o caminho correto da sua página de login
        }, 1000);
    }

  // Verifica se há uma matrícula de usuário armazenada no sessionStorage
  var matriculaUsuario = sessionStorage.getItem("matricula");
  var id_usuario = sessionStorage.getItem("id_usuario");

  // Realiza uma requisição GET para obter os dados do usuário do back-end
  fetch(`http://localhost:8080/usuario/${id_usuario}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((usuario) => {
      console.log(usuario);
      // Verifica se os dados do usuário foram recebidos corretamente
      if (usuario) {
        // Preenche os elementos HTML com os dados do usuário
        document
          .querySelector(".profile-img")
          .setAttribute("src", usuario.foto);
        document.querySelector(".username").textContent = usuario.nome;
        document.querySelectorAll(".info p")[0].textContent =
          "Período: " + usuario.periodo;
        document.querySelectorAll(".info p")[1].textContent =
          "Email: " + usuario.email;
        document.querySelectorAll(".info p")[2].textContent = "Aluno";

        // Realiza uma requisição GET para obter os dados do curso associado ao usuário
        fetch(`http://localhost:8080/cursos/${usuario.idCurso}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((curso) => {
            console.log(curso);
            // Verifica se os dados do curso foram recebidos corretamente
            if (curso) {
              // Preenche o campo "Curso" nas informações do perfil com o nome do curso
              document.querySelectorAll(".info p")[1].textContent =
                "Curso: " + curso.nome;
            } else {
              console.error(
                "Erro ao obter os dados do curso associado ao usuário"
              );
            }
          })
          .catch((error) => {
            console.error("Erro:", error);
            alert("Erro ao obter os dados do curso associado ao usuário.");
          });

        // Verifica se o usuário logado é o mesmo do perfil exibido
        var idUsuarioLogado = sessionStorage.getItem("id_usuario");
        console.log(usuario.id);
        if (usuario.id == idUsuarioLogado) {
          // Se sim, exibe o ícone de edição
          document.getElementById("edit-profile").style.display = "block";

          // Adiciona evento de clique ao botão de deletar conta
          var deleteAccountButton = document.querySelector(
            ".delete-account-button"
          );
          deleteAccountButton.addEventListener("click", function (event) {
            event.preventDefault(); // Previne o comportamento padrão do link
            var confirmacao = confirm(
              "Tem certeza de que deseja deletar sua conta? Esta ação é permanente."
            );

            if (confirmacao) {
              // Se o usuário confirmar a deleção, envie uma requisição para deletar a conta
              fetch(`http://localhost:8080/usuario/${idUsuarioLogado}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((response) => {
                  if (response.ok) {
                    // Se a deleção for bem-sucedida, redirecione para a página de autenticação
                    window.location.href = "login.html";
                  } else {
                    // Se houver um erro na deleção, exiba uma mensagem de erro
                    console.error("Erro ao deletar a conta");
                    alert(
                      "Erro ao deletar a conta. Tente novamente mais tarde."
                    );
                  }
                })
                .catch((error) => {
                  console.error("Erro:", error);
                  alert("Erro ao deletar a conta. Tente novamente mais tarde.");
                });
            }
          });
        }
      } else {
        console.error("Erro ao obter os dados do usuário do back-end");
      }
    })
    .catch((error) => {
      console.error("Erro:", error);
      alert("Erro ao obter os dados do usuário.");
    });

  //
  // Função para obter e exibir as publicações do usuário
  var getAndDisplayUserPosts = function () {
    var idUsuario = sessionStorage.getItem("id_usuario");

    fetch(`http://localhost:8080/publicacoes/byUser/${idUsuario}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((publicacoes) => {
        const postsContainer = document.querySelector(".posts-container");

        if (publicacoes && publicacoes.length > 0) {
          publicacoes.forEach(function (publicacao) {
            console.log(publicacao);
            var postContainer = document.createElement("div");
            postContainer.classList.add("post-container");
            postContainer.classList.add("text-white")

            var post = document.createElement("div");
            post.classList.add("post");

            var postCaption = document.createElement("p");
            postCaption.textContent = publicacao.conteudo;
            post.appendChild(postCaption);

            postContainer.appendChild(post);

            // Adiciona as ações (botões de edição e deleção) à publicação
            var actionsDiv = document.createElement("div");
            actionsDiv.classList.add("actions");
            postContainer.appendChild(actionsDiv);
            addPostActions(postContainer);

            var commentsContainer = document.createElement("div");
            commentsContainer.classList.add("comments");

            console.log(publicacao);
            if (publicacao.coments && publicacao.coments.length > 0) {
              console.log(publicacao.coments);
              const comments = publicacao.coments.split('\n');
              console.log(comments);
              comments.forEach(function (comentario) {
                var comment = document.createElement("div");
                comment.classList.add("comment");

                var profileImg = document.createElement("img");
                profileImg.classList.add("profile-img");
                profileImg.src = "https://via.placeholder.com/600x400";
                profileImg.alt = "Profile Image";
                comment.appendChild(profileImg);

                var commentInfo = document.createElement("div");
                var username = document.createElement("a");
                username.classList.add("username");
                username.textContent = comentario.usuario;
                username.href = "perfil.html";
                commentInfo.appendChild(username);

                var commentText = document.createElement("p");
                commentText.textContent = comentario;
                commentInfo.appendChild(commentText);

                comment.appendChild(commentInfo);
                commentsContainer.appendChild(comment);
              });
            }

            post.appendChild(commentsContainer);
            postContainer.appendChild(post);
            postsContainer.appendChild(postContainer);
          });

          // Adiciona eventos de clique para os botões de edição e deleção
          addEditPostButtonEvents();
          addDeletePostButtonEvents();
        } else {
          console.error("Não há publicações");
          var noPostsMessage = document.createElement("p");
          noPostsMessage.textContent = "Não há publicações.";
          noPostsMessage.classList.add("no-posts-message");
          noPostsMessage.classList.add("text-center");
          postsContainer.appendChild(noPostsMessage);
        }
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Erro ao obter as publicações do usuário.");
      });
  };

  // Chama a função para obter e exibir as publicações do usuário
  getAndDisplayUserPosts();

  // Adiciona ícones de edição e deleção às publicações
  var addPostActions = function (post) {
    var actionsDiv = post.querySelector(".actions");
    var editButton = document.createElement("a");
    editButton.href = "#";
    editButton.classList.add("edit-post-button");
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    actionsDiv.appendChild(editButton);

    var deleteButton = document.createElement("a");
    deleteButton.href = "#";
    deleteButton.classList.add("delete-post-button");
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    actionsDiv.appendChild(deleteButton);
  };

  // Adiciona evento de clique ao botão de edição de publicações
  var addEditPostButtonEvents = function () {
    var editPostButtons = document.querySelectorAll(".edit-post-button");
    editPostButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        // Adicione a lógica para edição da publicação aqui
      });
    });
  };

  // Adiciona evento de clique ao botão de deleção de publicações
  var addDeletePostButtonEvents = function () {
    var deletePostButtons = document.querySelectorAll(".delete-post-button");
    deletePostButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        var confirmacao = confirm(
          "Tem certeza de que deseja deletar esta publicação? Esta ação é permanente."
        );

        if (confirmacao) {
          // Adicione a lógica para deleção da publicação aqui
        }
      });
    });
  };
});
