package service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Paths;
import javax.servlet.ServletInputStream;
import org.json.JSONArray;
import org.json.JSONObject;
import spark.Request;
import spark.Response;

public class ExtractMatriculaService {
    private static final String ENDPOINT = "https://leitorcarteirinha.cognitiveservices.azure.com/";
    private static final String API_KEY = "38ddcdfe9f124dababd9ee130c16c1f8";
    private static final String NODE_SERVER_URL = "http://localhost:3000/ocr";
    private static final String UPLOAD_DIR = "uploads/";

    public ExtractMatriculaService() {
        // Create the upload directory if it does not exist
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
    }

    public String uploadImage(Request request, Response response) {
        String fileName = "uploaded_image.jpg"; // you can make this dynamic if needed
        try (ServletInputStream inputStream = request.raw().getInputStream();
             FileOutputStream outputStream = new FileOutputStream(UPLOAD_DIR + fileName)) {
             
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            System.out.println("File received and saved at " + UPLOAD_DIR + fileName);
        } catch (IOException e) {
            e.printStackTrace();
            response.status(500);
            return "Error saving the file.";
        }

        // Send the file to the Node.js server and check matricula
        return sendFileToNodeServerAndCheckMatricula(UPLOAD_DIR + fileName, request, response);
    }

    private String sendFileToNodeServerAndCheckMatricula(String filePath, Request request, Response response) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest fileRequest = HttpRequest.newBuilder()
                    .uri(new URI(NODE_SERVER_URL))
                    .header("Content-Type", "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW")
                    .POST(HttpRequest.BodyPublishers.ofFile(Paths.get(filePath)))
                    .build();
            System.out.println("asdasgfas");
            HttpResponse<String> fileResponse = client.send(fileRequest, HttpResponse.BodyHandlers.ofString());
            if (fileResponse.statusCode() == 200) {
                JSONArray ocrData = new JSONArray(fileResponse.body());
                return checkMatricula(ocrData, request.params(":matricula")) ? "Matrícula encontrada." : "Matrícula não encontrada.";
            } else {
                return "Error processing the image. Status code: " + fileResponse.statusCode();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error processing the image.";
        }
    }

    private boolean checkMatricula(JSONArray ocrData, String matricula) {
    	System.out.println(ocrData);
        for (int i = 0; i < ocrData.length(); i++) {
            JSONObject obj = ocrData.getJSONObject(i);
            JSONArray lines = obj.getJSONArray("lines");
            for (int j = 0; j < lines.length(); j++) {
                String line = lines.getString(j);

                // Check if the text contains the matricula
                if (line.contains(matricula)) {
                    return true;
                }
            }
        }
        return false;
    }
}
