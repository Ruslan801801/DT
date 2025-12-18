#!/bin/sh
set -eu
docker compose -f docker-compose.dev.yml up -d --build
docker compose -f docker-compose.dev.yml ps
echo ""
echo "Try:"
echo "  curl -s http://localhost:3000/api/health || curl -s http://localhost:3000/health"
echo "  Swagger: http://localhost:3000/api/docs (or /docs)"
