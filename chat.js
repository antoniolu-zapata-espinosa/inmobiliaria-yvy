// 1. Conectamos los elementos de forma segura buscando los IDs exactos del HTML
const inputField = document.getElementById('chat-input');
const sendBtn = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');

// 2. Eventos para enviar al hacer clic en el botón o pulsar Enter
if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
}

if (inputField) {
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// 3. Función principal de envío con comprobaciones defensivas
async function sendMessage() {
    // Si por cualquier razón el input no existe, salimos para que no pete
    if (!inputField) {
        console.error("No se encuentra el elemento con id 'chat-input'");
        return;
    }

    const text = inputField.value.trim();
    if (!text) return; // Si está vacío, no hace nada

    console.log("Enviando mensaje:", text);

    // Pintamos el mensaje del usuario en pantalla
    if (chatMessages) {
        chatMessages.innerHTML += `<div style="margin: 5px 0; text-align: right;"><span style="background: #007bff; color: white; padding: 6px 10px; border-radius: 8px; display: inline-block;">${text}</span></div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    inputField.value = ''; // Limpiamos la caja de texto

    try {
        // Petición a tu servidor local en Node.js (puerto 3000)
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        console.log("Respuesta del servidor:", data);

        // Pintamos la respuesta de la IA en pantalla
        if (chatMessages) {
            const respuestaTexto = data.reply || data.message || "Respuesta recibida del servidor.";
            chatMessages.innerHTML += `<div style="margin: 5px 0; text-align: left;"><span style="background: #e9ecef; color: #333; padding: 6px 10px; border-radius: 8px; display: inline-block;">${respuestaTexto}</span></div>`;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

    } catch (error) {
        console.error("Error al conectar con el servidor backend:", error);
        if (chatMessages) {
            chatMessages.innerHTML += `<div style="margin: 5px 0; text-align: left;"><span style="background: #f8d7da; color: #721c24; padding: 6px 10px; border-radius: 8px; display: inline-block;">Error: No se pudo conectar con el servidor (puerto 3000).</span></div>`;
        }
    }
}
