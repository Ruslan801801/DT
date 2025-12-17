# DeepTea — Release checklist (v0.1)

## Build is reproducible
- [ ] В репо есть lock-файл (package-lock.json / yarn.lock / pnpm-lock.yaml)
- [ ] CI проходит “install + lint/typecheck/test/build” (что есть)

## Backend
- [ ] `docker compose up` поднимает зависимости (Postgres/Redis если используются)
- [ ] Сервер стартует локально и видит БД
- [ ] `GET /api/health` → 200 (или аналог)

## Mobile (Expo/EAS)
- [ ] dev/stage/prod конфиги окружений (API URL, фичефлаги)
- [ ] Permissions (Bluetooth/Location) описаны и реально нужны
- [ ] EAS: preview (internal) + production сборки

## Product minimum v0.1
- [ ] Onboarding + базовая auth
- [ ] Создание “tip intent” (сумма/сообщение)
- [ ] Nearby (BLE) + отправка/получение intent (хотя бы демо)
- [ ] История операций + экран “квитанция”

## Store readiness
- [ ] Privacy Policy / Terms (черновики минимум)
- [ ] Data safety / permissions rationale подготовлены
