import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";

const app = Fastify({ logger: true });

await app.register(cors, { origin: "*" });
await app.register(rateLimit, { max: 200, timeWindow: "1 minute" });

app.get("/health", async () => ({ status: "ok", service: "tarkon-api-gateway" }));

// TODO: register proxy routes from config/routes.yaml

const PORT = parseInt(process.env.PORT ?? "8080", 10);
await app.listen({ port: PORT, host: "0.0.0.0" });
console.log(`API Gateway listening on port ${PORT}`);
