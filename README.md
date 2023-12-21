## Description

The API support CRUD (Create, Read, Update, and Delete) operations for a single resource - User.

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
```

## Running on docker

### create file docker-compose.yml

```bash
version: "3.8"
services:
  database:
    container_name: db
    image: postgres:14.2
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: 123456
      POSTGRES_DB: backend-data-handling
  backend:
    container_name: api
    build:
      dockerfile: Dockerfile
      context: .
    restart: on-failure
    depends_on:
      - database
    ports:
      - "3000:3000"
    environment:
      - DATABASE_TYPE=postgres
      - DATABASE_HOST=database
      - DATABASE_PORT=5432
      - DATABASE_USER=postgres
      - DATABASE_PASSWORD=123456
      - DATABASE_NAME=backend-data-handling
```

### create file Dockerfile

```bash
FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

### create file .dockerignore

```bash
node_modules
dist
.git
```

### build image from Dockerfile and run service

```bash
# build image
$ docker compose build

# up image
$ docker compose up  
```


## project folder structure

```bash
project-root/
|-- src/
|   |-- app/
|   |   |-- app.controller.ts
|   |   |-- app.module.ts
|   |   |-- app.service.ts
|   |-- auth/
|   |   |-- auth.module.ts
|   |   |-- auth.service.ts
|   |   |-- jwt-auth.guard.ts
|   |   |-- jwt.strategy.ts
|   |   |-- local-auth.guard.ts
|   |   |-- local.strategy.ts
|   |-- users/
|   |   |-- user.entity.ts
|   |   |-- users.controller.ts
|   |   |-- users.module.ts
|   |   |-- users.service.ts
|   |-- main.ts
|-- .dockerignore
|-- .env
|-- .gitignore
|-- docker-compose.yml
|-- Dockerfile
|-- package.json
|-- tsconfig.json
```


## api test

### create
```bash
curl -X POST http://localhost:3000/users -d '{"name": "abc", "email": "abc@mail.com", "password": "Aa12345678$"}' -H "Content-Type: application/json"
```

response: {"name":"abc","email":"abc@mail.com","password":"Aa12345678$","id":"296ce971-6f7d-46eb-9977-1dc0c75f13dd"}

### auth login
```bash
curl -X POST http://localhost:3000/auth/login -d '{"username": "abc", "password": "Aa12345678$"}' -H "Content-Type: application/json"
```

response: {"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDMxNDk0NjMsImV4cCI6MTcwMzE1NTQ2M30.Xo1nwum5A0UHrV5skvb48hykRzIvCFWi2Ex7jKV5KjY"}

### retrieve
#### all user
```bash
curl -X GET http://localhost:3000/users -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDMxNDk0NjMsImV4cCI6MTcwMzE1NTQ2M30.Xo1nwum5A0UHrV5skvb48hykRzIvCFWi2Ex7jKV5KjY"
```

response: [{"id":"296ce971-6f7d-46eb-9977-1dc0c75f13dd","name":"abc","email":"abc@mail.com","password":"Aa12345678$"}]

#### one user
```bash
curl -X GET localhost:3000/users/296ce971-6f7d-46eb-9977-1dc0c75f13dd -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDMxNDk0NjMsImV4cCI6MTcwMzE1NTQ2M30.Xo1nwum5A0UHrV5skvb48hykRzIvCFWi2Ex7jKV5KjY"
```

response: {"id":"296ce971-6f7d-46eb-9977-1dc0c75f13dd","name":"abc","email":"abc@mail.com","password":"Aa12345678$"}

### update
```bash
curl -X PUT http://localhost:3000/users/296ce971-6f7d-46eb-9977-1dc0c75f13dd -d '{"name": "abcd", "email": "abc@mail.com", "password": "Aa12345678$"}' -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDMxNDk0NjMsImV4cCI6MTcwMzE1NTQ2M30.Xo1nwum5A0UHrV5skvb48hykRzIvCFWi2Ex7jKV5KjY" -H "Content-Type: application/json"
```

response: {"id":"296ce971-6f7d-46eb-9977-1dc0c75f13dd","name":"abcd","email":"abc@mail.com","password":"Aa12345678$"}

### delete
```bash
curl -X DEL http://localhost:3000/users/296ce971-6f7d-46eb-9977-1dc0c75f13dd -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDMxNDk0NjMsImV4cCI6MTcwMzE1NTQ2M30.Xo1nwum5A0UHrV5skvb48hykRzIvCFWi2Ex7jKV5KjY" -H "Content-Type: application/json"
```

response: 

## License

Nest is [MIT licensed](LICENSE).
