#!/usr/bin/env sh
set -eu

BASE="${1:-http://localhost:3000}"

echo "== DT DEMO FLOW =="
echo "BASE: $BASE"
echo

echo "-- feed"
curl -sS "$BASE/api/demo/feed" || true
echo
