# A boilerplate for building RESTful APIs using Node.js, Express.js and PostgreSQL

## Manual Installation

If you would still prefer to do the installation manually, follow these steps:

Clone the repo:

```bash
git clone https://github.com/ruhit07/node-express-boilerplate-v2.git
cd node-express-boilerplate-v2
```

Install the dependencies:

```bash
npm install
```

Set the environment variables:

```bash
cp .env.example .env.development

# open .env.development and modify the environment variables (if needed)
```
## Features

- **SQL database**: [PostgreSQL](https://www.postgresql.org/) sql query builder using [sequelize](https://sequelize.org/)
- **Authentication**: using [jsonwebtoken](https://jwt.io)
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
- **Logging**: using [morgan](https://github.com/expressjs/morgan)
- **Error handling**: centralized error handling mechanism
- **Dependency management**: with [Npm](https://docs.npmjs.com)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv)
- **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io), HTTP parameter pollution attacks using [hpp](https://github.com/analog-nico/hpp)
- **CORS**: cross-origin resource-sharing enabled using [cors](https://github.com/expressjs/cors)

## Commands

Running locally:

```bash
npm run dev
```

## Environment Variables

The environment variables can be found and modified in the `.env.development` file. They come with these default values:

```bash
NODE_ENV=example
PORT=3900

# Database Settings
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=101
DB_NAME=test_db

# JWT Settings
JWT_SECRET=unsecureJwtSecret
JWT_EXPIRES=1d
COOKIE_EXPIRES=1
```

## Project Structure
```
|--config\               # Environment variables and configuration related things
|--controllers\          # Controller layer
|--enums\                # Common enum values
|--middlewares\          # Custom express middlewares
|--models\                # Modules
|--routes\               # Routes
|--utils\                # Utility classes and functions
|--validations\          # Request data validation schemas
|--app.js                # App file
|--server.js             # App entry point
```

### API Endpoints

List of available routes:

**Auth routes**:\
`POST /api/v2/auth/register` - register\
`POST /api/v2/auth/login` - login\
`DELETE /api/v2/auth/logout` - logout\
`GET /api/v2/auth/me` - retriving his profile\
`DELETE /api/v2/auth/me` - delete currect user\
`PUT /api/v2/auth/updatedetails` - update his details\
`PUT /api/v2/auth/updatepassword` - update his password

**User routes**:\
`GET /api/v2/users` - get all users\
`GET /api/v2/users/:id` - get user\
`POST /api/v2/users` - create a user\
`PUT /api/v2/users/:id` - update user\
`DELETE /api/v2/users/:id` - delete user
