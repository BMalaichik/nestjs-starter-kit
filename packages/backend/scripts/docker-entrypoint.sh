#!/bin/sh

if [ "$NODE_ENV" = "production" ]; then
    node index.js |  ./node_modules/.bin/pino-cloudwatch --prefix $NODE_ENV --group $AWS_CLOUDWATCH_GROUP --aws_region $AWS_REGION
else
    npm start
fi
