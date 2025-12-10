DeepTea Ops — Quick Runbooks

High time drift

· Action: enable force_confirm for affected cohort.
· Notify users to resync system time.
· Track: time_drift_score_avg.
· Alert: HighTimeDrift (Prometheus).

Webhook duplicates spike

· Increase dedup TTL temporarily.
· Verify PSP status and network loss.
· Track: webhook_retry_rate, idempotency_collision_rate.

Push delivery degradation

· Enable in-app reminders / banners.
· Reduce background sync interval.
· Track: push_delivery_rate; aim ≥85%.