# DT Demo Flow

## Enable demo endpoints
Set:
- DEMO_MODE=1

When DEMO_MODE is off, demo routes return 404 (hidden).

## Endpoints (если у тебя global prefix /api — добавь /api перед /demo)
- GET  /demo/health
- POST /demo/reset?seed=true
- POST /demo/login   body: {"name":"Alice"}
- POST /demo/tip     body: {"toName":"Bob","amount":150,"message":"Thanks"}
  Token via headers:
  - Authorization: Bearer <token>
  - or X-Demo-Token: <token>
- GET  /demo/feed

## Quick curl (без jq)
BASE="http://localhost:3000"

curl -s "$BASE/demo/health"

curl -s -X POST "$BASE/demo/login" \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice"}'

curl -s -X POST "$BASE/demo/tip" \
  -H "Content-Type: application/json" \
  -d '{"toName":"Bob","amount":150,"message":"Thanks"}'

curl -s "$BASE/demo/feed"
