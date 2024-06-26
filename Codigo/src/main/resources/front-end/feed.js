document.addEventListener('DOMContentLoaded', function () {
  // Verifica se o usuário está logado e redireciona para a página de login se não estiver
  if (!sessionStorage.getItem("id_usuario")) {
    alert("Você precisa estar logado para acessar esta página.");
    setTimeout(function() {
      window.location.href = "login.html"; // Altere para o caminho correto da sua página de login
    }, 0);
  } else {
    // Verifica se o usuário é administrador e exibe o link de administração
    var idTipoUsuario = sessionStorage.getItem("idTipoUsuario");
    if (idTipoUsuario && idTipoUsuario === "1") {
      document.getElementById("admin-link").style.display = "block";
    }
  }

  // Realiza uma requisição GET para obter as publicações do back-end
  fetch("http://localhost:8080/publicacoes", {
    method: "GET",
  })
  .then((response) => response.json())
  .then((data) => {
    // Verifica se os dados foram recebidos corretamente
    if (data && Array.isArray(data)) {
      var publicacoesContainer = document.getElementById("publicacoes-container");
      // Limpa o conteúdo atual do contêiner de publicações
      publicacoesContainer.innerHTML = "";
      // Itera sobre as publicações recebidas e cria os posts correspondentes
      data.forEach((publicacao) => {
        var post = criarPost(publicacao);
        publicacoesContainer.appendChild(post);
      });
    } else {
      console.error("Erro ao obter as publicações do back-end");
    }
  })
  .catch((error) => {
    console.error("Erro:", error);
    alert("Erro ao obter as publicações.");
  });

  // Função para criar um post com base nos dados da publicação
  function criarPost(publicacao) {
    var postContainer = document.createElement("div");
    postContainer.classList.add("post-container");

    var post = document.createElement("div");
    post.classList.add("post");

    var userHeader = document.createElement("div");
    userHeader.classList.add("user-header");

    var profileImg = document.createElement("img");
    profileImg.classList.add("profile-img");
    profileImg.setAttribute("src", "https://via.placeholder.com/50");
    profileImg.setAttribute("alt", "Profile Image");

    var username = document.createElement("a");
    username.classList.add("username");
    username.setAttribute("href", "perfil.html");
    username.textContent = publicacao.idUsuario;

    var likeButton = document.createElement("button");
    likeButton.innerHTML = '<i class="fas fa-heart"></i>';
    likeButton.classList.add("like-button");

    var likeCount = document.createElement("span");
    likeCount.classList.add("like-count");
    likeCount.textContent = publicacao.like; // Definindo a contagem inicial de likes
    likeButton.appendChild(likeCount);

    likeButton.addEventListener("click", function () {
      var icon = likeButton.querySelector("i");
      icon.style.color = "red";

      // Envia a requisição para adicionar like
      fetch("http://localhost:8080/publicacoes/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: publicacao.id })
      }).then((response) => {
        if (!response.ok) {
          alert("Erro ao adicionar like");
        } else {
          // Incrementando a contagem de likes e atualizando o texto
          publicacao.like++;
          likeCount.textContent = publicacao.like;
        }
      });
    });

    var commentButton = document.createElement("button");
    commentButton.innerHTML = '<i class="fas fa-comment"></i>';
    commentButton.classList.add("comment-button");

    var commentsSection = document.createElement("div");
    commentsSection.classList.add("comments");

    userHeader.appendChild(profileImg);
    userHeader.appendChild(username);

    var publicacaoText = document.createElement("p");
    publicacaoText.textContent = publicacao.conteudo;

    commentButton.addEventListener("click", function () {
      var textarea = document.createElement("textarea");
      textarea.placeholder = "Digite seu comentário aqui...";
      textarea.classList.add("comment-textarea");

      var sendButton = document.createElement("button");
      sendButton.textContent = "Enviar";
      sendButton.classList.add("send-button");

      sendButton.addEventListener("click", function () {
        var commentText = textarea.value;

        // Envia a requisição para adicionar comentário
        fetch("http://localhost:8080/publicacoes/comment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ id: publicacao.id, comment: commentText })
        }).then((response) => {
          if (response.ok) {
            var newComment = document.createElement("div");
            newComment.classList.add("comment");

            var profileImg = document.createElement("img");
            profileImg.classList.add("profile-img");
            profileImg.setAttribute("src", "https://via.placeholder.com/50");
            profileImg.setAttribute("alt", "Profile Image");

            var commentContent = document.createElement("div");

            var username = document.createElement("a");
            username.classList.add("username");
            username.setAttribute("href", "perfil.html");
            console.log(publicacao.idUsuario);
            username.textContent = publicacao.idUsuario;

            var commentTextElement = document.createElement("p");
            commentTextElement.textContent = commentText;

            commentContent.appendChild(username);
            commentContent.appendChild(commentTextElement);

            newComment.appendChild(profileImg);
            newComment.appendChild(commentContent);

            commentsSection.appendChild(newComment);

            textarea.value = "";
            commentsSection.removeChild(textarea);
            commentsSection.removeChild(sendButton);
          } else {
            alert("Erro ao adicionar comentário");
          }
        });
      });

      commentsSection.appendChild(textarea);
      commentsSection.appendChild(sendButton);
    });

    post.appendChild(userHeader);
    post.appendChild(publicacaoText);
    post.appendChild(likeButton);
    post.appendChild(commentButton);
    post.appendChild(commentsSection);

    // Verifica se a publicação pertence ao usuário logado
    var idUsuario = sessionStorage.getItem("id_usuario");
    if (idUsuario && publicacao.idAluno == idUsuario) {
      var editButton = document.createElement("button");
      editButton.innerHTML = '<i class="fas fa-edit"></i>';
      editButton.classList.add("edit-button");

      editButton.addEventListener("click", function () {
        // Redireciona para a página de edição da publicação
        window.location.href = `editar-publi.html?id=${publicacao.id}`;
      });

      post.appendChild(editButton);

      var deleteButton = document.createElement("button");
      deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
      deleteButton.classList.add("delete-button");

      deleteButton.addEventListener("click", function () {
        // Exibe uma mensagem de confirmação
        var confirmDelete = confirm("Tem certeza que deseja apagar esta publicação?");
        if (confirmDelete) {
          // Envia a requisição para excluir a publicação
          fetch(`http://localhost:8080/publicacoes/delete/${publicacao.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: publicacao.id })
          }).then((response) => {
            if (response.ok) {
              // Remove o post da interface
              postContainer.parentNode.removeChild(postContainer);
              alert("Publicação apagada com sucesso!");
            } else {
              alert("Erro ao apagar a publicação");
            }
          });
        }
      });

      post.appendChild(deleteButton);
    }

    postContainer.appendChild(post);

    return postContainer;
  }
});
let a;
fetch(`http://localhost:3000/ocr/`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
.then((response) => response.json())
.then((data) => {
  a = data;
  console.log(data);
})