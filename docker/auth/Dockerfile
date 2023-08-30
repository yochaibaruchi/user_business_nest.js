# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle app source
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variable
ENV NODE_ENV development

# Run the app when the container launches
CMD npm run migration:run && npm run start:prod
