document.getElementById("publicar-btn").addEventListener("click", function(event) {
    if (!sessionStorage.getItem("id_usuario")) {
        // Se não estiver logado, exibe um alerta
        alert("Você precisa estar logado para acessar esta página.");
        
        // Redireciona para a página de login após 1 segundo
        setTimeout(function() {
            window.location.href = "login.html"; // Altere para o caminho correto da sua página de login
        }, 1000);
    }

    event.preventDefault();

    // Obter o ID do aluno da sessionStorage
    var idAluno = sessionStorage.getItem("id_usuario");

    var conteudo = document.getElementById("publicacao").value;
    var curso = document.getElementById("curso").value;
    var tipo = curso; 

    var formData = {
        tipo: tipo,
        conteudo: conteudo,
        idAluno: idAluno
    };

    fetch('http://localhost:8080/publicacao', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        window.location.href = "feed.html";
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao criar publicação.');
    });
});
