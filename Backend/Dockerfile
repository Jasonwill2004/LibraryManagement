FROM uselagoon/node-18

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

RUN npx prisma generate

EXPOSE 3004

CMD ["node", "index.js"]
