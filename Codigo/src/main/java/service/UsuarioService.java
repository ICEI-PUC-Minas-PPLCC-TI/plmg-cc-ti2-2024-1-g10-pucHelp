package service;

import dao.UsuarioDAO;
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
	
	public Object get(Request request, Response response) {
		int matricula = Integer.parseInt(request.params(":matricula"));
		
		Usuario produto = (Usuario) usuarioDao.get(matricula);
		
		if (produto != null) {
    	    response.header("Content-Type", "application/xml");
    	    response.header("Content-Encoding", "UTF-8");

            return "<usuario>\n" + 
            		"\t<matricula>" + produto.getMatricula() + "</matricula>\n" +
            		"\t<nome>" + produto.getNome() + "</nome>\n" +
            		"\t<cpf>" + produto.getCpf() + "</cpf>\n" +
            		"\t<periodo>" + produto.getPeriodo() + "</periodo>\n" +
            		"\t<curso>" + produto.getIdCurso() + "</curso>\n" +
            		"\t<tipo>" + produto.getTipo() + "</tipo>\n" +
            		"</usuario>\n";
        } else {
            response.status(404); // 404 Not found
            return "Usuario " + matricula + " não encontrado.";
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
}
