## Getting Started

These instructions will help you set up a copy of the project on your local machine for development and testing purposes.

## Prerequisites

The following software are required for the project:

- Docker
- Node.js
- AWS CLI

Please ensure these are installed on your system.

## Setup and Installation

Follow these steps to get your development environment set up:

1. Clone the repository:

`git clone git@gitlab.com:billy2552811/auth-service.git`

2. Configuration

The application uses the following environment variables:

- **MYSQL_DATABASE**: The name of your MySQL database
- **MYSQL_ROOT_PASSWORD**: The password for the MySQL root user
- **MYSQL_HOST**: The host of your MySQL server
- **MYSQL_PORT**: The port your MySQL server is running on
- **MYSQL_USER_NAME**: The username of your MySQL user
- **APP_PORT**: The port your application will run on
- **REQUEST_PER_MINUTES**: The limit of requests a user can make per minute
- **COGNITO_USER_POOL_ID**: Your AWS Cognito User Pool ID
- **COGNITO_CLIENT_ID**: Your AWS Cognito Client ID
- **COGNITO_CLIENT_SECRET**: Your AWS Cognito Client Secret
- **AWS_REGION**: Your AWS region for Cognito
- **COGNITO_AUTHORITY**: `https://cognito-idp.{YOUR_AWS_REGION}.amazonaws.com/{YOUR_AWS_COGNITO_USER_POOL_ID}`

Add the variables to your environment/.env file you'll have .env.example to copy the variables from.

2.Install the necessary npm packages :

run `npm install`

3. Start the Docker containers:

run `docker-compose up -d`

## TypeORM Scripts

**Migration Generation**

To look for changes and create a new migration file if any change is detected, run:

`npm run migration:generate db/migrations/{name of the migration}`

**Migration Run**

To run the migration file you created earlier to apply your changes to the database, run:

`npm run migration:run`

**Revert Migration**

If you need to undo the last migration, run:

`npm run typeorm:revert-migration`
