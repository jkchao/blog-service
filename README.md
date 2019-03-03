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
docker-compose -f docker-compose.dev.yml up -d

# stop
# docker-compose -f docker-compose.dev.yml down

# remove volume/cache
# docker-compose -f docker-compose.dev.yml down -v

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

## 性能调优

```bash
# 安装 clinic
$ npm i -g clinic

# 安装压力测试工具
$ npm i -g autocannon

# 在检查之前，先 build 出来
$ npm run build:stage

# run
$ npm run performance
```

你可以选择 doctor/IO/flame 选项，然后输入需要检查的接口;

稍等片刻，会生成新的报告。

参考：

- [node-clinic](https://github.com/nearform/node-clinic);
- [autocannon](https://github.com/mcollina/autocannon);
- 数据分析文档：[clinic](https://clinicjs.org/documentation);
