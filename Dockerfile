FROM node:20-alpine

WORKDIR /var/www/abc-test-social-app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install prisma --save-dev

RUN npx prisma generate

EXPOSE 8080

CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]