let userName = null;
let timeSelecionado = null;
let userEmail = null;
let emailChecked = false;

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
  userName = null;
  timeSelecionado = null;
  userEmail = null;
  emailChecked = false;
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

function checkEmail(email) {
  fetch(`http://localhost:3000/user/find-by-email?email=${encodeURIComponent(email)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      if (data.exists) {
        chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> Seja bem-vindo novamente! 😊</p>`;
        emailChecked = true;
        userInput.style.display = "none"; 
      } else {
        chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> Parece que é sua primeira vez! Qual seu nome?</p>`;
        emailChecked = true;
      }
      chatbox.scrollTop = chatbox.scrollHeight;
    })
    .catch(error => {
      console.error('Erro ao verificar e-mail:', error);
      chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> Tivemos um problema. Tente novamente mais tarde.</p>`;
    });
}


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

  createUser();
}

function createUser() {
  fetch('http://localhost:3000/user/create-user', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: userName,
      favgame: timeSelecionado,
      email: userEmail
    }),
  })
    .then(response => response.json())
    .then(data => {
      chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> Cadastro concluído! 🎉 Seja bem-vindo, ${userName}!</p>`;
      chatbox.scrollTop = chatbox.scrollHeight;
    })
    .catch((error) => {
      console.error('Erro ao cadastrar usuário:', error);
      chatbox.innerHTML += `<p class="bot"><strong>FURIABot:</strong> Algo deu errado! 😢</p>`;
    });
}

