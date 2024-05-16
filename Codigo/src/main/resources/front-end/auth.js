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

document.getElementById('camera-input').addEventListener('change', previewImage);
