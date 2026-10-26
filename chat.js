// 1. Inyectar los estilos CSS automáticamente en la página
const chatStyles = document.createElement('style');
chatStyles.innerHTML = `
  #chat-widget { position: fixed; bottom: 20px; right: 20px; font-family: sans-serif; z-index: 9999; }
  #chat-toggle { background: #4f46e5; color: white; border: none; border-radius: 50%; width: 60px; height: 60px; cursor: pointer; font-size: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  #chat-box { display: none; width: 320px; height: 400px; background: white; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); flex-direction: column; overflow: hidden; position: absolute; bottom: 75px; right: 0; }
  #chat-header { background: #4f46e5; color: white; padding: 12px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }
  #chat-messages { flex: 1; padding: 10px; overflow-y: auto; font-size: 14px; display: flex; flex-direction: column; gap: 8px; background: #ffffff; }
  
  /* Estilos de los mensajes (Asegurando colores legibles) */
  .message { padding: 8px 12px; border-radius: 8px; max-width: 80%; line-height: 1.4; word-wrap: break-word; }
  .user-msg { background: #e0e7ff; color: #1e1b4b; align-self: flex-end; }
  .bot-msg { background: #f3f4f6; color: #1f2937; align-self: flex-start; }
  
  #chat-input-area { display: flex; padding: 8px; border-top: 1px solid #e5e7eb; background: #fff; }
  
  /* Asegurar que lo que escribes en el input se vea oscuro */
  #chat-input { flex: 1; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; outline: none; color: #1f2937; background: #ffffff; font-size: 14px; }
  #chat-input::placeholder { color: #9ca3af; }
  
  #chat-send { background: #4f46e5; color: white; border: none; padding: 8px 12px; margin-left: 6px; border-radius: 6px; cursor: pointer; font-weight: bold; }
  #chat-send:hover { background: #4338ca; }
`;
document.head.appendChild(chatStyles);

// 2. Inyectar la estructura HTML del chat automáticamente al cargar la página
const chatContainer = document.createElement('div');
chatContainer.innerHTML = `
  <div id="chat-widget">
      <button id="chat-toggle">💬</button>
      <div id="chat-box">
          <div id="chat-header">
              <span>Asistente Virtual</span>
              <span id="chat-close" style="cursor:pointer;">&times;</span>
          </div>
          <div id="chat-messages">
              <div class="message bot-msg">¡Hola! ¿En qué puedo ayudarte hoy?</div>
          </div>
          <div id="chat-input-area">
              <input type="text" id="chat-input" placeholder="Escribe tu mensaje...">
              <button id="chat-send">Enviar</button>
          </div>
      </div>
  </div>
`;
document.body.appendChild(chatContainer);

// 3. Lógica del chat (Eventos y Petición Fetch)
const toggleBtn = document.getElementById('chat-toggle');
const chatBox = document.getElementById('chat-box');
const closeBtn = document.getElementById('chat-close');
const sendBtn = document.getElementById('chat-send');
const inputField = document.getElementById('chat-input');
const messagesContainer = document.getElementById('chat-messages');

toggleBtn.onclick = () => chatBox.style.display = chatBox.style.display === 'flex' ? 'none' : 'flex';
closeBtn.onclick = () => chatBox.style.display = 'none';

async function sendMessage() {
    const text = inputField.value.trim();
    if (!text) return;

    messagesContainer.innerHTML += `<div class="message user-msg">${text}</div>`;
    inputField.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    const loadingId = 'loading-' + Date.now();
    messagesContainer.innerHTML += `<div id="${loadingId}" class="message bot-msg">Escribiendo...</div>`;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        // ⚠️ RECUERDA: Cambiar esta URL por tu enlace de Render cuando lo subas
        const res = await fetch('https://tu-backend.onrender.com/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        const data = await res.json();

        document.getElementById(loadingId).remove();
        messagesContainer.innerHTML += `<div class="message bot-msg">${data.reply || data.error}</div>`;
    } catch (err) {
        document.getElementById(loadingId).remove();
        messagesContainer.innerHTML += `<div class="message bot-msg">Lo siento, ha ocurrido un error de conexión.</div>`;
    }
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

sendBtn.onclick = sendMessage;
inputField.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
const inputField = document.getElementById('chat-input');
const sendBtn = document.getElementById('chat-send');

// Vincular el clic del botón
sendBtn.addEventListener('click', sendMessage);

// Vincular la tecla Enter para mayor comodidad
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
