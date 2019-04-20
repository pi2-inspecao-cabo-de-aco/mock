from node:alpine

RUN apk update

WORKDIR /server

COPY package.json yarn.lock /server/

RUN yarn --prod=false

CMD ["yarn", "start"]
