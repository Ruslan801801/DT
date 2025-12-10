# Runbook: P2P Error Rate High

## Symptom
Alert: P2PHighErrorRate — success_online_percent < 70% for 5m

## Immediate actions
1. Check /metrics for p2p_create_total, p2p_idempotency_reuse_total.
2. Inspect API logs (winston daily files) for spikes or errors.
3. Verify Redis availability (/ready).

## Possible causes
- Redis unavailable (idempotency fails).
- PSP callbacks degraded.
- BLE instability causing user retries.

## Mitigation
- Enable kill-switch for Quick-Send if needed.
- Temporarily relax risk predicates.
- Scale API replicas.