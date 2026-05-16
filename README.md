# tarkon-api-gateway

The **API Gateway** is the single entry point for all external traffic entering the Tarkon platform. It handles routing, rate limiting, authentication validation, request transformation, and observability tagging.

---

## Responsibilities

- Route requests to the correct downstream microservice
- Validate and forward JWT tokens
- Rate limiting per user / role / IP
- Request / response logging with trace IDs
- Circuit breaking and retry policies
- API versioning (`/api/v1`, `/api/v2`)
- WebSocket proxying (for tarkon-realtime-platform)
- OpenAPI aggregation (merge all service specs)

---

## Tech Stack

| Layer           | Technology                     |
|-----------------|--------------------------------|
| Runtime         | Node.js 20                     |
| Language        | TypeScript                     |
| Framework       | Fastify                        |
| Auth Validation | JWT (RS256)                    |
| Rate Limiting   | @fastify/rate-limit             |
| Proxy           | @fastify/http-proxy             |
| Observability   | OpenTelemetry (OTLP)           |
| Testing         | Vitest + Supertest             |

---

## Project Structure

```
src/
  main.ts              # Fastify app bootstrap
  routes.ts            # route registration
  plugins/
    auth.ts            # JWT validation plugin
    rateLimit.ts
    tracing.ts
    cors.ts
  proxy/
    orchestrator.ts
    coreApi.ts
    authService.ts
    memoryEngine.ts
    ragEngine.ts
    realtimePlatform.ts
  middleware/
  types/
  config/
    routes.yaml        # upstream service map
tests/
docs/
helm/
  api-gateway/
Dockerfile
docker-compose.yml
```

---

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev       # http://localhost:8080
```

---

## Environment Variables

```env
PORT=8080
JWT_PUBLIC_KEY_PATH=./keys/public.pem
ORCHESTRATOR_URL=http://tarkon-ai-orchestrator:9000
CORE_API_URL=http://tarkon-core-api:8000
AUTH_SERVICE_URL=http://tarkon-auth-service:8001
MEMORY_ENGINE_URL=http://tarkon-memory-engine:8002
RAG_ENGINE_URL=http://tarkon-rag-engine:8003
REALTIME_URL=http://tarkon-realtime-platform:8080
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317
```

---

## Upstream Route Map (`config/routes.yaml`)

```yaml
routes:
  - prefix: /api/v1/auth
    upstream: AUTH_SERVICE_URL
  - prefix: /api/v1/chat
    upstream: ORCHESTRATOR_URL
  - prefix: /api/v1/missions
    upstream: CORE_API_URL
  - prefix: /api/v1/memory
    upstream: MEMORY_ENGINE_URL
  - prefix: /api/v1/rag
    upstream: RAG_ENGINE_URL
  - prefix: /ws
    upstream: REALTIME_URL
    websocket: true
```

---

## License

MIT
