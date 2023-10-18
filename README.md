# GameSwift Shop Template Project

## Description

This project serves as a template/example on how to use the GameSwift Pay API. It includes functionalities such as displaying a user's balance and spending money. 

The application uses GameSwift ID for authentication. Users should first log in with their GameSwift ID and use the obtained OAuth token to authenticate in this backend.

The application is comprised of several modules:

- `ConfigModule`: Manages the application's configuration settings.
- `DatabaseModule`: Handles database connections, migrations and data models/entities.
- `ItemsModule`: Manages business logic related to items.
- `OauthModule`: Handles OAuth authentication. Contains functions used to communicate with GameSwift ID API.
- `OffersModule`: Manages business logic related to offers.
- `OrdersModule`: Manages business logic related to orders.
- `UsersModule`: Manages business logic related to users.
- `WalletsModule`: Manages user wallets. WalletsApiService contains functions used to communicate with GameSwift Pay API.

## Env variables

- `WALLET_PARTNER_CLIENT_ID` - OAuth client id created in GameSwift ID, and registered in GameSwift Pay - contact GS Team if needed.

- `ENVIRONMENT` - used for configuration import etc, available options:
```typescript
enum Environment {
    Production = 'PROD',
    Development = 'DEV',
    Local = 'LOCAL',
    Test = 'TEST',
    TestLocal = 'TEST_LOCAL',
}
```

## Scripts

- `build`: Build the project - `nest build`
- `format`: Format the source code - `prettier --write \"src/**/*.ts\" \"test/**/*.ts\"`
- `start`: Start the application - `nest start`
- `start:dev`: Start the application in watch mode - `nest start --watch`
- `start:debug`: Start the application in debug mode - `nest start --debug --watch`
- `start:prod`: Start the application in production mode - `node dist/main`
- `lint`: Lint the source code - `eslint \"{src,apps,libs,test}/**/*.ts\" --fix`
- `test`: Run tests - `jest`
- `test:watch`: Run tests in watch mode - `jest --watch`
- `test:cov`: Run tests with coverage - `jest --coverage`
- `test:debug`: Debug tests - `node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand`
- `test:e2e`: Run end-to-end tests - `jest --config ./test/jest-e2e.json`
- `typeorm`: Run TypeORM commands - `typeorm-ts-node-commonjs`
- `database:migrate:ci`: Migrate the database (CI) - `node ./dist/database.migrate.up.js`
- `database:migrate`: Migrate the database - `ts-node src/database.migrate.up.ts`
- `database:migrate:undo`: Undo the last database migration - `ts-node src/database.migrate.down.ts`
- `database:migrate:generate`: Generate a new database migration - `yarn typeorm migration:generate ./src/database/migrations/$(read -p 'Migration name: ' name && echo $name) -d src/database/typeorm.datasource.ts`

## Setup

### Prerequisites

- Node.js
- Yarn
- PostgreSQL
  
### Steps

1. **Ensure Correct Node.js Version:** This project uses Node.js version 18.18.0 as specified in the `.nvmrc` file. If you're using NVM (Node Version Manager), you can switch to the correct Node.js version by running `nvm use`. If you don't have the required Node.js version installed, you can install it using `nvm install 18.18.0`.

2. **Install project dependencies:** Run `yarn install` in the root directory of the project.

3. **Configure PostgreSQL Database:** 

    - Install PostgreSQL if it is not already installed on your machine.
    
    - Create a new database for the project. You can do this by logging into your PostgreSQL command line (`psql -U postgres`) and running the following command: `CREATE DATABASE your_database_name;`
    
    - Set the following environment variables with your PostgreSQL configuration:
    
        - `POSTGRES_HOST`: The host of your PostgreSQL server, usually `localhost` for local development.
        - `POSTGRES_NAME`: The name of the PostgreSQL database you created.
        - `POSTGRES_PORT`: The port your PostgreSQL server is running on, usually `5432`.
        - `POSTGRES_USER`: The username for your PostgreSQL server.
        - `POSTGRES_PASSWORD`: The password for the `POSTGRES_USER`.
        - 
4. **Run Database Migrations:** After setting up the database, run the first migration using `yarn database:migrate`.

5. **Start the Application:** After successfully completing the above steps, you can start the application by running `yarn start:dev` for development mode or `yarn start:prod` for production mode.