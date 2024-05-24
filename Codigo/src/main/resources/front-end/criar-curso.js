document.addEventListener('DOMContentLoaded', function() {
    if (!sessionStorage.getItem("id_usuario")) {
        // Se não estiver logado, exibe um alerta
        alert("Você precisa estar logado para acessar esta página.");
        
        // Redireciona para a página de login após 1 segundo
        setTimeout(function() {
            window.location.href = "login.html"; // Altere para o caminho correto da sua página de login
        }, 1000);
    }

    const form = document.querySelector('form');
    const nomeCurso = form.querySelector("#nome");
    const areaCurso = form.querySelector("#idArea");

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impedir o comportamento padrão de enviar o formulário

        // Construa a URL com os queryParams
        const url = 'http://localhost:8080/cursos';

        const requestData = {
            nome: nomeCurso.value,
            idArea: parseInt(areaCurso.value) // Converte para número inteiro
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Indica que o corpo da requisição é JSON
            },
            body: JSON.stringify(requestData) // Converte o objeto em JSON
        })
        .then(response => {
            if (response.ok) {
                // Exibir mensagem de curso cadastrado com sucesso
                alert('Curso cadastrado com sucesso!');
                // Redirecionar para a página de login após 2 segundos
                setTimeout(function() {
                    window.location.href = '/login.html';
                }, 2000);
            } else {
                throw new Error('Erro ao cadastrar curso');
            }
        })
        .catch(error => {
            console.error('Erro ao cadastrar curso:', error);
            // Exibir mensagem de erro para o usuário
            alert('Erro ao cadastrar curso. Por favor, tente novamente mais tarde.');
        });
    });
});
