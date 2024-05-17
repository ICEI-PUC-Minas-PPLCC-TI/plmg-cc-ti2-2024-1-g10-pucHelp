document.addEventListener('DOMContentLoaded', function() {
    // Verifica se há uma matrícula de usuário armazenada no sessionStorage
    var matriculaUsuario = sessionStorage.getItem('matricula');

    // Realiza uma requisição GET para obter os dados do usuário do back-end
    fetch("http://localhost:8080/usuario/" + matriculaUsuario, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((response) => response.json())
    .then((usuario) => {
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
            if (usuario.id === idUsuarioLogado) {
                // Se sim, exibe opções de edição de dados
                var editOptions = document.createElement('div');
                editOptions.innerHTML = '<a href="editar-perfil.html">Editar Perfil</a>';
                document.querySelector('.navbar').appendChild(editOptions);
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
