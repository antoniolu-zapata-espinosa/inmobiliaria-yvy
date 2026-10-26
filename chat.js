// 1. Conectamos los elementos del HTML de forma segura
const inputField = document.getElementById('chat-input');
const sendBtn = document.getElementById('chat-send');

// Verificamos que el botón existe antes de añadirle la escucha
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

// 2. Función principal que envía el mensaje al servidor local (puerto 3000)
async function sendMessage() {
    if (!inputField) return;
    
    const text = inputField.value.trim();
    if (!text) return; // Si está vacío, no hace nada

    console.log("Enviando mensaje:", text);
    inputField.value = ''; // Limpiamos la caja de texto

    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        console.log("Respuesta de la IA:", data);

        // AQUÍ ES DONDE MUESTRAS LA RESPUESTA EN TU PANTALLA
        // (Dependiendo de cómo tengas estructurado tu chat para pintar los mensajes)

    } catch (error) {
        console.error("Error al conectar con el servidor backend:", error);
    }
}
