# Nest.js Starter Kit Backend Overview

## Overview

Application is build on top of *awesome* Node.js entreprise framework [Nest.js](https://nestjs.com/)
Main idea of this project is to provide set of configurable & reusable *basic-needs* modules, like Authorization\Authentication, Configuration and etc.

### Project structure
```
.
├── /.circleci/                                # CircleCI config folder
|             └──config.yml
├── /packages/                                 # Application infrastructure packages
│   ├── /db/                                   # PostgreSQL DB docker package
│   ├── /nginx/                                # Nginx web server docker package             
│   ├── /backend/
|                ├── /cli                      # Application-based CLI scripts
|                ├── /scripts                  # Deploy & launch scripts
|                ├── /src                      # Application source code
|                    ├── /http                 # Set of cross-modules http utilities(pipes, exception filters and etc.)
|                    ├── /modules              # Application NestJS modules
|                    ├── /tools                # application-level module tools (for CLI purposes)

└── package.json                # The list of 3rd party libraries and utilities
```

### Non-Docker environment requirements

- Node.js **8.11.1**
- PostgreSQL **10.3**

### Docker requirements

- Docker **^16.0**
- Docker-compose **^2.0**


### Launching application
Application can be launched in Docker & Non-Docker environments.
Docker configuration can be found in `docker-compose.yml`, `Dockerfile` files.

- Backend
   - `npm start`
   - `npm run start:docker`
- Nginx
   - `docker-compose up`
- DB. **NOTE** - by default, launched with `backend` application in dev mode
   - `docker-compose up`
