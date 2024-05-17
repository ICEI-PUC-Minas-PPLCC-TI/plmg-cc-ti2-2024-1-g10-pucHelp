package app;
import static spark.Spark.*;

import service.CursoService;
import service.UsuarioService;
import service.PublicacaoService;

public class Main {
	
	private static UsuarioService usuarioService = new UsuarioService();
    private static PublicacaoService publicacaoService = new PublicacaoService();
	private static CursoService cursoService = new CursoService();
    public static void main(String[] args) {
        port(8080);
        
        // Configurar os cabeçalhos CORS para permitir solicitações de todas as origens
        options("/*", (request, response) -> {
            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));

        post("/usuario", (request, response) -> {
            System.out.println("Requisição POST /produto recebida:");
            System.out.println("Corpo da requisição: " + request.body());
            System.out.println("Parâmetros da requisição: " + request.params());
            
            return usuarioService.add(request, response);
        });

        
        get("/tiposusuario", (request, response) -> {
            System.out.println("Requisição GET /tipo usuario recebida:");
            System.out.println("Corpo da requisição: " + request.body());
            System.out.println("Parâmetros da requisição: " + request.params());
            return usuarioService.getAllTypesUserJSON();
        });
        
        get("/cursos", (request, response) -> {
            System.out.println("Requisição GET /cursos recebida:");
            System.out.println("Corpo da requisição: " + request.body());
            System.out.println("Parâmetros da requisição: " + request.params());
            return cursoService.getAllCoursesJSON();
        });
        
        
        post("/login", (request, response) -> {
            System.out.println("Requisição POST /login recebida:");
            System.out.println("Corpo da requisição: " + request.body());
            System.out.println("Parâmetros da requisição: " + request.params());
            return usuarioService.login(request, response);
        });
        
        post("/publicacao", (request, response) -> {
        	System.out.println(request);
        	return publicacaoService.create(request, response);
        });
        
        get("/publicacoes", (request, response) -> {
            System.out.println("Requisição GET /publicacoes recebida:");
            System.out.println("Corpo da requisição: " + request.body());
            System.out.println("Parâmetros da requisição: " + request.params());
            return publicacaoService.getPublicacoes(request, response);
        });
        // Caminhos para interagir com o servi�o de publica��o
        post("/publicacoes/like", (request, response) -> {
            return publicacaoService.addLike(request, response);
        });

        post("/publicacoes/comment", (request, response) -> {
            return publicacaoService.addComment(request, response);
        });
        get("/usuario/:id", (request, response) -> usuarioService.get(request, response));

        get("/usuario/update/:id", (request, response) -> usuarioService.update(request, response));

        get("/usuario/delete/:id", (request, response) -> usuarioService.remove(request, response));

        get("/usuario", (request, response) -> usuarioService.getAll(request, response));
        
        after((request, response) -> response.type("application/json"));
               
    }
}