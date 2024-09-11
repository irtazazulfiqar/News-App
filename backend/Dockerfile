FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app/backend

# Install system dependencies
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    libmariadb-dev \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file and install Python dependencies
COPY ./backend/requirements.txt /app/backend/
RUN pip install --upgrade pip && pip install -r /app/backend/requirements.txt

# Copy project files
COPY ./backend /app/backend

# Run the Django app
CMD ["python", "./manage.py", "runserver", "0.0.0.0:8000"]