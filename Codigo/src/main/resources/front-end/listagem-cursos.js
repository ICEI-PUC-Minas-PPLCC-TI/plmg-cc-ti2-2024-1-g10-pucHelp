document.addEventListener("DOMContentLoaded", function () {
    if (!sessionStorage.getItem("id_usuario")) {
        // Se não estiver logado, exibe um alerta
        alert("Você precisa estar logado para acessar esta página.");
        
        // Redireciona para a página de login após 1 segundo
        setTimeout(function() {
            window.location.href = "login.html"; // Altere para o caminho correto da sua página de login
        }, 1000);
    }

  const cursosLista = document.getElementById("cursos-lista");

  // URL da requisição para obter os cursos
  const urlCursos = "http://localhost:8080/cursos";

  // Função para criar um elemento de curso na lista
  function criarElementoCurso(curso) {
    const divCurso = document.createElement("div");
    divCurso.classList.add("curso");

    const h3Nome = document.createElement("h3");
    h3Nome.textContent = curso.nome;

    const divAcoes = document.createElement("div");
    divAcoes.classList.add("acoes");

    // Ícone de edição do curso
    const btnEditar = document.createElement("button");
    btnEditar.classList.add("edit-course");
    btnEditar.innerHTML = '<i class="fas fa-edit"></i>';
    btnEditar.setAttribute("data-course-id", curso.id); // Define o ID do curso como atributo de dados
    divAcoes.appendChild(btnEditar);

    // Ícone de deleção do curso
    const btnDeletar = document.createElement("button");
    btnDeletar.classList.add("delete-course");
    btnDeletar.innerHTML = '<i class="fas fa-trash-alt"></i>';
    btnDeletar.setAttribute("data-course-id", curso.id); // Define o ID do curso como atributo de dados
    btnDeletar.style.display = "none"; // Oculta o botão de deleção

    divAcoes.appendChild(btnDeletar);

    divCurso.appendChild(h3Nome);
    divCurso.appendChild(divAcoes);

    cursosLista.appendChild(divCurso);
  }

  // Função para deletar um curso
  function deletarCurso(cursoId) {
    // Solicita confirmação antes de deletar o curso
    const confirmacao = confirm(
      "Tem certeza que deseja deletar este curso? Esta ação é irreversível."
    );

    if (confirmacao) {
      // URL da rota para deletar o curso com o ID fornecido
      const urlDeletarCurso = `http://localhost:8080/cursos/${cursoId}`;

      // Opções da requisição DELETE
      const options = {
        method: "DELETE",
      };

      // Fazer a requisição DELETE para deletar o curso
      fetch(urlDeletarCurso, options)
        .then((response) => {
          if (response.ok) {
            // Curso deletado com sucesso
            console.log("Curso deletado com sucesso:", cursoId);
            // Recarregar a página para atualizar a lista de cursos após a deleção
            location.reload();
          } else {
            // Erro ao deletar o curso
            throw new Error("Erro ao deletar curso");
          }
        })
        .catch((error) => {
          console.error("Erro ao deletar curso: ", error);
          // Exibir mensagem de erro para o usuário, etc.
        });
    }
  }

  // Fazer requisição para obter os cursos
  fetch(urlCursos)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Erro ao obter cursos");
    })
    .then((data) => {
      // Criar elementos de curso na lista com os cursos obtidos
      data.forEach((curso) => {
        criarElementoCurso(curso);
      });

      // Adicionar ouvinte de evento de clique para cada botão de edição de curso
      const editButtons = document.querySelectorAll(".edit-course");
      editButtons.forEach((button) => {
        button.addEventListener("click", function () {
          // Obtém o ID do curso do atributo de dados do botão
          const courseId = button.dataset.courseId;

          // Redireciona o usuário para a página de edição de curso com o ID do curso como parâmetro na URL
          window.location.href = `editar-curso.html?id=${courseId}`;
        });
      });

      // Adicionar ouvinte de evento de clique para cada botão de deleção de curso
      const deleteButtons = document.querySelectorAll(".delete-course");
      console.log(deleteButtons);
      deleteButtons.forEach((button) => {
        button.addEventListener("click", function () {
          // Obtém o ID do curso do atributo de dados do botão
          const courseId = button.dataset.courseId;

          // Solicita confirmação antes de deletar o curso
          if (
            confirm(
              "Tem certeza que deseja deletar este curso? Esta ação é irreversível."
            )
          ) {
            deletarCurso(courseId);
          }
        });
      });
    })
    .catch((error) => {
      console.error("Erro ao obter cursos:", error);
      // Tratar erro, exibir mensagem de erro, etc.
    });
});
