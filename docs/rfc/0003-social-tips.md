# RFC 0003 — Social Tip Jar

## Кратко
Социальный слой поверх P2P транзакций: сообщения благодарности, теги и уровень анонимности.

## Цели
- Увеличить эмоциональную ценность чаевых.
- Сохранить простоту и скорость отправки.
- Не ломать существующую модель P2P/Idempotency.

## Не входит в текущий этап
- NFT/он-чейн сертификаты.
- Хранение тяжелых медиа внутри сервиса.
- Публичные рейтинги без согласия.

## Модель данных (MVP)
**Entity: SocialTip**
- id (uuid)
- transaction_id
- sender_id
- receiver_id
- amount
- message (<= 140)
- anonymity_level (0/1/2)
- media_url? (nullable, только ссылка)
- location_label? (nullable)
- tags (text[])

Хранить как отдельную таблицу, связанная с P2P транзакцией по `transaction_id`.

## API (MVP)
`POST /api/social-tips/create`
Headers: `Idempotency-Key`
Body:
- sender_id
- receiver_eid
- amount
- message?
- anonymity_level?
- tags?
- location_label?

`GET /api/social-tips/history/:receiverId`

Позже:
- `POST /api/social-tips/media/upload` (если появится хранилище)

## Поток выполнения
1. Клиент выбирает получателя из Nearby.
2. Отправляет запрос `create` с `Idempotency-Key`.
3. Сервер:
   - вызывает существующий P2P create (`sender_id`, `receiver_eid`, `amount`)
   - сохраняет SocialTip с ссылкой на `tx.id`.
4. Клиент показывает receipt с благодарностью.

## Метрики
- `social_tip_create_total`
- `social_tip_history_requests_total`
- использовать уже имеющиеся:
  - `p2p_create_total`
  - `risk_decisions_total` (если включено)

## Чек-лист реализации
- [ ] Entity + миграция
- [ ] Module/Service/Controller
- [ ] OpenAPI дополнение
- [ ] Mobile: расширить экран отправки (message/tags/anonymity)
- [ ] E2E тест happy-path