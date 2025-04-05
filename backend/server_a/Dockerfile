# This is where you define the image for
# the server A.

# You should use Node image from Docker Hub as the basis.

#FROM node:version...
FROM node:18
EXPOSE 8082
#WORKDIR ?
WORKDIR /app
#COPY ?
COPY package*.json ./
# RUN ?
RUN npm install
#COPY . .
COPY . .
#CMD [??]
CMD [ "npm", "start" ]