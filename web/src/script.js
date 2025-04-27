let userName = null;
let timeSelecionado = null;
let userEmail = null;
let emailSent = false;  // Flag para verificar se o e-mail já foi enviado

const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("user-input");
const teamSelection = document.getElementById("team-selection");

function openChat() {
  document.getElementById("chatbot-container").style.display = "flex";
  document.getElementById("open-chat-btn").style.display = "none";
  userInput.style.display = "block";
  chatbox.innerHTML = `<p class="bot"><strong>FURIABot:</strong> Olá! Qual seu nome?</p>`;
}

function closeChat() {
  document.getElementById("chatbot-container").style.display = "none";
  document.getElementById("open-chat-btn").style.display = "inline-block";
  chatbox.innerHTML = '';
  userInput.value = '';
  userInput.style.display = "none";
  teamSelection.style.display = "none";
  userName = null;
  timeSelecionado = null;
  userEmail = null;
}

userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const text = userInput.value.trim();
    if (!text) return;
    chatbox.innerHTML += `<p class="user"><strong>Você:</strong> ${text}</p>`;
    userInput.value = '';

    if (!userName) {
      userName = text;
      chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> Prazer, ${userName}! Qual time da FURIA você acompanha?</p>`;
      showTeamOptions();
      userInput.style.display = "none";
      return;
    }

    if (!timeSelecionado) {
      responder("time");
      return;
    }

    if (!userEmail) {
      chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> Agora, me diga seu e-mail, por favor.</p>`;
      userInput.placeholder = "Digite seu e-mail...";
      return;
    }

    responder(texto);
  }
});

function showTeamOptions() {
  teamSelection.style.display = "flex";
  teamSelection.innerHTML = `
    <button onclick="selectTeam('csgo')">CS:GO</button>
    <button onclick="selectTeam('valorant')">Valorant</button>
    <button onclick="selectTeam('lol')">LoL</button>
  `;
}

function selectTeam(team) {
  timeSelecionado = team;
  const teamName = { csgo: 'CS:GO', valorant: 'Valorant', lol: 'LoL' }[team];
  chatbox.innerHTML += `<p class="user"><strong>Você:</strong> ${teamName}</p>`;
  chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> Beleza! Agora me envie seu e-mail, por favor.</p>`;
  teamSelection.style.display = "none";
  userInput.style.display = "block";
}

function responder(texto) {
  const mensagens = {
    csgo: {
      proximo: "O próximo jogo de CS:GO é contra a NAVI na sexta às 18h!",
      resultado: "Vitória sobre a BIG por 2x0 no último jogo!",
      jogadores: "Line: KSCERATO, yuurih, chelo, FalleN, arT.",
      estatisticas: "KSCERATO está com 1.20 de rating.",
      loja: "Compre na loja: <a href='https://furia.gg/store' target='_blank'>furia.gg/store</a>",
      mensagem: "Sua mensagem foi registrada! Vai FURIA!"
    },
    valorant: {
      proximo: "Próximo jogo de Valorant é contra LOUD no sábado às 20h!",
      resultado: "Vitória sobre a MIBR por 2x1 na última série!",
      jogadores: "Line: qck, mwzera, Khalil, fznnn, xand.",
      estatisticas: "qck lidera o time com 250 ACS.",
      loja: "Veja os drops de Valorant: <a href='https://furia.gg/store' target='_blank'>furia.gg/store</a>",
      mensagem: "Mensagem enviada! A torcida tá com vocês!"
    },
    lol: {
      proximo: "Próximo jogo de LoL é contra RED Canids no domingo às 16h!",
      resultado: "FURIA venceu INTZ por 1x0 na última rodada!",
      jogadores: "Line: Envy, fNb, RedBert, Goot, Netuno.",
      estatisticas: "fNb lidera em KDA com 6.3 no split atual.",
      loja: "Camisas e acessórios disponíveis em: <a href='https://furia.gg/store' target='_blank'>furia.gg/store</a>",
      mensagem: "Apoio enviado! Vamos pra cima FURIA!"
    }
  };

  const lower = texto.toLowerCase();
  const chaves = ['proximo', 'resultado', 'jogadores', 'estatisticas', 'loja', 'mensagem'];
  const encontrado = chaves.find(chave => lower.includes(chave));

  if (encontrado) {
    const resposta = mensagens[timeSelecionado][encontrado];
    chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> ${resposta}</p>`;
  } else {
    chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> Ainda não tenho essa informação. Você pode perguntar sobre: próximo jogo, resultado, jogadores, estatísticas, loja ou mensagem para o time.</p>`;
  }

  chatbox.scrollTop = chatbox.scrollHeight;

  // Se o email foi fornecido, enviar os dados para o backend
  if (userEmail && !emailSent) {
    sendToBackend();
  }
}

function sendToBackend() {
  fetch('https://seu-backend.com/api/usuario', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nome: userName,
      time: timeSelecionado,
      email: userEmail,
    }),
  })
  .then(response => response.json())
  .then(data => {
    emailSent = true;  // Marca o e-mail como enviado
    chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> Dados enviados com sucesso! Obrigado pelo apoio, ${userName}!</p>`;
    chatbox.scrollTop = chatbox.scrollHeight;
  })
  .catch((error) => {
    chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> Ocorreu um erro ao enviar seus dados. Tente novamente mais tarde.</p>`;
    chatbox.scrollTop = chatbox.scrollHeight;
  });
}
