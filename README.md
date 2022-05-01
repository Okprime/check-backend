# Check API Server
## Getting the App Locally

1. Clone this repository with this command
```bash
# git clone https://github.com/Okprime/check-backend.git
```

## Installing Without Docker

2. Install dependencies with this command
```bash
npm install
```

3. Ensure you have the local .env file for configuration parameters. A **sample.env** file is shown in the folder directory for guide.

4. Run the app in development environment using this command
```bash
npm run start:dev
```
## Installing With Docker

5. Use docker to setup / startup postgresDB using the command:

```bash
docker build -t ckeck . && docker run -p 4500:3000 -t ckeck
```
NB: The port ```4500``` varies depending on you but the container is listening on port 3000

## Running tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
