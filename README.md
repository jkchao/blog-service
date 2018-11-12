# blog service

[![Build Status](https://travis-ci.org/jkchao/blog-service.svg?branch=nest)](https://travis-ci.org/jkchao/blog-service)
[![coverage](https://codecov.io/gh/jkchao/blog-service/branch/nest/graph/badge.svg)](https://codecov.io/gh/jkchao/blog-service)

此分支是使用 nest 重构分支。

Nest + MongoDB + Redis + Docker + GraphQL

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
