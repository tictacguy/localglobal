FROM node:20-alpine

WORKDIR /app

# Install dependencies (bcryptjs is pure JS — no native toolchain needed).
COPY package*.json ./
RUN npm install

# Generate Prisma client against the schema.
COPY prisma ./prisma
RUN npx prisma generate

# Build TypeScript.
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

ENV NODE_ENV=production
EXPOSE 8080

CMD ["./docker-entrypoint.sh"]
