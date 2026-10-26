document.addEventListener("DOMContentLoaded", () => {
    const sendBtn = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');

    if (!sendBtn) {
        console.error("No se ha encontrado el botón 'chat-send'.");
        return;
    }

    sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        procesarEnvio();
    });

    // Permitir enviar con Enter buscando el input dinámicamente
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.target && e.target.id === 'chat-input') {
            e.preventDefault();
            procesarEnvio();
        }
    });

    async function procesarEnvio() {
        // Buscamos el input EN EL MOMENTO DE ENVIAR para evitar que sea undefined
        const inputField = document.getElementById('chat-input');
        const chatMessages = document.getElementById('chat-messages');

        if (!inputField) {
            console.error("No se encuentra el elemento con id 'chat-input'");
            return;
        }

        const texto = inputField.value.trim();
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
