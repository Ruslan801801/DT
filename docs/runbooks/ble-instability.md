# Runbook: BLE Instability (High Candidate Flip Rate)

## Symptom
Alert: HighCandidateFlipRate — flip_rate > 0.3 for 15m

## Immediate checks
1. BLE scan availability gauge.
2. Device compatibility matrix (docs/compat-matrix.md).
3. Recent app versions & OS breakdown.

## Actions
- Reduce scan interval, increase EMA smoothing.
- Prompt users to keep app in foreground.
- Trigger A/B shadow changes via remote config.