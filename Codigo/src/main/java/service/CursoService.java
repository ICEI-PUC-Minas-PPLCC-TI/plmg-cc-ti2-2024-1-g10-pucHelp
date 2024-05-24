package service;

import dao.CursoDAO;
import model.Curso;
import org.json.JSONArray;
import org.json.JSONObject;
import spark.Request;
import spark.Response;
import java.util.List;

public class CursoService {
    private CursoDAO cursoDAO;

    public CursoService() {
        this.cursoDAO = new CursoDAO();
        this.cursoDAO.conectar(); // Certifique-se de estabelecer a conexão com o banco de dados aqui
    }

    public String getAllCoursesJSON() {
        List<Curso> cursos = cursoDAO.listarCursos();

        JSONArray jsonArray = new JSONArray();
        for (Curso curso : cursos) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("id", curso.getId());
            jsonObject.put("nome", curso.getNome());
            jsonObject.put("idArea", curso.getIdArea());
            jsonArray.put(jsonObject);
        }

        return jsonArray.toString();
    }

    public Object getCursoById(int idCurso) {
        Curso curso = cursoDAO.getCursoById(idCurso);
        
        if (curso != null) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("id", curso.getId());
            jsonObject.put("nome", curso.getNome());
            jsonObject.put("idArea", curso.getIdArea());

            return jsonObject.toString();
        } else {
            // Se o curso não for encontrado, retorne uma mensagem de erro ou null
            return "Curso não encontrado para o ID: " + idCurso;
        }
    }

    public Object update(Request request, Response response) {
        try {
            int idCurso = Integer.parseInt(request.params(":id"));
            System.out.println(idCurso);
            
            // Verifica se o curso com o ID fornecido existe
            Curso cursoExistente = cursoDAO.getCursoById(idCurso);
            System.out.println(cursoExistente);
            if (cursoExistente == null) {
                response.status(404); // Not Found
                return "Curso não encontrado para o ID: " + idCurso;
            }

            // Extrai os dados do corpo da requisição
            JSONObject requestBody = new JSONObject(request.body());
            String nome = requestBody.getString("nome");
            int idArea = requestBody.getInt("idArea");
            System.out.println(nome);

            // Cria um objeto Curso com os dados atualizados
            Curso cursoAtualizado = new Curso(idCurso, nome, idArea);

            // Atualiza o curso no banco de dados
            boolean sucesso = cursoDAO.atualizarCurso(cursoAtualizado);

            if (sucesso) {
                return "Curso atualizado com sucesso.";
            } else {
                response.status(500); // Internal Server Error
                return "Erro ao atualizar o curso.";
            }
        } catch (NumberFormatException e) {
            response.status(400); // Bad Request
            return "ID do curso inválido.";
        } catch (Exception e) {
            response.status(500); // Internal Server Error
            return "Erro ao processar a requisição.";
        }
    }

    public Object delete(Request request, Response response) {
        try {
            int idCurso = Integer.parseInt(request.params(":id"));
            System.out.println(idCurso);
            // Verifica se o curso com o ID fornecido existe
            Curso cursoExistente = cursoDAO.getCursoById(idCurso);
            if (cursoExistente == null) {
                response.status(404); // Not Found
                return "Curso não encontrado para o ID: " + idCurso;
            }

            // Remove o curso do banco de dados
            boolean sucesso = cursoDAO.removerCurso(idCurso);

            if (sucesso) {
                return "Curso removido com sucesso.";
            } else {
                response.status(500); // Internal Server Error
                return "Erro ao remover o curso.";
            }
        } catch (NumberFormatException e) {
            response.status(400); // Bad Request
            return "ID do curso inválido.";
        } catch (Exception e) {
            response.status(500); // Internal Server Error
            return "Erro ao processar a requisição.";
        }
    }

    public Object create(Request request, Response response) {
        try {
            System.out.println("sdfa");

            // Extrai os dados do corpo da requisição
            JSONObject requestBody = new JSONObject(request.body());
            System.out.println(requestBody);
            String nome = requestBody.getString("nome");
            int idArea = requestBody.getInt("idArea");

            // Cria um novo objeto Curso
            Curso novoCurso = new Curso(0, nome, idArea);

            // Insere o novo curso no banco de dados
            int idNovoCurso = cursoDAO.inserirCurso(novoCurso);

            if (idNovoCurso != -1) {
                response.status(201); // Created
                return "Curso criado com sucesso. ID: " + idNovoCurso;
            } else {
                response.status(500); // Internal Server Error
                return "Erro ao criar o curso.";
            }
        } catch (Exception e) {
            response.status(500); // Internal Server Error
            return "Erro ao processar a requisição.";
        }
    }


}
