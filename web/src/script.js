let userName = null;
let timeSelecionado = null;
let userEmail = null;
let emailChecked = false;
let userCreated = false;

const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("user-input");
const teamSelection = document.getElementById("team-selection");

function openChat() {
  document.getElementById("chatbot-container").style.display = "flex";
  document.getElementById("open-chat-btn").style.display = "none";
  chatbox.innerHTML = `<p class="bot"><strong>FURIABot:</strong> Olá! Qual seu e-mail?</p>`;
  userInput.style.display = "block";
}

function closeChat() {
  document.getElementById("chatbot-container").style.display = "none";
  document.getElementById("open-chat-btn").style.display = "inline-block";
  chatbox.innerHTML = '';
  userInput.value = '';
  userInput.style.display = "none";
  teamSelection.style.display = "none";
  document.getElementById("options-container").style.display = "none";
  userName = null;
  timeSelecionado = null;
  userEmail = null;
  emailChecked = false;
  userCreated = false;
}

function checkEmail(email) {
  fetch('http://localhost:3000/user/find-by-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
    .then(res => res.json())
    .then(data => {
      if (data.exists) {
        emailChecked = true;
        userName = data.user.name;
        timeSelecionado = data.user.favgame;
        chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> Bem vindo de volta, ${data.user.name}!</p>`;
        showConversationOptions(data.user.favgame);
      } else {
        emailChecked = true;
        chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> E-mail válido! Qual seu nome?</p>`;
      }
    })
    .catch(err => {
      console.error('Erro ao verificar email:', err);
      chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> Desculpe, ocorreu um erro. Tente novamente mais tarde.</p>`;
    });
}

function createUser(name, email, team) {
  fetch('http://localhost:3000/user/create-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, favgame: team })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      userCreated = true;
      timeSelecionado = team;
      const teamName = { csgo: 'CS:GO', valorant: 'Valorant', lol: 'LoL' }[team];
      chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> Cadastro realizado com sucesso! Bem-vindo à torcida do ${teamName}!</p>`;
      showConversationOptions(team);
    })
    .catch(err => {
      console.error('Erro ao criar usuário:', err);
      chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> Desculpe, ocorreu um erro ao criar seu usuário. Tente novamente mais tarde.</p>`;
    });
}

function updateUserTeam(team) {
  console.log('Atualizando time do usuário no backend:', team);

  fetch('http://localhost:3000/user/update-team', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: userEmail,
      favgame: team.toLowerCase()
    }),
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      console.log('Resposta do backend ao atualizar time:', data);
      timeSelecionado = data.favgame;
      const teamName = { csgo: 'CS:GO', valorant: 'Valorant', lol: 'LoL' }[timeSelecionado];
      chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> Time atualizado para ${teamName}. O que você gostaria de saber?</p>`;
      showConversationOptions(timeSelecionado);
      chatbox.scrollTop = chatbox.scrollHeight;
    })
    .catch(err => {
      console.error("Erro ao atualizar time do usuário:", err);
      chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> Não foi possível atualizar seu time. 😢</p>`;
      showConversationOptions(timeSelecionado);
    });
}

function showConversationOptions(game) {
  const optionsContainer = document.getElementById("options-container");
  const userInput = document.getElementById("user-input");
  
  optionsContainer.style.display = "flex";
  userInput.style.display = "none";

  let options = [];

  switch (game) {
    case "csgo":
      options = [
        "Último jogo da FURIA", 
        "Próximo jogo", 
        "Lineup atual",
        "Ranking mundial"
      ];
      break;
    case "valorant":
      options = [
        "Último resultado", 
        "Próxima partida", 
        "Jogadores do time",
        "Campeonatos"
      ];
      break;
    case "lol":
      options = [
        "Posição no CBLOL", 
        "Próxima partida", 
        "Jogadores do time",
        "Histórico recente"
      ];
      break;
  }

  options.push("Mudar o time que acompanho");

  optionsContainer.innerHTML = '';
  options.forEach(option => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = () => handleOptionClick(option, game);
    optionsContainer.appendChild(button);
  });
}

function handleOptionClick(option, game) {
  chatbox.innerHTML += `<p class="user"><strong>Você:</strong> ${option}</p>`;

  if (option === "Mudar o time que acompanho") {
    document.getElementById("options-container").style.display = "none";
    showTeamOptions();
    return;
  }

  let response = '';
  
  switch (game) {
    case "csgo":
      switch (option) {
        case "Último jogo da FURIA":
          response = "Confira nossos resultados recentes em:\nhltv.org/team/8297/furia#tab-matchesBox";
          break;
        case "Próximo jogo":
          response = "Acompanhe nossa agenda de jogos em:\nhltv.org/team/8297/furia#tab-matchesBox";
          break;
        case "Lineup atual":
          response = "Lineup FURIA CS:\n• FalleN (AWPer/IGL)\n• molodoy (Entry)\n• KSCERATO (Rifler)\n• yuurih (Rifler)\n• YEKINDAR (Entry/Lurker)";
          break;
        case "Ranking mundial":
          response = "Confira nossa posição atual no ranking em:\nhltv.org/ranking/teams";
          break;
      }
      break;
      
    case "valorant":
      switch (option) {
        case "Último resultado":
          response = "Confira nossos resultados recentes em:\nvlr.gg/team/furia/matches";
          break;
        case "Próxima partida":
          response = "Acompanhe nossa agenda de jogos em:\nvlr.gg/team/furia/matches";
          break;
        case "Jogadores do time":
          response = "Lineup FURIA Valorant:\n• Quick (Iniciador)\n• Nozwerr (Controlador)\n• Khalil (Sentinela)\n• dgzin (Duelista)\n• Mazin (Flex)";
          break;
        case "Campeonatos":
          response = "Participamos do VCT Americas, principal competição da região.\nAcompanhe em: valorantesports.com/vct/americas";
          break;
      }
      break;
      
    case "lol":
      switch (option) {
        case "Posição no CBLOL":
          response = "Acompanhe nossa posição atual no CBLOL em:\nlolesports.com/standings/cblol-brazil";
          break;
        case "Próxima partida":
          response = "Confira nossa agenda de jogos em:\nlolesports.com/schedule?leagues=cblol-brazil";
          break;
        case "Jogadores do time":
          response = "Lineup FURIA LoL:\n• Robo (Top)\n• Goku (Jungle)\n• Envy (Mid)\n• Netuno (ADC)\n• RedBert (Support)";
          break;
        case "Histórico recente":
          response = "Confira nosso histórico completo de partidas em:\nlolesports.com/teams/furia";
          break;
      }
      break;
  }

  chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> ${response}</p>`;
  chatbox.scrollTop = chatbox.scrollHeight;
}

userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const text = userInput.value.trim();
    if (!text) return;
    chatbox.innerHTML += `<p class="user"><strong>Você:</strong> ${text}</p>`;
    userInput.value = '';

    if (!emailChecked) {
      userEmail = text;
      checkEmail(userEmail);
      return;
    }

    if (!userName) {
      userName = text;
      chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> Prazer, ${userName}! Qual time da FURIA você acompanha?</p>`;
      showTeamOptions();
      userInput.style.display = "none";
      return;
    }
  }
});

function showTeamOptions() {
  teamSelection.style.display = "flex";
  teamSelection.innerHTML = `
    <button onclick="handleTeamSelect('csgo')">CS:GO</button>
    <button onclick="handleTeamSelect('valorant')">Valorant</button>
    <button onclick="handleTeamSelect('lol')">LoL</button>
  `;
}

function handleTeamSelect(team) {
  teamSelection.style.display = "none";
  
  if (!userCreated && userName && userEmail) {
    createUser(userName, userEmail, team);
  } else {

    updateUserTeam(team);
  }
}

function setupTabs() {
  const tabLinks = document.querySelectorAll('.nav-links a');
  const tabContents = document.querySelectorAll('.tab-content');

  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      tabLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      tabContents.forEach(content => content.classList.remove('active'));
      const tabId = link.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', setupTabs);
