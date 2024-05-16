package service;

import dao.PublicacaoDAO;
import model.Publicacao;
import spark.Request;
import spark.Response;

public class PublicacaoService {
    private PublicacaoDAO publicacaoDao;

    public PublicacaoService() {
        publicacaoDao = new PublicacaoDAO();
        publicacaoDao.conectar();
    }
    public String create(Request request, Response response) {
        String tipo = request.queryParams("tipo");
        String conteudo = request.queryParams("conteudo");
        int idAluno = Integer.parseInt(request.queryParams("idAluno"));

        Publicacao publicacao = new Publicacao(0, tipo, conteudo, idAluno, 0, ""); // id 0 para autoincremento no banco

        if (publicacaoDao.inserirPublicacao(publicacao)) {
            response.status(201); // Created
            return "Publicação criada com sucesso!";
        } else {
            response.status(500); // Internal Server Error
            return "Erro ao criar a publicação. Por favor, tente novamente mais tarde.";}
        }

 
	public Object addLike(Request request, Response response) {
		 int id = Integer.parseInt(request.params(":id"));
	        Publicacao publicacao = publicacaoDao.get(id);
	        
	        if (publicacao != null) {
	            publicacao.setLike(publicacao.getLike() + 1);
	            publicacaoDao.atualizarPublicacao(publicacao);
	            response.status(200); // OK
	            return "Like added.";
	        } else {
	            response.status(404); // Not Found
	            return "Publicacao not found.";
	        }
	}

	public Object addComment(Request request, Response response) {
		int id = Integer.parseInt(request.params(":id"));
        String comment = request.queryParams("comment");
        
        Publicacao publicacao = publicacaoDao.get(id);
        
        if (publicacao != null) {
            String updatedComments = publicacao.getComents() + "\n" + comment;
            publicacao.setComents(updatedComments);
            publicacaoDao.atualizarPublicacao(publicacao);
            response.status(200); // OK
            return "Comment added.";
        } else {
            response.status(404); // Not Found
            return "Publicacao not found.";
        }
	}
}
