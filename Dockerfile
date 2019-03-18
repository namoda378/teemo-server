FROM node:8.15-jessie

WORKDIR /

WORKDIR /usr/src/app

COPY ./src/ /usr/src/app/

RUN rm -rf /usr/src/app/node_modules

COPY package.json /usr/src/app/

COPY ./node_modules_overwrite/ /usr/src/app/node_modules/

RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]

