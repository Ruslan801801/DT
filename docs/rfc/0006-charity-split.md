# RFC 0006 — Charity Tips (Off-chain Split)

## Кратко
Возможность направлять часть чаевых на благотворительность без смарт-контрактов на этапе MVP.

## Цели
- Проверить продуктовую ценность функции быстро.
- Сохранить простую бухгалтерскую модель.
- Не зависеть от блокчейна на раннем этапе.

## Не входит в текущий этап
- On-chain прозрачность и matching funds.
- NFT-сертификаты благотворительности.
- Сложные налоговые сценарии.

## Модель данных (MVP)
**Entity: Charity**
- id
- name
- category
- region?
- is_active

**Entity: CharityDonation**
- id
- donor_id
- charity_id
- amount
- message?
- created_at

**Transaction metadata**
- `charity_split_percent?`
- `charity_id?`

## API (MVP)
`GET /api/charities`
Query:
- region?
- category?

`POST /api/charity-tips/create`
Headers: `Idempotency-Key`
Body:
- sender_id
- receiver_eid
- amount_total
- charity_id
- donation_percent (0..100)
- message?

## Поток выполнения
1. Клиент выбирает % и организацию.
2. Сервер рассчитывает:
   - amount_receiver
   - amount_donation
3. Создает:
   - P2P транзакцию получателю
   - CharityDonation запись (или отдельный внутренний перевод на charity-account).
4. Возвращает split receipt.

## Метрики
- `charity_tip_create_total`
- `charity_donation_amount_total`

## Чек-лист реализации
- [ ] Charity seed data
- [ ] CharityDonation entity + миграция
- [ ] Endpoint списков и create
- [ ] Mobile: экран выбора charity + split preview