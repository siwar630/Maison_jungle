FROM node:18

WORKDIR /app

COPY package*.json ./

# ✅ copier prisma AVANT install
COPY prisma ./prisma

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]