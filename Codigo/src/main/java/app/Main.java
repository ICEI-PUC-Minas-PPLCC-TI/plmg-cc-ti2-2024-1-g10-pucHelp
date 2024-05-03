package app;

import static spark.Spark.*;

import service.UsuarioService;

public class Main {
	
	private static UsuarioService usuarioService = new UsuarioService();
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
            return usuarioService.add(request, response);
        });


        get("/usuario/:id", (request, response) -> usuarioService.get(request, response));

        get("/usuario/update/:id", (request, response) -> usuarioService.update(request, response));

        get("/usuario/delete/:id", (request, response) -> usuarioService.remove(request, response));

        get("/usuario", (request, response) -> usuarioService.getAll(request, response));
        
        after((request, response) -> response.type("application/json"));
    }
}