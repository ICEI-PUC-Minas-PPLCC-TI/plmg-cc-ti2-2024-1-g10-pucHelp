function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageContent = messageInput.value.trim();

    if (messageContent !== '') {
        const chatContainer = document.getElementById('chat-container');
        const message = document.createElement('div');
        message.classList.add('message', 'sender');
        message.innerHTML = `
            <div class="message-content">${messageContent}</div>
            <div class="message-time">${getCurrentTime()}</div>
        `;
        chatContainer.appendChild(message);
        messageInput.value = '';
    }
}

function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}
