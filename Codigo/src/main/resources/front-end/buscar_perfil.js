// Aqui você pode adicionar funcionalidades JavaScript, se necessário
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
          divResult.classList.add("result");

          const imgProfile = document.createElement("img");
          imgProfile.classList.add("profile-img");
          imgProfile.src = perfil.imagem; // Substitua 'imagem' pelo nome do campo correspondente no objeto de perfil retornado pelo back-end
          imgProfile.alt = "Profile Image";
          divResult.appendChild(imgProfile);

          const divUsername = document.createElement("div");
          divUsername.classList.add("username");
          divUsername.textContent = perfil.nome; // Substitua 'nome' pelo nome do campo correspondente no objeto de perfil retornado pelo back-end
          divResult.appendChild(divUsername);

          const divInfo = document.createElement("div");
          divInfo.classList.add("info");

          // Adicione informações adicionais conforme necessário (unidade, curso, período, email)
          // Certifique-se de substituir os nomes dos campos pelos nomes correspondentes nos objetos de perfil retornados pelo back-end
          const infoUnidade = document.createElement("p");
          infoUnidade.textContent = "Unidade: " + perfil.unidade;
          divInfo.appendChild(infoUnidade);

          const infoCurso = document.createElement("p");
          infoCurso.textContent = "Curso: " + perfil.idCurso;

          // Realiza uma requisição GET para obter os dados do curso associado ao usuário
          await fetch(`http://localhost:8080/cursos/${perfil.idCurso}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((curso) => {
              // Verifica se os dados do curso foram recebidos corretamente
              if (curso) {
                // Preenche o campo "Curso" nas informações do perfil com o nome do curso
                infoCurso.textContent = "Curso: " + curso.nome;
              } else {
                // console.error(
                //   "Erro ao obter os dados do curso associado ao usuário"
                // );
              }
            })
            .catch((error) => {
              console.error("Erro:", error);
              //   alert("Erro ao obter os dados do curso associado ao usuário.");
            });
          divInfo.appendChild(infoCurso);

          const infoPeriodo = document.createElement("p");
          infoPeriodo.textContent = "Período: " + perfil.periodo;
          divInfo.appendChild(infoPeriodo);

          const infoEmail = document.createElement("p");
          infoEmail.textContent = "Email: " + perfil.email;
          divInfo.appendChild(infoEmail);

          divResult.appendChild(divInfo);

          resultContainer.appendChild(divResult);
        });
      }
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
