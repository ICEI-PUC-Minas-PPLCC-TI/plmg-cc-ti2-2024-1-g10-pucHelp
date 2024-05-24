document.addEventListener('DOMContentLoaded', function() {
    if (!sessionStorage.getItem("id_usuario")) {
        // Se não estiver logado, exibe um alerta
        alert("Você precisa estar logado para acessar esta página.");
        
        // Redireciona para a página de login após 1 segundo
        setTimeout(function() {
            window.location.href = "login.html"; // Altere para o caminho correto da sua página de login
        }, 1000);
    }

    const form = document.querySelector('#edit-course-form');
    const idCursoInput = form.querySelector('#id-curso');
    const nomeInput = form.querySelector('#nome');
    const idAreaInput = form.querySelector('#id-area');

    // Função para obter o ID do curso da URL
    function getCursoIdFromURL() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get('id'); // Obtém o valor do parâmetro 'id' da URL
    }

    // Função para preencher os campos do curso com os dados correspondentes
    function preencherCamposCurso(curso) {
        idCursoInput.value = curso.id;
        nomeInput.value = curso.nome;
        idAreaInput.value = curso.idArea;
    }

    // Função para obter os dados do curso do servidor e preencher os campos do formulário
    function carregarDadosCurso() {
        const idCurso = getCursoIdFromURL();
        if (!idCurso) {
            console.error('ID do curso não fornecido na URL');
            return;
        }

        // URL da requisição para obter os detalhes do curso
        const urlDetalhesCurso = `http://localhost:8080/cursos/${idCurso}`;

        // Fazer requisição GET para obter os detalhes do curso
        fetch(urlDetalhesCurso)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Erro ao obter detalhes do curso');
            })
            .then(data => {
                // Preencher os campos do curso com os dados obtidos
                preencherCamposCurso(data);
            })
            .catch(error => {
                console.error('Erro ao obter detalhes do curso:', error);
                // Tratar erro, exibir mensagem de erro, etc.
            });
    }

    // Carregar dados do curso ao carregar a página
    carregarDadosCurso();

    // Adicionar evento de envio do formulário
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impedir o comportamento padrão de enviar o formulário

        // Construa a URL com os queryParams
        const url = 'http://localhost:8080/cursos';

        // Obter os dados atualizados do formulário
        const requestData = {
            nome: nomeInput.value,
            idArea: parseInt(idAreaInput.value) // Converte para número inteiro
        };

        const formData = new FormData(form);


        // ID do curso a ser atualizado
        const idCurso = formData.get('id-curso');

        // URL da requisição para atualizar os detalhes do curso
        const urlAtualizarCurso = `${url}/${idCurso}`;

        // Fazer requisição PUT para atualizar os detalhes do curso
        fetch(urlAtualizarCurso, {
            method: 'PUT',
            body: JSON.stringify(requestData)
        })
            .then(response => {
                if (response.ok) {
                    // Exibir mensagem de curso atualizado com sucesso
                    alert('Curso atualizado com sucesso!');
                    // Redirecionar para a página de listagem de cursos após 2 segundos
                    setTimeout(function() {
                        window.location.href = 'listagem-cursos.html';
                    }, 2000);
                } else {
                    throw new Error('Erro ao atualizar curso');
                }
            })
            .catch(error => {
                console.error('Erro ao atualizar curso:', error);
                // Exibir mensagem de erro para o usuário, etc.
            });
    });
});
