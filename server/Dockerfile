# Debian slim (glibc + OpenSSL 3): avoids Prisma's musl/OpenSSL detection issues.
FROM node:20-slim

WORKDIR /app

# Prisma's query/schema engines need openssl + CA certs at build and runtime.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

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
