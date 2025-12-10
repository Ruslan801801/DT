# RFC 0007 — Predictive Tips (Rule-based MVP)

## Кратко
Простые рекомендации суммы чаевых на основе исторических данных без тяжелого ML.

## Цели
- Ускорить выбор суммы.
- Собрать данные для будущей ML-модели.
- Держать вычисления лёгкими и предсказуемыми.

## Не входит в текущий этап
- Нейросетевые модели на сервере.
- Анализ настроения/голоса.
- Персонализация, требующая чувствительных данных.

## Модель данных (MVP)
**Service: RecommendationService**
- источник данных: последние N чаевых пользователя
- функции:
  - median/mean
  - time-of-day коэффициент
  - min/max ограничения
  - округление до ближайшего пресета

**Entity (optional later): TipRecommendationLog**
- id
- user_id
- receiver_id?
- recommended_amount
- accepted_amount?
- created_at

## API (MVP)
`POST /api/ai/recommend-tip`
Body:
- user_id
- receiver_id?
- context?
Response:
- recommended_amount
- confidence (rule-based score)
- alternatives [{label, amount}]

Позже:
- feedback endpoint

## Поток выполнения
1. Клиент передает контекст (опционально).
2. Сервер находит историю пользователя.
3. Считает базовую рекомендацию и 3 альтернативы:
   - Экономно (~0.7x)
   - Стандарт (1.0x)
   - Щедро (~1.5x)
4. Возвращает объяснение короткой строкой.

## Метрики
- `ai_recommend_requests_total`
- `ai_recommend_fallback_total`

## Чек-лист реализации
- [ ] RecommendationService с правилами
- [ ] Controller + OpenAPI
- [ ] Mobile: простой экран карточек выбора
- [ ] Логирование принятой суммы (опционально)