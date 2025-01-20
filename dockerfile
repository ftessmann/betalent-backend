FROM node:20.18.1

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build the application
RUN node ace build --ignore-ts-errors

# Start the application
CMD ["node", "build/server.js"]