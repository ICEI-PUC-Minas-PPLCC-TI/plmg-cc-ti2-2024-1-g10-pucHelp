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
}
