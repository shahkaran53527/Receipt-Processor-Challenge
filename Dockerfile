# Use the official Node.js runtime as the base image
FROM node:latest

# Set the working directory in the container
RUN mkdir -p /Receipt Processor Challenge

# Set the working directory in the container
WORKDIR /Receipt Processor Challenge

# Copy package.json and package-lock.json to the container
COPY package.json ./

# Copy package.json and package-lock.json to the container
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port that the app will run on
EXPOSE 3000

# The command to run the app
CMD npm start
