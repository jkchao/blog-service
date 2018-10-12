
FROM node:8.9.4-alpine

RUN mkdir -p /usr/src/blog_service

ADD . /usr/src/blog_service

RUN npm install -g yarn

RUN yarn config set registry 'https://registry.npm.taobao.org'

RUN yarn install

WORKDIR /usr/src/blog_service

EXPOSE 8000