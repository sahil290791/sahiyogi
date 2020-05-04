# builder
FROM node:12.16.3-alpine
RUN apk add --no-cache --update bash
RUN npm install -g serve
#ARG NODE_ENV=production
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --cache-folder .yarn-cache
COPY . ./
EXPOSE 4000
ENV HOST covidlockdown.org
CMD yarn build
CMD yarn start
