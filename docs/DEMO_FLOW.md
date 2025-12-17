# Demo Flow (dev only)

Swagger:
- http://localhost:3000/docs
- (если глобальный префикс /api — попробуй /api/docs)

Demo endpoints (disabled in production):

1) Dev login:
POST /api/demo/login
Body: { "name": "Ruslan" }

2) Create tip:
POST /api/demo/tip
Body:
{
  "fromToken": "dt_demo_...",
  "toName": "Barista",
  "amount": 150,
  "message": "Спасибо!"
}

3) Feed:
GET /api/demo/feed
