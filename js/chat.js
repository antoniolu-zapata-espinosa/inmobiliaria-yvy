// ==========================================
// LÓGICA DEL CHATBOT DE IA (CONECTADO A RENDER)
// ==========================================

// URL de tu backend en Render (reemplaza con tu URL real si es diferente)
const BACKEND_URL = "https://inmobiliaria-pnt2.onrender.com/api/chat";

document.addEventListener("click", function(e) {
    if (e.target && e.target.id === "chat-send") {
        enviarMensajeChat();
    }
});

document.addEventListener("keypress", function(e) {
    if (e.key === "Enter" && e.target && e.target.id === "chat-input") {
        e.preventDefault();
        enviarMensajeChat();
    }
});

function enviarMensajeChat() {
    const input = document.getElementById("chat-input");
    const messagesDiv = document.getElementById("chat-messages");

    if (!input || !messagesDiv) return;

    const mensaje = input.value.trim();
    if (!mensaje) return;

    // Mostrar el mensaje del usuario en pantalla
    messagesDiv.innerHTML += `<p style="margin: 6px 0; text-align: right; color: #fff;"><strong>Tú:</strong> ${mensaje}</p>`;
    input.value = "";
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // Mensaje temporal de "escribiendo..."
    const idCarga = "msg-carga-" + Date.now();
    messagesDiv.innerHTML += `<p id="${idCarga}" style="margin: 6px 0; color: #d4af37; font-style: italic;">Asistente pensando...</p>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // Enviar petición al backend en Render
    fetch(BACKEND_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: mensaje })
    })
    .then(res => res.json())
    .then(data => {
        const cargaEl = document.getElementById(idCarga);
        if (cargaEl) cargaEl.remove();

        const respuesta = data.reply || data.response || data.message || "¡Recibido!";
        messagesDiv.innerHTML += `<p style="margin: 6px 0; color: #e1e1e1;"><strong>Asistente:</strong> ${respuesta}</p>`;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    })
    .catch(err => {
        console.error("Error al conectar con Render:", err);
        const cargaEl = document.getElementById(idCarga);
        if (cargaEl) cargaEl.remove();

        messagesDiv.innerHTML += `<p style="margin: 6px 0; color: #ff6b6b;"><strong>Error:</strong> No se pudo conectar con el servidor de IA.</p>`;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}
