if (!sessionStorage.getItem("id_usuario")) {
  // Se não estiver logado, exibe um alerta
  alert("Você precisa estar logado para acessar esta página.");
  
  // Redireciona para a página de login após 1 segundo
  setTimeout(function() {
      window.location.href = "login.html"; // Altere para o caminho correto da sua página de login
  }, 0);
}

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
  username.textContent = "nome_usuario";

  userHeader.appendChild(profileImg);
  userHeader.appendChild(username);

  var publicacaoText = document.createElement("p");
  publicacaoText.textContent = publicacao;

  var likeButton = document.createElement("button");
  likeButton.textContent = "Like";
  likeButton.classList.add("like-button");

  var commentButton = document.createElement("button");
  commentButton.textContent = "Comment";
  commentButton.classList.add("comment-button");

  var commentsSection = document.createElement("div");
  commentsSection.classList.add("comments");

  post.appendChild(userHeader);
  post.appendChild(publicacaoText);
  post.appendChild(likeButton);
  post.appendChild(commentButton);
  post.appendChild(commentsSection);

  postContainer.appendChild(post);
  function addLike(publicacaoId) {
    fetch(`http://localhost:8080/publicacao/${publicacaoId}/like`, {
      method: "POST",
    }).then((response) => {
      if (response.ok) {
        console.log("Like added.");
      } else {
        console.error("Failed to add like.");
      }
    });
  }

  function addComment(publicacaoId, commentText) {
    fetch(`http://localhost:8080/publicacao/${publicacaoId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        comment: commentText,
      }),
    }).then((response) => {
      if (response.ok) {
        console.log("Comment added.");
      } else {
        console.error("Failed to add comment.");
      }
    });
  }

  var publicacoes = localStorage.getItem("publicacoes");
  if (publicacoes) {
    publicacoes = JSON.parse(publicacoes);
    var publicacoesContainer = document.getElementById("publicacoes-container");
    for (var i = publicacoes.length - 1; i >= 0; i--) {
      var post = criarPost(publicacoes[i].id, publicacoes[i].content);
      publicacoesContainer.appendChild(post);
    }
  }
  return postContainer;
}
