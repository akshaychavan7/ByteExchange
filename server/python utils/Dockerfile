# Use the official Python image as base image
FROM python:3.9

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . .

# Expose port 8001 to allow external connections
EXPOSE 8001

# Run the pyserver
CMD ["python3", "pyserver.py"]
