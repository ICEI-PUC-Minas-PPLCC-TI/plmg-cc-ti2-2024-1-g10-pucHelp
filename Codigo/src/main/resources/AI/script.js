"use strict";

const async = require("async");
const fs = require("fs");
const https = require("https");
const path = require("path");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { promisify } = require("util");
const sleep = promisify(setTimeout);
const { ComputerVisionClient } = require("@azure/cognitiveservices-computervision");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");

const key = "38ddcdfe9f124dababd9ee130c16c1f8";
const endpoint = "https://leitorcarteirinha.cognitiveservices.azure.com/";

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } }),
  endpoint
);

const app = express();
const port = 3000;

// Configurar o middleware CORS
app.use(cors());

// Configuração do multer para upload de imagens em memória
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Função para realizar as operações de OCR a partir de um buffer de imagem
async function readTextFromBuffer(client, buffer) {
  let result = await client.readInStream(buffer);
  let operation = result.operationLocation.split("/").slice(-1)[0];

  while (result.status !== "succeeded") {
    await sleep(1000);
    result = await client.getReadResult(operation);
  }
  return result.analyzeResult.readResults;
}

// Função para formatar o texto reconhecido em um formato desejado
function formatRecognizedText(readResults) {
  let recognizedText = [];
  for (const page in readResults) {
    let pageText = { page: parseInt(page) + 1, lines: [] };
    const result = readResults[page];
    if (result.lines.length) {
      for (const line of result.lines) {
        pageText.lines.push(line.words.map((w) => w.text).join(" "));
      }
    } else {
      pageText.lines.push("No recognized text.");
    }
    recognizedText.push(pageText);
  }
  return recognizedText;
}

function checkMatricula(recognizedText, matricula) {
  for (const page of recognizedText) {
    for (const line of page.lines) {
      if (line.includes("ALUNO MATRÍCULA: " + matricula)) {
        return true;
      }
    }
  }
  return false;
}

// Rota para receber o upload da imagem e realizar OCR
app.post("/ocr", upload.single("image"), async (req, res) => {
  // Verifique se há uma imagem no corpo da requisição
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded." });
    return;
  }

  try {
	const matricula = req.body.matricula;
	  if (!matricula) {
	    res.status(400).json({ error: "Matrícula não fornecida." });
	    return;
	  }
    // Converta a imagem em um buffer para enviar para o Azure Computer Vision
    const buffer = req.file.buffer;

    // Realize as operações de OCR na imagem
    const printedResult = await readTextFromBuffer(computerVisionClient, buffer);
    const recognizedText = formatRecognizedText(printedResult);
    const matriculaEncontrada = checkMatricula(recognizedText, matricula);
    
    // Preparar o JSON de resposta
    const responseJson = {
      recognizedText: recognizedText,
      matriculaFound: matriculaEncontrada
    };

    // Envie o resultado como JSON
    
    res.json(responseJson);
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Failed to process image." });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
