document.addEventListener("DOMContentLoaded", () => {
    const chatContainer = document.getElementById('chat-container');
    
    if (!chatContainer) {
        console.error("No se encuentra el contenedor del chat.");
        return;
    }

    // Buscamos los elementos DENTRO del contenedor flotante para evitar conflictos con otros IDs duplicados
    const sendBtn = chatContainer.querySelector('#chat-send');
    const inputField = chatContainer.querySelector('#chat-input');
    const chatMessages = chatContainer.querySelector('#chat-messages');

    if (!sendBtn || !inputField) {
        console.error("Faltan elementos interactivos dentro del chat flotante.");
        return;
    }

    sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        procesarEnvio();
    });

    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            procesarEnvio();
        }
    });

    async function procesarEnvio() {
        const texto = inputField.value ? inputField.value.trim() : '';
        if (!texto) return;

        // Pintar mensaje del usuario
        if (chatMessages) {
            chatMessages.innerHTML += `<div style="margin: 5px 0; text-align: right;"><span style="background: #007bff; color: white; padding: 6px 10px; border-radius: 8px; display: inline-block;">${texto}</span></div>`;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        inputField.value = '';

        try {
            const respuesta = await fetch('https://inmobiliaria-pnt2.onrender.com/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: texto })
            });

            const datos = await respuesta.json();
            const textoRespuesta = datos.reply || datos.message || "Respuesta recibida.";

            // Pintar respuesta de la IA
            if (chatMessages) {
                chatMessages.innerHTML += `<div style="margin: 5px 0; text-align: left;"><span style="background: #e9ecef; color: #333; padding: 6px 10px; border-radius: 8px; display: inline-block;">${textoRespuesta}</span></div>`;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }

        } catch (error) {
            console.error("Error:", error);
            if (chatMessages) {
                chatMessages.innerHTML += `<div style="margin: 5px 0; text-align: left;"><span style="background: #f8d7da; color: #721c24; padding: 6px 10px; border-radius: 8px; display: inline-block;">Error de conexión con el servidor.</span></div>`;
            }
        }
    }
});
