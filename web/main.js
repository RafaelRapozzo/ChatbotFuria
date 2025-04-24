let timeSelecionado = '';
let nome = '';

function escolherTime(time) {
  timeSelecionado = time;
  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML += `<div class="user-msg">Sou fã de ${time.toUpperCase()}!</div>`;
  chatBox.innerHTML += `<div class="bot-msg">Legal! Agora me diga seu nome:</div>`;
}

function enviarNome() {
  nome = document.getElementById('nome').value;
  if (!nome || !timeSelecionado) {
    alert("Escolha um time e informe seu nome.");
    return;
  }

  fetch('http://localhost:3000/chat/registrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, time: timeSelecionado })
  })
    .then(res => res.json())
    .then(data => {
      const chatBox = document.getElementById('chat-box');
      chatBox.innerHTML += `<div class="user-msg">${nome}</div>`;
      chatBox.innerHTML += `<div class="bot-msg">Você foi registrado como torcedor da FURIA (${timeSelecionado.toUpperCase()}) 🔥</div>`;
    })
    .catch(err => console.error(err));
}
