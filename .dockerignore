FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build the application
RUN node ace build --production

# Expose the port
EXPOSE 3333

# Start the application
CMD ["node", "build/server.js"]