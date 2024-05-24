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
    const tipoUsuarioSelect = document.querySelector('#tipo-usuario');
    const cursoSelect = document.querySelector('#curso');
    const idUsuario = sessionStorage.getItem('id_usuario'); // Obtenha o ID do usuário da sessão

    const urlTiposUsuario = 'http://localhost:8080/tiposusuario';
    const urlCursos = 'http://localhost:8080/cursos';
    const urlUsuario = `http://localhost:8080/usuario/${idUsuario}`;

    // Função para preencher as opções do select com os tipos de usuários
    function preencherTiposUsuario(tiposUsuario) {
        // Limpar opções existentes
        tipoUsuarioSelect.innerHTML = '';

        // Adicionar opção padrão
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Selecione o tipo de usuário';
        tipoUsuarioSelect.appendChild(defaultOption);

        // Preencher opções com os tipos de usuários
        tiposUsuario.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id;
            option.textContent = tipo.nome;
            tipoUsuarioSelect.appendChild(option);
        });
    }

    // Função para preencher as opções do select com os cursos
    function preencherCursos(cursos) {
        // Limpar opções existentes
        cursoSelect.innerHTML = '';

        // Adicionar opção padrão
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Selecione seu curso';
        cursoSelect.appendChild(defaultOption);

        // Preencher opções com os cursos obtidos
        cursos.forEach(curso => {
            const option = document.createElement('option');
            option.value = curso.id;
            option.textContent = curso.nome;
            cursoSelect.appendChild(option);
        });
    }

    // Fazer requisição para obter os tipos de usuários
    fetch(urlTiposUsuario)
        .then(response => response.json())
        .then(data => preencherTiposUsuario(data))
        .catch(error => console.error('Erro ao obter tipos de usuários:', error));

    // Fazer requisição para obter os cursos
    fetch(urlCursos)
        .then(response => response.json())
        .then(data => preencherCursos(data))
        .catch(error => console.error('Erro ao obter cursos:', error));

    // Preencher o formulário com os dados do usuário
    fetch(urlUsuario)
        .then(response => response.json())
        .then(usuario => {
            console.log(usuario);
            document.getElementById('nome').value = usuario.nome;
            document.getElementById('cpf').value = usuario.cpf;
            document.getElementById('matricula').value = usuario.matricula;
            document.getElementById('curso').value = usuario.idcurso;
            document.getElementById('periodo').value = usuario.periodo;
            document.getElementById('tipo-usuario').value = usuario.tipo;
        })
        .catch(error => console.error('Erro ao obter dados do usuário:', error));

    // Enviar a atualização do perfil
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impedir o comportamento padrão de enviar o formulário
        const cpf = form.querySelector("#cpf").value;
        const nome = form.querySelector("#nome").value;
        const senha = form.querySelector("#senha").value;
        const periodo = form.querySelector("#periodo").value;
        const idCurso = form.querySelector("#curso").value;
        const tipoUsuario = form.querySelector("#tipo-usuario").value;
        const email = form.querySelector("#email").value;

    
        const data = {
            cpf: cpf,
            nome: nome,
            periodo: periodo,
            idCurso: idCurso,
            tipoUsuario: tipoUsuario,
            email: email
        };
    
        if (senha) {
            data.senha = senha;
        }
    
        fetch(urlUsuario, { // Certifique-se de que `url` e `id` estão definidos corretamente
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Erro ao atualizar perfil');
        })
        .then(data => {
            alert('Perfil atualizado com sucesso!');
            window.location.href = 'perfil.html'; // Redirecionar para a página de perfil
        })
        .catch(error => {
            console.error('Erro ao atualizar perfil:', error);
            alert('Erro ao atualizar perfil.');
        });
    });
    
});
