# blog service

[![Build Status](https://travis-ci.org/jkchao/blog-service.svg?branch=nest)](https://travis-ci.org/jkchao/blog-service)
[![coverage](https://codecov.io/gh/jkchao/blog-service/branch/nest/graph/badge.svg)](https://codecov.io/gh/jkchao/blog-service)
[![GitHub forks](https://img.shields.io/github/forks/jkchao/blog-service.svg?style=flat-square)](https://github.com/jkchao/blog-service/network) [![GitHub stars](https://img.shields.io/github/stars/jkchao/blog-service.svg?style=flat-square)](https://github.com/jkchao/blog-service/stargazers) [![GitHub issues](https://img.shields.io/github/issues/jkchao/blog-service.svg?style=flat-square)](https://github.com/jkchao/blog-service/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/jkchao/blog-service.svg?style=flat-square)](https://github.com/jkchao/blog-service/commits/master)

此分支是使用 nest 重构分支。

NestJS + MongoDB + Redis + Docker + GraphQL

## start

### install

```bash
# Setup mongodb and redis

# start
docker-compose -f docker-compose.dev.yml up

# stop
docker-compose -f docker-compose.dev.yml down

# remove volume/cache
docker-compose -f docker-compose.dev.yml down -v

# install
$ npm install

$ npm run dev
```

### test

```bast
$ npm run test:unit
$ npm run test:e2e
```

### debug

```bash
$ npm run debug
```

### deploy

...
