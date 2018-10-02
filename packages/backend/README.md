# Nest.js Starter Kit Backend Overview

## Overview

Application is build on top of *awesome* Node.js entreprise framework [Nest.js](https://nestjs.com/)
Main idea of this project is to provide set of configurable & reusable *basic-needs* modules, like Authorization\Authentication, Configuration and etc.

## Project structure

```xxx
|--- cli                            folder contains list of cli scripts located under `src/tools` to be executed.
|--- scripts                        app-launch\CI\CD related scripts
|--- test                           Jest Test Runner configuration folder
|--- src                            source code
        |
        |--- http                   set of http-related utilities
        |--- modules                application modules
        |--- tools                  helper scripts executed in application (Nest.js) context
```

### Launch

Application can be launched in Docker & Non-Docker environments.
Docker configuration can be found in `docker-compose.yml`, `Dockerfile` files.

### Non-Docker environment requirements

- Node.js **8.11.1**
- PostgreSQL **10.3**

### Docker requirements

- Docker **^16.0**
- Docker-compose **^2.0**
