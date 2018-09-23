#!/bin/sh

if [ "$NODE_ENV" = "production" ]; then
    npm run start:prod
else
    node ./cli/wait-for-db && npm start;
fi
