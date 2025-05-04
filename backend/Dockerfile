
FROM node:22-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3000

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]