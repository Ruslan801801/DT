# RFC 0005 — Merchant Dashboard (Lite)

## Кратко
Минимальная B2B панель с реалтайм обновлениями на основе существующих транзакций и ваучеров.

## Цели
- Дать бизнесу понятные KPI без тяжёлой аналитики.
- Построить слой поверх P2P/Vouchers, не изменяя ядро.
- Подготовить почву для tip pooling и сегментаций.

## Не входит в текущий этап
- ML-антифрод и сложные аномалии.
- Гео-heatmap высокой детализации.
- Полноценная CRM.

## Модель данных (MVP)
**Entity: Merchant**
- id
- name
- category
- settings_json

**Entity: Employee (optional MVP)**
- id
- merchant_id
- display_name
- role?

**Transaction metadata**
- `merchant_id`
- `employee_id?`

## API (MVP)
`GET /api/merchant/:id/dashboard`
Query:
- range? (`today` default)

WebSocket:
- `wss://.../merchant?merchantId=...`
Events:
- `initial_data`
- `live_update`

## Поток выполнения
1. При поступлении чаевых (online или redeem):
   - сервис обновляет кэш/агрегаты (Redis).
2. Dashboard endpoint собирает:
   - totalToday
   - averageTip
   - recentTips(20)
   - pendingVouchers
3. Gateway отправляет `live_update` каждые N секунд.

## Метрики
- `merchant_dashboard_requests_total`
- `merchant_live_updates_total`
- `merchant_cache_update_total`

## Чек-лист реализации
- [ ] Merchant entity + seed
- [ ] Analytics service (MVP агрегаты)
- [ ] Gateway вынести в отдельный класс
- [ ] Admin web skeleton (1 page)
- [ ] Документация privacy (агрегации без персональных данных)