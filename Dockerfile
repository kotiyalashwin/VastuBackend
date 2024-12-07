# Stage 1: Build
FROM node:18 AS builder

WORKDIR /build

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install 

# Copy source code, Prisma schema, and configuration files
COPY src/ src/ 
COPY prisma/ prisma/
COPY tsconfig.json tsconfig.json

# Install Prisma globally and run migrations during the build phase
RUN npm install -g prisma
RUN npx prisma generate # Generates the Prisma Client

RUN npm run build

# Stage 2: Runner
FROM node:18 AS runner

WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /build/package*.json ./
COPY --from=builder /build/node_modules node_modules/
COPY --from=builder /build/dist dist/
COPY prisma/ prisma/ 

# Set the command to start the application
CMD [ "npm", "start" ]