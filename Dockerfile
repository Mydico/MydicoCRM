FROM node:12-alpine

# Create app directory

WORKDIR /usr/node-app

ENV NODE_SERVER_PORT=8082

COPY . .

# install server deps

WORKDIR server

RUN npm install

# install client deps

WORKDIR ..

RUN npm install

EXPOSE 8082

ENTRYPOINT ["npm", "run", "start:app" ]
