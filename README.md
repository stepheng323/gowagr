# Project README

Welcome to our project! This project is designed to manage transactions and account balances for users. It includes features for creating accounts, debiting and crediting accounts, fetching transaction history, and initiating transfers between accounts.

## Technologies Used

- NestJS for the backend framework
- Prisma for managing migrations and creating models
- Kysely as a query builder for database operations, offering a more intuitive and type-safe approach to crafting and managing database queries.
- Express is used as an adapter in the NestJS project
- PostgreSQL for database storage
- Redis for caching and session management

- Swagger for API documentation

## Project Structure

The project is structured into the following main directories:

- `src`: This directory contains the source code for the project.
  - `repo`: This directory contains the repository classes for database operations.
    - `account.repo.ts`: Handles account creation, debit, credit, and balance fetching operations.
    - `transaction.repo.ts`: Handles transaction creation and fetching transaction history.
  - `user`: This directory contains the controller and service for handling user operations.
    - `user.controller.ts`: Handles incoming user requests for creation, login, balance checking, and fetching user details by username.
    - `user.service.ts`: Performs the actual user operations, including user creation, authentication, balance fetching, and user data retrieval by username.
  - `transfer`: This directory contains the controller and service for handling transfer operations.
    - `transfer.controller.ts`: Handles incoming transfer requests and initiates the transfer process.
    - `transfer.service.ts`: Performs the actual transfer operations, including account balance updates and transaction creation.
  - `utils`: This directory contains utility functions for pagination and response conversion.

## How to Use

To use this project, follow these steps:

1. Clone the repository to your local machine.
2. Install dependencies using `npm install`.
3. Create a `.env` file in the project root and add the following environment variables:

   - `DATABASE_URL`: The connection URL for your database.
   - `JWT_SECRET`: A secret key for JSON Web Tokens.
   - `JWT_EXPIRATION`: The expiration time for JSON Web Tokens.
   - `PORT`: The port number for the application to listen on.
   - `NODE_ENV`: The environment type (e.g., development, production).

4. Run database migrations using Prisma:

   ```
   npx prisma migrate dev
   ```

   This command will apply all pending migrations to your database.

5. Start the application using `npm run start`.
6. Use a tool like Postman or cURL to send HTTP requests to the API endpoints.

## API Endpoints

The project includes the following API endpoints:

- `POST /users`: Creates a new user account.
- `POST /users/login`: Authenticates a user and returns a token.
- `GET /users/balance`: Fetches the account balance for a user.
- `GET /users/details`: Fetches user details by username.
- `POST /transfers`: Initiates a transfer between two accounts.
- `GET /transfers`: Fetches the transaction history for a user.

## API Documentation

This project uses Swagger for API documentation. After starting the application, you can access the Swagger UI at:

http://localhost:{port}/docs the port here is whatever port the app is lisnening on

This interactive documentation provides detailed information about all available endpoints, request/response schemas, and allows you to test the API directly from the browser.

## License

This project is licensed under the MIT License.
