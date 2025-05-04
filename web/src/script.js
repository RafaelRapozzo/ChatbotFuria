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
  fetch('https://chatbotfuria-production.up.railway.app/user/find-by-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
    .then(res => res.json())
    .then(data => {
      if (data.exists) {
        emailChecked = true;
        userCreated = true; 
        userName = data.user.name;
        timeSelecionado = data.user.favgame;
        chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> Bem vindo de volta, ${data.user.name}!</p>`;
        showConversationOptions(data.user.favgame);
      } else {
        emailChecked = true;
        userCreated = false;
        chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> E-mail válido! Qual seu nome?</p>`;
      }
    })
    .catch(err => {
      console.error('Erro ao verificar email:', err);
      chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> Desculpe, ocorreu um erro. Tente novamente mais tarde.</p>`;
    });
}

function createUser(name, email, team) {
  fetch('https://chatbotfuria-production.up.railway.app/user/create-user', {
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
  fetch('https://chatbotfuria-production.up.railway.app/user/update-team', {
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
          response = 'Confira nossos resultados recentes em: <a href="https://hltv.org/team/8297/furia#tab-matchesBox" target="_blank" class="bot-link">HLTV</a>';
          break;
        case "Próximo jogo":
          response = 'Acompanhe nossa agenda de jogos em: <a href="https://hltv.org/team/8297/furia#tab-matchesBox" target="_blank" class="bot-link">HLTV</a>';
          break;
        case "Lineup atual":
          response = "Lineup FURIA CS:\n• FalleN (AWPer/IGL)\n• Molodoy (Entry)\n• KSCERATO (Rifler)\n• Yuurih (Rifler)\n• YEKINDAR (Entry/Lurker)";
          break;
        case "Ranking mundial":
          response = 'Confira nossa posição atual no ranking em: <a href="https://hltv.org/ranking/teams" target="_blank" class="bot-link">HLTV</a>';
          break;
      }
      break;
    case "valorant":
      switch (option) {
        case "Último resultado":
          response = 'Confira nossos resultados recentes em: <a href="https://www.vlr.gg/team/matches/2406/furia/" target="_blank" class="bot-link">VLR.gg</a>';
          break;
        case "Próxima partida":
          response = 'Acompanhe nossa agenda de jogos em: <a href="https://www.vlr.gg/team/matches/2406/furia/" target="_blank" class="bot-link">VLR.gg</a>';
          break;
        case "Jogadores do time":
          response = "Lineup FURIA Valorant:\n• Raafa\n• Khalil\n• Havoc\n• Heat\n• Pryze";
          break;
        case "Campeonatos":
          response = 'Participamos do VCT Americas, principal competição da região. Acompanhe em: <a href="https://valorantesports.com/pt-BR/leagues/vct_americas/ignored/vct_masters" target="_blank" class="bot-link">Valorant Esports</a>';
          break;
      }
      break;
    case "lol":
      switch (option) {
        case "Posição no CBLOL":
          response = 'Acompanhe nossa posição atual no CBLOL em: <a href="https://lolesports.com/pt-BR/gpr/2025" target="_blank" class="bot-link">LoL Esports</a>';
          break;
        case "Próxima partida":
          response = 'Confira nossa agenda de jogos em: <a href="https://lolesports.com/pt-BR/leagues/lta_s" target="_blank" class="bot-link">LoL Esports</a>';
          break;
        case "Jogadores do time":
          response = "Lineup FURIA LoL:\n• JoJo\n• Ayu\n• Guigo\n• Tutsz\n• Tatu";
          break;
        case "Histórico recente":
          response = 'Confira nosso histórico completo de partidas em: <a href="https://liquipedia.net/leagueoflegends/FURIA/Played_Matches" target="_blank" class="bot-link">LoL Esports</a>';
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
  } else if (userCreated) {
    updateUserTeam(team);
  } else {
    console.error("Erro: Dados insuficientes para criar ou atualizar o usuário.");
    chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> Não foi possível processar sua solicitação. Tente novamente mais tarde.</p>`;
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
