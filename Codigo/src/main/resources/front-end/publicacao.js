// Aqui você pode adicionar funcionalidades JavaScript, se necessário
document.getElementById("publicar-btn").addEventListener("click", function(event) {
    event.preventDefault();

    var conteudo = document.getElementById("publicacao").value;
    var idAluno = document.getElementById("idAluno").value;
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