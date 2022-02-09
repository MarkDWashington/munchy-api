# Use node:17-alpine as the base image
FROM node:17-alpine

# Create a new working directory in the container
WORKDIR /app

# Copy npm package files to working dir
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy Typescript config and source code to working dir
COPY tsconfig.json ./src ./

# Compile code
RUN npx tsc

# Expose port 3000 on the container
EXPOSE 3000

# Set default command when running a container
CMD ["node", "./dist/app.js"]