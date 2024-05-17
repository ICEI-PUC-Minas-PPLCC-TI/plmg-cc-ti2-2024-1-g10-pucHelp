document.getElementById("publicar-btn").addEventListener("click", function(event) {
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
