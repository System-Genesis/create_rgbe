FROM node:13.12-alpine

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

WORKDIR /dist

EXPOSE 7700

CMD node app.js
