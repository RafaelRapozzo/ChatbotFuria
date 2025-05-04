# FURIA Chatbot

Um chatbot interativo para fãs da FURIA acompanharem as informações dos times de CS:GO, Valorant e LoL.

## 🛠️ Pré-requisitos

- Node.js (versão 18 ou superior)
- NPM ou Yarn
- SQLite

## 📁 Estrutura do Projeto

```
chatbot/
├── backend/           # API em NestJS
│   ├── src/
│   ├── prisma/
│   └── package.json
└── web/              # Frontend
    ├── src/
    │   ├── index.html
    │   ├── script.js
    │   └── style.css
    └── imgs/
```

## ⚙️ Configuração do Backend

1. Entre na pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` na raiz do backend com:
```env
DATABASE_URL="file:./deploy.db"
```

4. Execute as migrations do Prisma:
```bash
npx prisma migrate deploy
```

5. Inicie o servidor:
```bash
npm run start:dev
```

O backend estará rodando em `http://localhost:3000`

## 🖥️ Configuração do Frontend

1. Entre na pasta web:
```bash
cd web
```

2. Como o frontend é estático, você pode usar qualquer servidor HTTP. Uma opção simples é usar o Live Server do VS Code:

- Instale a extensão "Live Server" no VS Code
- Clique com botão direito no arquivo `index.html`
- Selecione "Open with Live Server"

O site abrirá automaticamente em seu navegador padrão.

## 🚀 Funcionalidades

- Sistema de cadastro/login via email
- Seleção de time favorito
- Informações atualizadas sobre:
  - Lineup atual
  - Próximos jogos
  - Ranking/posição
  - Campeonatos

## 📝 Endpoints da API

- `POST /user/create-user` - Criar novo usuário
- `POST /user/find-by-email` - Buscar usuário por email
- `PATCH /user/update-team` - Atualizar time favorito

Documentação completa disponível em: `http://localhost:3000/api`

## 🔧 Troubleshooting

Se encontrar o erro "Database file not found":
```bash
cd backend
npx prisma generate
npx prisma migrate deploy
```

Se o frontend não conseguir conectar com o backend, verifique:
1. Se o backend está rodando
2. Se as URLs no `script.js` apontam para a porta correta
3. Se o CORS está configurado corretamente

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
