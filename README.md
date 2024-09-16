# robot-controll
API for a simple robot that can walk around in a room 


## APIs

| Staging                                           | Production                                        |
| ------------------------------------------------- | ------------------------------------------------- |
|                                                   | 

## Configuration

Install node via nvm:

- [Linux/Mac](https://github.com/nvm-sh/nvm)
- [Windows](https://github.com/coreybutler/nvm-windows)

Node version can be found [here](.nvmrc).






Once the application is running you can visit http://localhost:8080/swagger to see the Swagger page.



## Maintainers

This service is maintained by the members of the following teams:

- [olena topchii](https://github.com/topelena)


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
Additional information
- All the logic located in robot.service
- You can use Swagger to test API http://localhost:8080/swagger
- You can use Swagger to check documentation for the API (request, response)
- Added health check in app.controller
- Added coverage for unit tests
- Added e2e tests
- Added logging and http error interceptors
- Added validation pipe and navigate-validation.service
- Added
    "husky": {
    "hooks": {
      "pre-commit": "npm run pre-commit",
      "pre-push": "npm run test:cov",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },

If I have more time 
- I will add config service 
- I will think about to give robot a poaaibility to go back