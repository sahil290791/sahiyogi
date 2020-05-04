# builder
FROM node:12.16.3-alpine

RUN apk add --no-cache --update bash

RUN npm install -g serve

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --cache-folder .yarn-cache

COPY . ./

EXPOSE 5000

ENV HOST 0.0.0.0
ENV NODE_ENV production

RUN yarn build

CMD yarn start
