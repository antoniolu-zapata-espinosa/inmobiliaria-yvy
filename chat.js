document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.getElementById("chat-input");
    const chatSend = document.getElementById("chat-send");
    const chatMessages = document.getElementById("chat-messages");

    if (!chatSend || !chatInput || !chatMessages) return; // Si aún no están creados, se espera

    function enviarMensaje() {
        const mensaje = chatInput.value.trim();
        if (!mensaje) return;

        // Pinta el mensaje del usuario
        chatMessages.innerHTML += `<p style="margin: 5px 0; text-align: right;"><strong>Tú:</strong> ${mensaje}</p>`;
        chatInput.value = "";
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // URL de tu backend en Render (reemplázala por tu URL real de Render si es distinta)
        const BACKEND_URL = "https://inmobiliaria-pnt2.onrender.com/api/chat";

        fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: mensaje })
        })
        .then(res => res.json())
        .then(data => {
            // Pinta la respuesta de la IA
            chatMessages.innerHTML += `<p style="margin: 5px 0; color: #d4af37;"><strong>Asistente:</strong> ${data.reply || data.response || "Respuesta recibida"}</p>`;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        })
        .catch(err => {
            console.error("Error:", err);
            chatMessages.innerHTML += `<p style="margin: 5px 0; color: #ff6b6b;"><strong>Error:</strong> No se pudo conectar con el servidor.</p>`;
        });
    }

    chatSend.addEventListener("click", enviarMensaje);
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            enviarMensaje();
        }
    });
});
