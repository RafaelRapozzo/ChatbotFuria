const mensagensCSGO = {
    'proximo': 'O próximo jogo de CS:GO é contra a NAVI na sexta às 18h!',
    'resultado': 'Vitória sobre a BIG por 2x0 no último jogo!',
    'jogadores': 'Line: KSCERATO, yuurih, chelo, FalleN, arT.',
    'estatisticas': 'KSCERATO está com 1.20 de rating.',
    'loja': 'Compre na loja: <a href="https://furia.gg/store" target="_blank">furia.gg/store</a>',
    'mensagem': 'Sua mensagem foi registrada! Vai FURIA!'
  };
  
  const mensagensValorant = {
    'proximo': 'Próximo jogo de Valorant é contra LOUD no sábado às 20h!',
    'resultado': 'Vitória sobre a MIBR por 2x1 na última série!',
    'jogadores': 'Line: qck, mwzera, Khalil, fznnn, xand.',
    'estatisticas': 'qck lidera o time com 250 ACS.',
    'loja': 'Veja os drops de Valorant: <a href="https://furia.gg/store" target="_blank">furia.gg/store</a>',
    'mensagem': 'Mensagem enviada! A torcida tá com vocês!'
  };
  
  const mensagensLoL = {
    'proximo': 'Próximo jogo de LoL é contra RED Canids no domingo às 16h!',
    'resultado': 'FURIA venceu INTZ por 1x0 na última rodada!',
    'jogadores': 'Line: Envy, fNb, RedBert, Goot, Netuno.',
    'estatisticas': 'fNb lidera em KDA com 6.3 no split atual.',
    'loja': 'Camisas e acessórios disponíveis em: <a href="https://furia.gg/store" target="_blank">furia.gg/store</a>',
    'mensagem': 'Apoio enviado! Vamos pra cima FURIA!'
  };
  
  let timeSelecionado = null;
  
  function selectTeam(time) {
    timeSelecionado = time;
    const chatbox = document.getElementById('chatbox');
    const teamName = { csgo: 'CS:GO', valorant: 'Valorant', lol: 'League of Legends' }[time];
    chatbox.innerHTML += `<p class='user'><strong>Você:</strong> ${teamName}</p>`;
    chatbox.innerHTML += `<p class='bot'><strong>FURIABot:</strong> Show! Agora escolha o que deseja saber.</p>`;
    document.getElementById('team-options').style.display = 'none';
    document.getElementById('user-options').style.display = 'flex';
  }
  
  function handleOption(opcao) {
    if (opcao === 'trocar') {
      document.getElementById('user-options').style.display = 'none';
      document.getElementById('team-options').style.display = 'flex';
      document.getElementById('chatbox').innerHTML += `<p class='bot'><strong>FURIABot:</strong> Beleza! Qual time você quer acompanhar agora?</p>`;
      return;
    }
  
    const chatbox = document.getElementById('chatbox');
    const mensagens = {
      csgo: mensagensCSGO,
      valorant: mensagensValorant,
      lol: mensagensLoL
    }[timeSelecionado];
  
    const texto = mensagens[opcao] || 'Ainda não tenho essa informação.';
  
    chatbox.innerHTML += `<p class='user'><strong>Você:</strong> ${document.querySelector(`[onclick*='${opcao}']`).innerText}</p>`;
    setTimeout(() => {
      chatbox.innerHTML += `<p class='bot'><strong>FURIABot:</strong> ${texto}</p>`;
      chatbox.scrollTop = chatbox.scrollHeight;
    }, 300);
  }
  
  document.getElementById('user-options').innerHTML = `
    <button onclick="handleOption('proximo')">Próximo Jogo</button>
    <button onclick="handleOption('resultado')">Último Resultado</button>
    <button onclick="handleOption('jogadores')">Line-up</button>
    <button onclick="handleOption('estatisticas')">Estatísticas</button>
    <button onclick="handleOption('loja')">Loja Oficial</button>
    <button onclick="handleOption('mensagem')">Mensagem para o Time</button>
    <button onclick="handleOption('trocar')">Trocar Time</button>
  `;
  