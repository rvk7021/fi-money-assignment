# Stage 1: Build frontend
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build backend
FROM node:18 AS backend-build
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci
COPY backend/ ./

# Copy frontend build to backend
COPY --from=frontend-build /app/frontend/build ./src/public

# Stage 3: Production image
FROM node:18-slim
WORKDIR /app/backend
COPY --from=backend-build /app/backend ./
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "src/index.js"] 