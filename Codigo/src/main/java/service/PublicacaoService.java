package service;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

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
        String body = request.body();
        JSONObject json = new JSONObject(body);

        String tipo = json.getString("tipo");
        String conteudo = json.getString("conteudo");
        int idAluno = json.getInt("idAluno");
        System.out.println(idAluno);

        Publicacao publicacao = new Publicacao(0, tipo, conteudo, idAluno, 0, ""); // id 0 para autoincremento no banco

        if (publicacaoDao.inserirPublicacao(publicacao)) {
            response.status(201); // Created
            return "Publicação criada com sucesso!";
        } else {
            response.status(500); // Internal Server Error
            return "Erro ao criar a publicação. Por favor, tente novamente mais tarde.";
        }
    }
 
    public Object addLike(Request request, Response response) {
        try {
            // Obter os dados do corpo da requisição
            String body = request.body();
            JSONObject json = new JSONObject(body);
            int id = json.getInt("id");
            System.out.println(id);
            // Obter a publicação correspondente ao ID
            Publicacao publicacao = publicacaoDao.getPublicacaoById(id);
            System.out.println(publicacao);

            if (publicacao != null) {
                // Incrementar o número de likes
                publicacao.setLike(publicacao.getLike() + 1);
                publicacaoDao.atualizarPublicacao(publicacao);
                response.status(200); // OK
                return "Like adicionado.";
            } else {
                response.status(401); // Not Found
                return "Publicação não encontrada.";
            }
        } catch (Exception e) {
            response.status(400); // Bad Request
            return "Erro ao processar a requisição.";
        }
    }

    public Object addComment(Request request, Response response) {
        try {
            // Obter os dados do corpo da requisição
            String body = request.body();
            JSONObject json = new JSONObject(body);
            int id = json.getInt("id");
            String comment = json.getString("comment");

            // Obter a publicação correspondente ao ID
            Publicacao publicacao = publicacaoDao.getPublicacaoById(id);

            if (publicacao != null) {
                // Adicionar o comentário
                String updatedComments = publicacao.getComents() + "\n" + comment;
                publicacao.setComents(updatedComments);
                publicacaoDao.atualizarPublicacao(publicacao);
                response.status(200); // OK
                return "Comentário adicionado.";
            } else {
                response.status(404); // Not Found
                return "Publicação não encontrada.";
            }
        } catch (Exception e) {
            response.status(400); // Bad Request
            return "Erro ao processar a requisição.";
        }
    }

    // Método para obter todas as publicações do banco e retorná-las como JSON
    public Object getPublicacoes(Request request, Response response) {
        try {
            JSONArray publicacoesArray = new JSONArray();

            // Obter todas as publicações do banco de dados
            List<Publicacao> publicacoes = publicacaoDao.getTodasPublicacoes();

            // Converter cada publicação em um objeto JSON e adicioná-lo ao JSONArray
            for (Publicacao publicacao : publicacoes) {
                JSONObject publicacaoJSON = new JSONObject();
                publicacaoJSON.put("id", publicacao.getId());
                publicacaoJSON.put("tipo", publicacao.getTipo());
                publicacaoJSON.put("conteudo", publicacao.getConteudo());
                publicacaoJSON.put("idAluno", publicacao.getIdAluno());
                publicacaoJSON.put("like", publicacao.getLike());
                publicacaoJSON.put("coments", publicacao.getComents());
                
                publicacoesArray.put(publicacaoJSON);
            }

            // Definir o tipo de conteúdo da resposta como application/json
            response.type("application/json");

            // Retornar o JSONArray como uma string JSON
            return publicacoesArray.toString();

        } catch (Exception e) {
            // Em caso de erro, configurar o status da resposta para 500 (Internal Server Error)
            response.status(500);
            return "Erro ao obter as publicações.";
        }
    }

}
