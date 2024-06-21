function previewImage(event) {
    const preview = document.getElementById('result');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
        const img = document.createElement('img');
        img.src = reader.result;
        preview.innerHTML = '';
        preview.appendChild(img);
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = 'Selecione uma imagem válida.';
    }
}

async function uploadImage() {
    const matricula = sessionStorage.getItem("matricula");
    const image = document.getElementById('image').files[0];

    if (!matricula || !image) {
      alert("Por favor, forneça uma matrícula e selecione uma imagem.");
      return;
    }

    const formData = new FormData();
    formData.append('matricula', matricula);
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:3000/ocr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      if (response.data.matriculaFound) {
          window.location.href = "feed.html";
      } else {
          window.location.href = "login.html";
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById('result').textContent = "Erro ao processar a imagem.";
      alert("wsdcfsd");
    }
  }