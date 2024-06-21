document.addEventListener("DOMContentLoaded", function () {
  if (!sessionStorage.getItem("id_usuario")) {
    // Se não estiver logado, exibe um alerta
    alert("Você precisa estar logado para acessar esta página.");

    // Redireciona para a página de login após 1 segundo
    setTimeout(function () {
      window.location.href = "login.html"; // Altere para o caminho correto da sua página de login
    }, 1000);
  }

  const searchBox = document.querySelector(".search-box");
  const resultContainer = document.querySelector(".result-container");

  // URL da rota para obter todos os perfis
  const urlTodosPerfis = "http://localhost:8080/usuario";

  let todosPerfis = []; // Array para armazenar todos os perfis obtidos

  // Função para buscar todos os perfis do banco de dados
  function buscarTodosPerfis() {
    fetch(urlTodosPerfis)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Erro ao buscar todos os perfis");
      })
      .then((data) => {
        console.log(data);
        // Armazenar os perfis obtidos na variável todosPerfis
        todosPerfis = data;

        // Preencher os resultados com base nos perfis obtidos
        preencherResultados(todosPerfis);
      })
      .catch((error) => {
        console.error("Erro ao buscar todos os perfis:", error);
        // Exibir mensagem de erro para o usuário, etc.
      });
  }

  // Função para preencher os resultados com base nos perfis obtidos
  function preencherResultados(perfis) {
    // Limpar resultados anteriores
    resultContainer.innerHTML = "";

    // Verificar se há perfis para exibir
    if (perfis.length === 0) {
      // Se não houver perfis, exibir uma mensagem indicando que nenhum perfil foi encontrado
      const mensagem = document.createElement("p");
      mensagem.textContent = "Nenhum perfil encontrado.";
      resultContainer.appendChild(mensagem);
    } else {
      // Filtrar perfis com base no termo de pesquisa
      const termoPesquisa = searchBox.value.toLowerCase();
      const perfisFiltrados = perfis.filter(
        (perfil) =>
          perfil.nome.toLowerCase().includes(termoPesquisa) ||
          perfil.email?.toLowerCase().includes(termoPesquisa)
      );

      // Se não houver perfis filtrados, exibir uma mensagem indicando que nenhum perfil foi encontrado
      if (perfisFiltrados.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhum perfil encontrado.";
        resultContainer.appendChild(mensagem);
      } else {
        // Se houver perfis filtrados, criar elementos HTML para cada perfil e adicioná-los ao container de resultados
        perfisFiltrados.forEach(async (perfil) => {
          const divResult = document.createElement("div");
          divResult.classList.add("col-md-6"); // Adiciona a classe col-md-6 para dividir em duas colunas
          divResult.innerHTML = `
            <div class="result">
              <img class="profile-img" src="${perfil.imagem}" alt="Profile Image">
              <div class="username">${perfil.nome}</div>
              <div class="info">
                <p>Curso: ${await obterNomeCurso(perfil.idCurso)}</p>
                <p>Período: ${perfil.periodo}</p>
                <p>Email: ${perfil.email}</p>
              </div>
            </div>
          `;
          resultContainer.classList.add("row");
          resultContainer.appendChild(divResult);
        });
      }
    }
  }

  // Função para obter o nome do curso baseado no ID do curso
  async function obterNomeCurso(idCurso) {
    try {
      const response = await fetch(`http://localhost:8080/cursos/${idCurso}`);
      if (!response.ok) {
        throw new Error("Erro ao obter os dados do curso");
      }
      const curso = await response.json();
      return curso.nome;
    } catch (error) {
      console.error("Erro ao obter os dados do curso:", error);
      return "Curso não encontrado";
    }
  }

  // Adicionar evento de digitação para a caixa de pesquisa
  searchBox.addEventListener("input", function () {
    // Preencher os resultados com base nos perfis obtidos e filtrados
    preencherResultados(todosPerfis);
  });

  // Inicializar a busca de todos os perfis ao carregar a página
  buscarTodosPerfis();
});
