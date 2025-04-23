# emotegenerator/Dockerfile
# Define the base image.
FROM node:18
# Create a new directory inside the container and define it as the working directory.
WORKDIR /app
# For efficiency, first only copy package.json related files to container.
COPY package*.json ./
# Install all dependencies.
RUN npm install
# Copy the rest of this service to the container.
COPY . .
# Start the service.
CMD [ "node", "index.js" ]
