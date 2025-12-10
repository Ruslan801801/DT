# RFC 0004 — Tip Battles (Lite)

## Кратко
Соревновательный режим, который использует существующий P2P слой и хранит состояние баттлов в БД.

## Цели
- Повысить вовлеченность без сложной экономики.
- Сделать масштабируемо (без in-memory state).
- Переиспользовать P2P идемпотентность и метрики.

## Не входит в текущий этап
- Power-ups, 'steal', сложные анти-слив механики.
- Денежные призовые фонды.
- Командные распределения на этапе MVP.

## Модель данных (MVP)
**Entity: Battle**
- id (uuid)
- type (`solo` | `team` | `royale`)
- target_receiver_id? (optional)
- start_at
- end_at
- status (`active` | `finished`)

**Entity: BattleParticipant**
- id
- battle_id
- user_id
- role? (optional)
- joined_at

**Transaction metadata**
- `battle_id` записывается в metadata P2P-транзакции.

## API (MVP)
`POST /api/battles/create`
Body:
- type
- duration_minutes
- target_receiver_id? (optional)
- participants? (optional list)

`POST /api/battles/:id/join`

`POST /api/battles/:id/tip`
Body:
- sender_id
- receiver_eid
- amount

`GET /api/battles/:id/leaderboard`

## Поток выполнения
1. Создание баттла записывает Battle в БД.
2. Участник присоединяется.
3. При `tip` сервер создаёт обычную P2P транзакцию и добавляет `metadata.battle_id`.
4. Лидерборд считается агрегатом:
   - SUM(amount) GROUP BY sender_id
   - фильтр по `battle_id` и `created_at` в окне баттла.

## Метрики
- `battle_create_total`
- `battle_join_total`
- `battle_tip_total`
- `battle_leaderboard_requests_total`

## Чек-лист реализации
- [ ] Battle/BattleParticipant entities + миграции
- [ ] Контроллеры create/join/tip/leaderboard
- [ ] SQL/ORM агрегат для лидерборда
- [ ] Минимальный WS gateway (опционально)
- [ ] Mobile: простой экран баттла с топ-3