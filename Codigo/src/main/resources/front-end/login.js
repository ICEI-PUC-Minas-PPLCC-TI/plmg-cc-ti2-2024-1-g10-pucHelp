document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impedir o comportamento padrão de enviar o formulário

        // Obter os valores de Matrícula e senha do formulário
        const matricula = form.querySelector("#matricula").value;
        const senha = form.querySelector("#senha").value;

        // Aqui você pode fazer uma requisição AJAX para o backend para verificar as credenciais do usuário
        // Exemplo de requisição utilizando fetch:
        fetch('http://localhost:8080/login', { // Alteração da rota para 'http://localhost:8080/login'
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ matricula: matricula, senha: senha }) // Enviar os dados de login como JSON
        })
        .then(response => {
            if (response.ok) {
                console.log(response)
                // return arguments;
                // Redirecionar o usuário para a página principal após o login bem-sucedido
                // Salvar informações do usuário na sessionStorage
                sessionStorage.setItem('matricula', matricula);
                sessionStorage.setItem('senha', senha);
                window.location.href = 'feed.html';


            } else {
                // Exibir mensagem de erro para o usuário caso as credenciais estejam incorretas
                alert('Matrícula ou senha incorretos. Por favor, tente novamente.');
            }
        })
        .catch(error => {
            console.error('Erro ao fazer login:', error);
            // Exibir mensagem de erro genérica caso ocorra algum problema na requisição
            alert('Ocorreu um erro ao fazer login. Por favor, tente novamente mais tarde.');
        });
    });
});
