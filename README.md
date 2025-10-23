# CronJobs Manager

A full-stack web application for managing scheduled HTTP jobs (cron jobs) with a modern user interface. Built with NestJS, PostgreSQL, Redis, and Alpine.js.

## Features

- 🔐 **User Authentication** - JWT-based authentication with registration and login
- ⏰ **Cron Job Management** - Create, edit, and delete scheduled HTTP requests
- 🎯 **Multiple HTTP Methods** - Support for GET, POST, PUT, PATCH, DELETE requests
- 📋 **Custom Headers & Body** - Add custom headers and request body to your jobs
- 📊 **Job Execution Logging** - Track all job executions with detailed logs
- 🔄 **Redis Queue** - Reliable job scheduling with Bull queue
- 🎨 **Modern UI** - Responsive design with Tailwind CSS and Alpine.js
- 📱 **Mobile-Friendly** - Works seamlessly on desktop and mobile devices
- 📅 **Cron Presets** - Quick selection of common schedules or custom cron expressions

## Tech Stack

### Backend

- **NestJS 11** - Progressive Node.js framework
- **TypeScript 5.7** - Type-safe development
- **Prisma ORM** - Modern database toolkit
- **PostgreSQL 13** - Relational database
- **Redis 7** - In-memory data store for job queue
- **Bull** - Premium job queue
- **Passport JWT** - Authentication

### Frontend

- **Alpine.js 3** - Lightweight reactive framework
- **Tailwind CSS** - Utility-first CSS framework
- **Vanilla JavaScript** - No build step required

### DevOps

- **Docker & Docker Compose** - Containerization
- **Node.js 20 Alpine** - Lightweight runtime environment

## Description

This project provides a complete solution for managing scheduled HTTP requests (cron jobs). Users can create jobs that make HTTP requests at specified intervals using cron expressions. All job executions are logged with detailed information including status codes, response data, and execution duration.

This project provides a complete solution for managing scheduled HTTP requests (cron jobs). Users can create jobs that make HTTP requests at specified intervals using cron expressions. All job executions are logged with detailed information including status codes, response data, and execution duration.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://www.docker.com/get-started) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/slotherinee/cronjobs.git
cd cronjobs
```

### 2. Navigate to the Docker directory

```bash
cd docker_n
cp .env.example .env
```

### 3. Start the application

```bash
docker-compose up -d
```

This command will:

- Start PostgreSQL database on port 5432
- Start Redis server on port 6379
- Build and start the NestJS application on port 3000

### 4. Initialize the database

The Prisma migrations will run automatically when the container starts. If you need to manually run migrations:

```bash
docker exec -it pgsql-node npx prisma migrate deploy
```

### 5. Access the application

Open your browser and navigate to:

```
http://localhost:3000
```

## Project Structure

```
cronjobs/
├── docker_n/                   # Docker configuration
│   ├── docker-compose.yml     # Docker Compose configuration
│   ├── Dockerfile             # Application Dockerfile
│   └── sourcefiles/
│       └── pgsql/             # PostgreSQL data volume
├── src/                       # NestJS source code
│   ├── auth/                  # Authentication module
│   ├── job/                   # Job management module
│   │   ├── job.controller.ts
│   │   ├── job.service.ts
│   │   ├── job.processor.ts
│   │   └── job-scheduler.service.ts
│   ├── job-log/               # Job logging module
│   ├── user/                  # User module
│   └── prisma/                # Prisma service
├── prisma/                    # Prisma schema and migrations
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/                    # Frontend files
│   └── index.html             # Single-page application
└── README.md                  # This file
```

## Environment Variables

The application uses the following environment variables (defined in `docker-compose.yml`):

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@pgsql:5432/cronjobs

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

## Development

### Running without Docker

If you prefer to run the application without Docker:

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your local database and Redis URLs

# Run Prisma migrations
npx prisma migrate dev

# Start the development server
npm run start:dev
```

### Watch mode

The Docker container is configured to run in watch mode, so changes to your code will automatically restart the server.

### Accessing logs

```bash
# View application logs
docker logs pgsql-node

# Follow logs in real-time
docker logs -f pgsql-node

# View PostgreSQL logs
docker logs pgsql-pgsql

# View Redis logs
docker logs pgsql-redis
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user info

### Jobs

- `GET /api/v1/jobs` - Get all jobs for current user
- `POST /api/v1/jobs` - Create a new job
- `GET /api/v1/jobs/:id` - Get job by ID
- `PATCH /api/v1/jobs/:id` - Update a job
- `DELETE /api/v1/jobs/:id` - Delete a job

### Job Logs

- `GET /api/v1/job-logs/job/:jobId` - Get logs for a specific job
- `GET /api/v1/job-logs/:id` - Get a specific log entry

## Usage Examples

### Creating a Job

1. Register/Login to the application
2. Click "+" button to create a new job
3. Fill in the form:
   - **Name**: Descriptive name for your job
   - **URL**: The endpoint to call
   - **HTTP Method**: GET, POST, PUT, PATCH, or DELETE
   - **Headers**: Custom headers in JSON format (optional)
   - **Body**: Request body (optional, for POST/PUT/PATCH)
   - **Schedule**: Choose from presets or enter custom cron expression
   - **Active**: Enable/disable the job

### Cron Expression Examples

The application provides convenient presets:

- Every minute: `* * * * *`
- Every 5 minutes: `*/5 * * * *`
- Every hour: `0 * * * *`
- Daily at midnight: `0 0 * * *`
- Weekly on Sunday: `0 0 * * 0`

Or use custom cron expressions with format: `minute hour day month weekday`

### Viewing Job Logs

1. Click the "📋 Logs" button on any job
2. View execution history with status codes and response times
3. Click "Show Full Response" to see complete response data
4. Use "Copy" button to copy response to clipboard

### Viewing Job Logs

1. Click the "📋 Logs" button on any job
2. View execution history with status codes and response times
3. Click "Show Full Response" to see complete response data
4. Use "Copy" button to copy response to clipboard

## Stopping the Application

```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v
```

## Troubleshooting

### Port already in use

If you get an error that ports 3000, 5432, or 6379 are already in use:

```bash
# Find process using the port (example for port 3000)
lsof -i :3000

# Kill the process
kill -9 <PID>
```

Or change the ports in `docker-compose.yml`.

### Database connection issues

```bash
# Check if PostgreSQL is running
docker ps | grep pgsql-pgsql

# Check PostgreSQL logs
docker logs pgsql-pgsql

# Restart the database container
docker restart pgsql-pgsql
```

### Redis connection issues

```bash
# Check if Redis is running
docker ps | grep pgsql-redis

# Test Redis connection
docker exec -it pgsql-redis redis-cli ping
# Should return: PONG
```

### Clear Redis queue

If you need to clear the job queue:

```bash
docker exec -it pgsql-redis redis-cli FLUSHALL
```

### Rebuild containers

If you made changes to dependencies or Dockerfile:

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Database Management

### Access Prisma Studio

Prisma Studio provides a GUI for your database:

```bash
docker exec -it pgsql-node npx prisma studio
```

Then open http://localhost:5555 in your browser.

### Run migrations

```bash
# Create a new migration
docker exec -it pgsql-node npx prisma migrate dev --name your_migration_name

# Apply pending migrations
docker exec -it pgsql-node npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
docker exec -it pgsql-node npx prisma migrate reset
```

### Access PostgreSQL directly

```bash
# Connect to PostgreSQL
docker exec -it pgsql-pgsql psql -U postgres -d cronjobs

# Common commands:
# \dt - list tables
# \d table_name - describe table
# SELECT * FROM "User"; - query users
# \q - quit
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Production Deployment

For production deployment:

1. **Change JWT Secret**: Update `JWT_SECRET` in your environment
2. **Use strong passwords**: Change PostgreSQL and Redis passwords
3. **Enable SSL**: Configure SSL for PostgreSQL
4. **Set up monitoring**: Use tools like PM2, New Relic, or DataDog
5. **Configure CORS**: Update CORS settings in `main.ts`
6. **Use a reverse proxy**: Set up Nginx or similar
7. **Enable rate limiting**: Protect your API endpoints

### Production Docker Compose

Create a `docker-compose.prod.yml` with production settings:

```yaml
version: '3.8'
services:
  app:
    build:
      context: ..
      dockerfile: docker_n/Dockerfile
    command: npm run start:prod
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
    # Add health checks, resource limits, etc.
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is [MIT licensed](LICENSE).

## Support

For issues and questions:

- Open an issue on GitHub
- Check existing issues for solutions

## Acknowledgments

Built with:

- [NestJS](https://nestjs.com/) - Backend framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Bull](https://github.com/OptimalBits/bull) - Job queue
- [Alpine.js](https://alpinejs.dev/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

# (README IS AI GENERATED)
