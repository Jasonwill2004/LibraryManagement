# Library Management System

This project is a Library Management System that includes logging, containerization, and deployment. The application is built using Node.js, Express, and Prisma, and it uses PostgreSQL as the database. The project is containerized using Docker and Docker Compose.

## Technologies Used

- **Node.js**: JavaScript runtime for building the server-side application.
- **Express**: Web framework for Node.js to handle HTTP requests and routing.
- **Prisma**: ORM (Object-Relational Mapping) tool for database interactions.
- **PostgreSQL**: Relational database management system.
- **Winston**: Logging library for Node.js.
- **Docker**: Containerization platform to package the application and its dependencies.
- **Docker Compose**: Tool for defining and running multi-container Docker applications.

### Description

Implemented a logging mechanism using the Winston library. The log pattern is `[date time] [log level] [function] - Log statement`, and the path to the log file is parameterizable using environment variables.

### Code

- **Logger Configuration**: `src/logger.js`
- **Log File**: `logs/app.log`

