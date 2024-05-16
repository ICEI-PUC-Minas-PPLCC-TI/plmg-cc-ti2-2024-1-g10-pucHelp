    // Construa a URL com os queryParams
    const url = 'http://localhost:8080/usuario';

// Este arquivo está vazio, mas pode ser usado para adicionar lógica JavaScript relacionada ao registro se necessário.
document.addEventListener('DOMContentLoaded', function() {

    const form = document.querySelector('form');


    const tipoUsuarioSelect = document.querySelector('#tipo-usuario');
    
        // URL da requisição para obter os tipos de usuários
        const urlTiposUsuario = 'http://localhost:8080/tiposusuario';
    
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
                option.value = tipo.id; // Definir o valor como o ID do tipo de usuário
                option.textContent = tipo.nome; // Definir o texto como o nome do tipo de usuário
                tipoUsuarioSelect.appendChild(option);
            });
        }
    
        // Fazer requisição para obter os tipos de usuários
        fetch(urlTiposUsuario)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Erro ao obter tipos de usuários');
        })
        .then(data => {
            // Preencher as opções do select com os tipos de usuários obtidos
            preencherTiposUsuario(data);
        })
        .catch(error => {
            console.error('Erro ao obter tipos de usuários:', error);
            // Tratar erro, exibir mensagem de erro, etc.
        });


        const cursoSelect = document.querySelector('#curso');

    // URL da requisição para obter os cursos
    const urlCursos = 'http://localhost:8080/cursos';

    // Função para preencher as opções do select com os cursos
    function preencherCursos(cursos) {
        // Limpar opções existentes
        cursoSelect.innerHTML = '';

        // Adicionar opção padrão
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Selecione seu curso';
        cursoSelect.appendChild(defaultOption);
        console.log(cursos);
        // Preencher opções com os cursos obtidos
        cursos.forEach(curso => {
            const option = document.createElement('option');
            option.value = curso.id; // Definir o valor como o ID do curso
            option.textContent = curso.nome; // Definir o texto como o nome do curso
            cursoSelect.appendChild(option);
        });
    }

    // Fazer requisição para obter os cursos
    fetch(urlCursos)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Erro ao obter cursos');
    })
    .then(data => {
        // Preencher as opções do select com os cursos obtidos
        preencherCursos(data);
    })
    .catch(error => {
        console.error('Erro ao obter cursos:', error);
        // Tratar erro, exibir mensagem de erro, etc.
    });
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impedir o comportamento padrão de enviar o formulário
        const cpf = form.querySelector("#cpf");
        const nome = form.querySelector("#nome");
        const matricula = form.querySelector("#matricula");
        const senha = form.querySelector("#senha");
        const periodo = form.querySelector("#periodo");
        const idCurso = form.querySelector("#curso");
        const tipoUsuario = form.querySelector("#tipo-usuario");
        const formData = new FormData();
        formData.append('cpf', cpf);
        formData.append('matricula', matricula);
        formData.append('nome', nome);
        formData.append('senha', senha);
        formData.append('tipo', tipoUsuario);
        formData.append('periodo', periodo);
        formData.append('idCurso', 1);


        const queryParams = new URLSearchParams({
            cpf: cpf.value,
            matricula: matricula.value,
            nome: nome.value,
            senha: senha.value,
            tipo: tipoUsuario.value,
            periodo: periodo.value,
            idCurso: idCurso.value
        });

        console.log(queryParams);
        const requestUrl = `${url}?${queryParams}`;

        fetch(requestUrl, {
            method: 'POST',
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Erro ao registrar usuário');
        })
        .then(data => {
            console.log('Usuário registrado com sucesso:', data);
            // Redirecionar para outra página, exibir mensagem de sucesso, etc.
        })
        .catch(error => {
            console.error('Erro ao registrar usuário:', error);
            // Exibir mensagem de erro para o usuário, etc.
        });
    });
});