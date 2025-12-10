export type ContactSample = {
  rssi: number;
  durationSec: number;
};

/**
 * Примитивный risk scoring по мотивам DP3T:
 * Чем выше RSSI (ближе устройства) и чем дольше контакт,
 * тем выше итоговый score.
 */
export function scoreExposure(samples: ContactSample[]): number {
  if (!samples.length) return 0;
  let score = 0;
  for (const s of samples) {
    const distanceWeight = Math.exp((s.rssi + 60) / 10);
    score += distanceWeight * (s.durationSec / 60);
  }
  return score;
}

export function classifyExposure(score: number): 'low' | 'medium' | 'high' {
  if (score <= 1) return 'low';
  if (score <= 5) return 'medium';
  return 'high';
}