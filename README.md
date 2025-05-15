<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Project setup

To set up the project, follow these steps:

1. Installing [Docker](https://docs.docker.com/engine/install/)
2. Run the project with `docker compose`

```bash
docker compose up --build
```

## API Usage

Once the application is running, you can use the following APIs:

### Base URL

The base URL for all API endpoints is:

```
http://localhost:8080
```

### Endpoints

#### 1. **Register a new user**

- **URL:** `/auth/register`
- **Method:** `POST`
- **Description:** Register a new user
- **Body:**
  ```json
  {
    "email": "admin@gmail.com",
    "password": "123456"
  }
  ```

#### 2. **Login**

- **URL:** `/auth/login`
- **Method:** `POST`
- **Description:** Authenticate the user and response with `Authentication` cookie
- **Body:**
  ```json
  {
    "email": "admin@gmail.com",
    "password": "123456"
  }
  ```
- **Response**: `Authentication` cookie

#### 3. **Get All Concerts**

- **URL:** `/concerts/`
- **Method:** `GET`
- **Description:** Fetches a list of all available concerts.
- **Response:**
  ```json
  [
    {
      "id": 1,
      "name": "Concert Name",
      "date": "2023-12-01",
      "location": "Venue Name"
    }
  ]
  ```

#### 4. **Create a New Concert**

- **URL:** `/concerts/`
- **Method:** `POST`
- **Description:** Adds a new concert to the database.
- **Request Body:**
  ```json
  {
    "name": "Concert Name",
    "startAt": "2023-12-01",
    "address": "Venue Name",
    "description": "Concert details here."
  }
  ```
- **Response:**
  ```json
  {
    "_id": "682528b8ec8b128a889f4444",
    "name": "Concert Name",
    "date": "2023-12-01",
    "location": "Venue Name",
    "description": "Concert details here."
  }
  ```

#### 5. **Create a seat type**

- **URL:** `/concerts/seat-types`
- **Method:** `POST`
- **Description:** Create a seat type for a specific concert
- **Request Body:**
  ```json
  {
    "concertId": "682528b8ec8b128a889f4444",
    "totalTickets": 200,
    "type": "PREMIUM" | "STANDARD" | "VIP",
    "price": 2000
  }
  ```
- **Response:**
  ```json
  {
    "_id": "682528b8ec8b128a889f4444",
    "concertId": "682528b8ec8b128a889f4444",
    "totalTickets": 200,
    "availableTickets": 200,
    "type": "PREMIUM",
    "price": 2000
  }
  ```

#### 6. **Booking a ticket**

- **URL:** `/bookings/`
- **Method:** `POST`
- **Description:** Booking a ticket for a specific concert and seat type
- **Request Body:**
  ```json
  {
    "concertId": "682528b8ec8b128a889f4444",
    "seatTypeId": "682528e2ec8b128a889f4446"
  }
  ```
- **Response:**
  ```json
  {
    "_id": "682528b8ec8b128a889f4444",
    "concertId": "682528b8ec8b128a889f4444",
    "seatTypeId": "682528e2ec8b128a889f4446"
  }
  ```

#### 7. **Cancel a ticket**

- **URL:** `/bookings/:ticketId/cancel`
- **Method:** `PUT`
- **Description:** Cancel a ticket and free up the available ticket
- **Response:**
  ```json
  {
    "_id": "682528b8ec8b128a889f4444",
    "concertId": "682528b8ec8b128a889f4444",
    "seatTypeId": "682528e2ec8b128a889f4446",
    "cancelAt": "2025-05-14T23:36:02.350Z"
  }
  ```

#### 8. **Find all tickets**

- **URL:** `/bookings/`
- **Method:** `GET`
- **Description:** Find the list of tickets
- **Response:**
  ```json
  [
    {
      "_id": "682528b8ec8b128a889f4444",
      "concertId": "682528b8ec8b128a889f4444",
      "seatTypeId": "682528e2ec8b128a889f4446",
      "cancelAt": "2025-05-14T23:36:02.350Z"
    },
    {
      "_id": "682528b8ec8b128a889f4444",
      "concertId": "682528b8ec8b128a889f4444",
      "seatTypeId": "682528e2ec8b128a889f4446"
    }
  ]
  ```
