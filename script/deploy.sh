#!/bin/bash

# service 还是使用 pm2
pm2 stop all

# docker-compose -f docker-compose.yml build
# docker-compose -f docker-compose.yml up -d

yarn install

echo 'npm run start'

pm2 restart all
