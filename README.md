# Onboarding Project

Full-stack User CRUD application with an Angular frontend and a Spring Boot backend. The app lets users list, create, read, update, and delete user records.

## Tech Stack

### Backend

| Technology | Use case |
| --- | --- |
| Java 8 | Backend programming language |
| Spring Boot 2.7.18 | Main backend framework and application runtime |
| Spring Web | Builds REST APIs for user CRUD operations |
| Spring Data JPA | Handles database access through repository interfaces |
| PostgreSQL | Stores user data permanently |
| Redis | Caches individual user lookups |
| Spring Cache | Adds cache behavior using annotations like `@Cacheable`, `@CachePut`, and `@CacheEvict` |
| ModelMapper | Converts between DTO objects and JPA entities |
| Lombok | Reduces boilerplate code for getters, setters, constructors, and DTO methods |
| Maven Wrapper | Runs Maven commands without requiring Maven to be installed globally |

### Frontend

| Technology | Use case |
| --- | --- |
| Angular 21 | Frontend framework |
| TypeScript | Frontend programming language |
| Angular Router | Handles navigation between user pages |
| Angular HttpClient | Calls backend REST APIs |
| RxJS | Handles asynchronous API responses |
| CSS | Styles the frontend screens |
| npm | Installs frontend dependencies and runs Angular scripts |

## Project Structure

```text
.
├── client/                 # Angular frontend
│   └── src/app/
│       ├── core/           # Shared models and API service
│       └── features/users/ # User CRUD pages
└── server/                 # Spring Boot backend
    └── src/main/
        ├── java/com/example/server/
        │   ├── config/     # CORS and ModelMapper configuration
        │   ├── controller/ # REST API endpoints
        │   ├── dto/        # Request/response DTO classes
        │   ├── entity/     # JPA entity classes
        │   ├── repository/ # Spring Data JPA repositories
        │   └── service/    # Business logic
        └── resources/      # Application configuration
```

## Application Flow

1. The user opens the Angular app at `http://localhost:4200`.
2. Angular routes display pages for listing, creating, reading, updating, and deleting users.
3. The Angular `UserService` sends HTTP requests to the backend API at `http://localhost:8081/users/api`.
4. The Spring `UserController` receives the request and forwards it to `UserServiceImpl`.
5. `UserServiceImpl` contains the business logic.
6. `ModelMapper` converts between frontend-facing DTOs and database-facing entities.
7. `UserRepository` uses Spring Data JPA to read and write user data in PostgreSQL.
8. Redis caches individual user lookups:
   - `getUserById` reads from cache when possible.
   - `createNewUser` adds/updates the cache.
   - `updateUser` updates the cache.
   - `deleteUser` removes the cached user.
9. The backend returns the response to Angular, and Angular updates the UI.

## Backend API

Base URL:

```text
http://localhost:8081/users/api
```

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/users/api` | Get all users |
| `GET` | `/users/api/{id}` | Get one user by ID |
| `POST` | `/users/api` | Create a new user |
| `PUT` | `/users/api/{id}` | Update an existing user |
| `DELETE` | `/users/api/{id}` | Delete a user |

Example create/update request body:

```json
{
  "name": "Ari",
  "email": "ari@example.com",
  "age": 24
}
```

## Prerequisites

Install or have access to:

- Java 8
- Node.js and npm compatible with Angular 21
- PostgreSQL
- Redis

The backend is configured to run on port `8081`.

The frontend is configured to run on port `4200`.

## Database Setup

Create a PostgreSQL database named `crud`:

```sql
CREATE DATABASE crud;
```

Update the database credentials in:

```text
server/src/main/resources/application.properties
```

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/crud?useSSL=false
spring.datasource.username=your_postgres_username
spring.datasource.password=your_postgres_password
```

The backend uses:

```properties
spring.jpa.hibernate.ddl-auto=update
```

So Hibernate will create/update the required table structure when the backend starts.

## Redis Setup

Start Redis locally on the default port:

```text
localhost:6379
```

The backend currently uses:

```properties
spring.data.redis.host=localhost
spring.data.redis.port=6379
spring.cache.type=redis
spring.cache.redis.time-to-live=10m
```

## How To Run

### 1. Start PostgreSQL

Make sure PostgreSQL is running and the `crud` database exists.

### 2. Start Redis

Make sure Redis is running on port `6379`.

### 3. Start the backend

From the project root:

```bash
cd server
./mvnw spring-boot:run
```

The backend should start at:

```text
http://localhost:8081
```

### 4. Start the frontend

Open another terminal from the project root:

```bash
cd client
npm install
npm start
```

The frontend should start at:

```text
http://localhost:4200
```

## Frontend Routes

| Route | Page |
| --- | --- |
| `/users` | List all users |
| `/users/get` | Get user by ID |
| `/users/create` | Create user |
| `/users/update` | Update user |
| `/users/delete` | Delete user |

The Angular app uses hash-based routing, so browser URLs may look like:

```text
http://localhost:4200/#/users
```

## Useful Commands

Backend:

```bash
cd server
./mvnw clean install
./mvnw spring-boot:run
```

Frontend:

```bash
cd client
npm install
npm start
npm run build
```

## Notes

- CORS is configured to allow requests from `http://localhost:4200` and `http://127.0.0.1:4200`.
- The backend API URL used by Angular is defined in `client/src/app/core/services/user.service.ts`.
- The backend port, database connection, and Redis settings are defined in `server/src/main/resources/application.properties`.
- User data is stored in PostgreSQL, while Redis is used only for caching.
