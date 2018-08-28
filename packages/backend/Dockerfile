FROM node:8.11.1

ADD package*.json ./app/
WORKDIR /app

RUN npm i && \
    npm i -g typescript

ADD . /app

RUN chmod +x scripts/docker-entrypoint.sh
CMD scripts/docker-entrypoint.sh;
