#!/bin/sh
set -e

echo "[entrypoint] waiting for database..."
# Apply the schema to the database (idempotent, no migration files needed).
npx prisma db push --skip-generate --accept-data-loss

echo "[entrypoint] starting API..."
exec node dist/index.js
