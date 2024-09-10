# Docker Project README

## Overview

This project consists of two main components: a Django backend and a React.js frontend. Docker and Docker Compose are used to containerize and manage the services.


# Setting Up Docker Compose

Docker Compose is a tool for defining and running multi-container Docker applications. Follow these steps to set up Docker Compose on your machine.

## Prerequisites

- **Docker**: Ensure that Docker is installed and running on your machine. You can download and install Docker from [Docker's official website](https://www.docker.com/products/docker-desktop).
- **Docker Compose**: Docker Compose is included with Docker Desktop, but if you need to install it separately, follow the steps below.

## Installation

### Windows and macOS

Docker Compose is included with Docker Desktop. Install Docker Desktop by following the instructions for your operating system:

- **[Windows](https://docs.docker.com/desktop/install/windows-install/)**
- **[macOS](https://docs.docker.com/desktop/install/mac-install/)**

### Ensure docker-compose
Verify the installation:

```bash
docker-compose --version
```

## Getting Started

After above steps, we are ready to start. Follow these steps to build and run the project:

1. **Build Docker Images**

   ```bash
   docker-compose build
   ```
   This command will build all the images of corresponding DockerFile in frontend and backend folders.


2. **Run Docker Containers**
   ```bash
    docker-compose up
   ```
   This command will start the containers for both services as defined in the docker-compose.yml file. By default, it runs in detached mode. To view logs in the terminal, add the -d flag.
   

3. **Access the Application**
    
- **Frontend**: The React.js frontend should be accessible at `http://localhost:3000` (or another port if configured differently in `docker-compose.yml`).


- **Backend**: The Django backend should be accessible at `http://localhost:8000` (or another port if configured differently in `docker-compose.yml`).

## Stopping the Containers

To stop and remove the containers, use:

```bash
docker-compose down
```
This command stops the running containers and removes them. It also removes the networks created by `docker-compose up`

## Rebuild Containers

If you make changes to the Dockerfiles or configuration files, you may need to rebuild the containers:

```bash
docker-compose build
```
You can also force a fresh build by using:

```bash
   docker-compose build --no-cache
```

## Common Issues and Solutions

### Port Conflicts

**Problem**: When running `docker-compose up`, you might encounter port conflicts if the ports defined in `docker-compose.yml` are already in use on your host machine.

**Solution**: Modify the `docker-compose.yml` file to use different ports, or stop the services that are currently using those ports.

### Database Connection Errors

**Problem**: The Django backend may fail to connect to the database, often resulting in errors related to database connectivity.

**Solution**: Ensure that the database service is correctly defined in `docker-compose.yml` and is up and running. Check environment variables for correct database configuration.

### React Build Failures

**Problem**: The React frontend may fail to build due to missing dependencies or errors in the code.

**Solution**: Check the Dockerfile and `package.json` for missing dependencies. You can also try running `docker-compose build --no-cache` to force a fresh build.

### Permission Denied

**Problem**: You might encounter permission issues when trying to run `docker-compose` commands.

**Solution**: Ensure you have the necessary permissions to run Docker commands. You may need to add your user to the Docker group with `sudo usermod -aG docker $USER`.

## Additional Notes

- Ensure Docker and Docker Compose are installed and up to date on your machine.
- Refer to the `docker-compose.yml` file for specific configuration details related to ports, environment variables, and volumes.
- For more details on each service and their configurations, check the respective Dockerfiles and `docker-compose.yml`.
