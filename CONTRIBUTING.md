# Contributing

Thanks for your interest in improving DT!

## Quick start
1. Fork the repo and create a branch from `main`
2. Keep PRs small (PR1 -> PR2 style is perfect)
3. Ensure CI is green

## Local development
- Dev: `docker compose -f docker-compose.dev.yml up -d --build`
- Prod demo: `docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build`

## PR checklist
- Clear description + screenshots/logs if needed
- No secrets committed
- Docs updated if behavior changes
