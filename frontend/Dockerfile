# frontend/Dockerfile

# Use Node.js for build
#FROM node:18-alpine AS build
#WORKDIR /app

# Copy package files and install dependencies
#COPY package.json package-lock.json ./
#RUN npm install

# Copy app source and build
#COPY . .
#RUN npm run build

# Serve the build with Nginx
#FROM nginx:alpine
#COPY --from=build /app/build /usr/share/nginx/html

#EXPOSE 80

#CMD ["nginx", "-g", "daemon off;"]

# frontend/Dockerfile

# Use Node.js for build
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source and build
COPY ./src ./src
COPY ./public ./public
RUN npm run build

# Serve the build with Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
