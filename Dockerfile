FROM node:8.15-jessie

WORKDIR /

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY ./src/ /usr/src/app/

EXPOSE 8080
CMD [ "npm", "start" ]
