FROM node:8-slim

WORKDIR /app
EXPOSE 7312

COPY ./ /app

CMD node ./server.js
