package service;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import dao.UsuarioDAO;
import model.TipoUsuario;
import model.Usuario;
import spark.Request;
import spark.Response;

public class UsuarioService {
	private UsuarioDAO usuarioDao;
	
	public UsuarioService() {
			usuarioDao = new UsuarioDAO();
			usuarioDao.conectar();
	}
	
	public Object add(Request request, Response response) {
		String cpf = request.queryParams("cpf");
		int matricula = Integer.parseInt(request.queryParams("matricula"));
		String nome = request.queryParams("nome");
		String senha = request.queryParams("senha");
		int tipo = Integer.parseInt(request.queryParams("tipo"));
		int periodo = Integer.parseInt(request.queryParams("periodo"));
		int idCurso = Integer.parseInt(request.queryParams("idCurso"));

		int id = usuarioDao.getMaxId() + 1;

		Usuario usuario = new Usuario(cpf, nome, senha, matricula, tipo, idCurso, periodo);
		System.out.println(usuario);
		usuarioDao.inserirUsuario(usuario);
		

		response.status(201); // 201 Created
		return id;
	}
	
	public Usuario get(Request request, Response response) {
	    try {
	        // Obter o corpo da solicitação como uma string
	        String requestBody = request.body();

	        // Converter a string do corpo para um objeto JSON
	        JSONObject jsonBody = new JSONObject(requestBody);

	        // Verificar se o objeto JSON contém a chave "matricula"
	        if (jsonBody.has("matricula")) {
	            // Obter a matrícula do objeto JSON
	            int matricula = jsonBody.getInt("matricula");

	            // Usar a matrícula para obter o usuário correspondente
	            System.out.println(matricula);
	            Usuario usuario = usuarioDao.getByMatricula(matricula);

	            if (usuario != null) {
	                response.header("Content-Type", "application/xml");
	                response.header("Content-Encoding", "UTF-8");

	                return usuario;
	            } else {
	                response.status(404); // 404 Not found
	                return null;
	            }
	        } else {
	            // Se a chave "matricula" não estiver presente no corpo da solicitação
	            response.status(400); // Bad Request
	            return null;
	        }
	    } catch (Exception e) {
	        // Tratar qualquer exceção que possa ocorrer durante o processamento da solicitação
	        response.status(500); // Internal Server Error
	        return null;
	    }
	}

	
	public Object update(Request request, Response response) {
        int id = Integer.parseInt(request.params(":id"));
        
		Usuario usuario = (Usuario) usuarioDao.get(id);

        if (usuario != null) {
        	usuario.setCpf(request.queryParams("cpf"));
        	usuario.setNome(request.queryParams("nome"));
        	usuario.setIdCurso(Integer.parseInt(request.queryParams("IdCurso")));
        	usuario.setPeriodo(Integer.parseInt(request.queryParams("periodo")));
        	usuario.setSenha(request.queryParams("senha"));

        	usuarioDao.atualizarUsuario(usuario);
            return id;
        } else {
            response.status(404); // 404 Not found
            return "Produto não encontrado.";
        }	
    }
	public Object remove(Request request, Response response) {
        int id = Integer.parseInt(request.params(":id"));

        Usuario usuario = (Usuario) usuarioDao.get(id);

        if (usuario != null) {

            usuarioDao.excluirUsuario(id);

            response.status(200); // success
        	return id;
        } else {
            response.status(404); // 404 Not found
            return "Produto não encontrado.";
        }
	}

	public Object getAll(Request request, Response response) {
		StringBuffer returnValue = new StringBuffer("<usuarios type=\"array\">");
		for (Usuario usuario : usuarioDao.getAll()) {
			returnValue.append("\n<usuario>\n" + 
            		"\t<matricula>" + usuario.getMatricula() + "</matricula>\n" +
            		"\t<nome>" + usuario.getNome() + "</nome>\n" +
            		"\t<cpf>" + usuario.getCpf() + "</cpf>\n" +
            		"\t<periodo>" + usuario.getPeriodo() + "</periodo>\n" +
            		"\t<curso>" + usuario.getIdCurso() + "</curso>\n" +
            		"\t<tipo>" + usuario.getTipo() + "</tipo>\n" +
            		"</usuario>\n");
		}
		returnValue.append("</produtos>");
	    response.header("Content-Type", "application/xml");
	    response.header("Content-Encoding", "UTF-8");
		return returnValue.toString();
	}
	
    public String getAllTypesUserJSON() {
        List<TipoUsuario> tiposUsuarios = usuarioDao.getTiposUsuarios();
        
        JSONArray jsonArray = new JSONArray();
        for (TipoUsuario tipoUsuario : tiposUsuarios) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("id", tipoUsuario.getId());
            jsonObject.put("nome", tipoUsuario.getNome());
            jsonArray.put(jsonObject);
        }
        
        return jsonArray.toString();
    }
    
    public String login(Request request, Response response) {
        // Obter o objeto Usuario usando a matrícula fornecida na solicitação
        Usuario user = this.get(request, response);
        
        // Verificar se o usuário foi encontrado
        if (user == null) {
            response.status(404); // 404 Not Found
            return "Usuário não encontrado";
        }

        try {
            // Obter o corpo da solicitação como JSON
            JSONObject requestBody = new JSONObject(request.body());

            // Extrair a senha do JSON
            String senha = requestBody.getString("senha");
            System.out.println(senha);

            // Verificar se a senha fornecida coincide com a senha do usuário
            if (user.getSenha().equals(senha)) {
                // Criar um novo objeto JSON com os dados do usuário
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("matricula", user.getMatricula());
                jsonObject.put("nome", user.getNome());
                jsonObject.put("id_curso", user.getIdCurso());
                jsonObject.put("tipo", user.getTipo());
                jsonObject.put("periodo", user.getPeriodo());
                jsonObject.put("cpf", user.getCpf());
                
                // Retornar o objeto JSON como string
                System.out.println(jsonObject.toString());
                return jsonObject.toString();
            } else {
                response.status(401); // 401 Unauthorized
                return "Senha incorreta";
            }
        } catch (Exception e) {
            response.status(400); // 400 Bad Request
            return "Erro ao processar a solicitação";
        }
    }

}
