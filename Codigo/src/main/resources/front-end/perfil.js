document.addEventListener('DOMContentLoaded', function() {
    // Verifica se há um ID de usuário armazenado no sessionStorage
    var idUsuario = sessionStorage.getItem('id');

    // Realiza uma requisição GET para obter os dados do usuário do back-end
    fetch("http://localhost:8080/usuario/" + idUsuario, {
        method: "GET",
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
        } else {
            console.error("Erro ao obter os dados do usuário do back-end");
        }
    })
    .catch((error) => {
        console.error("Erro:", error);
        alert("Erro ao obter os dados do usuário.");
    });
});
