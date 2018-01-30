FROM node:8.0.0-alpine

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

ENTRYPOINT [ "npm" ]

CMD [ "start" ]