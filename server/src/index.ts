import { createApp } from "./app.js";
import { env } from "./env.js";
import { prisma } from "./prisma.js";

const app = createApp();

const server = app.listen(env.port, () => {
  console.log(`[localglobal-api] listening on :${env.port} (prod=${env.isProd})`);
});

async function shutdown(signal: string) {
  console.log(`[localglobal-api] ${signal} received, shutting down`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}
process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
