import { Injectable, Logger } from '@nestjs/common';
import { RiskInput, RiskDecision, RiskConfig } from './risk.types';

const DEFAULTS: RiskConfig = {
  rssiMin: -65,
  eidAgeMaxSec: 30,
  requireForeground: true,
  requireUnlocked: true,
};

@Injectable()
export class RiskService {
  private readonly log = new Logger('RiskService');

  constructor(private cfg: RiskConfig = DEFAULTS) {}

  decide(input: RiskInput, shadow = true): RiskDecision {
    const cfg = this.cfg ?? DEFAULTS;

    const reasons: string[] = [];
    let allowed = true;
    let score = 1;

    // максимально “толерантно” к форме input (чтобы не падать по типам)
    const anyIn: any = input as any;

    const rssi = anyIn.rssi ?? anyIn.rssiAvg ?? anyIn.rssi_mean;
    if (typeof rssi === 'number' && rssi < cfg.rssiMin) {
      allowed = false;
      reasons.push(`rssi_low:${rssi}`);
      score -= 0.5;
    }

    const eidAgeSec = anyIn.eidAgeSec ?? anyIn.eid_age_sec ?? anyIn.eidAge;
    if (typeof eidAgeSec === 'number' && eidAgeSec > cfg.eidAgeMaxSec) {
      allowed = false;
      reasons.push(`eid_too_old:${eidAgeSec}`);
      score -= 0.5;
    }

    if (cfg.requireForeground && anyIn.isForeground === false) {
      allowed = false;
      reasons.push('not_foreground');
      score -= 0.25;
    }

    if (cfg.requireUnlocked && anyIn.isUnlocked === false) {
      allowed = false;
      reasons.push('device_locked');
      score -= 0.25;
    }

    if (!allowed) {
      this.log.debug(`decision=deny shadow=${shadow} reasons=${reasons.join(',')}`);
    }

    // возвращаем расширенный объект (чтобы совпасть с любым ожиданием RiskDecision)
    const decision: any = {
      allowed,
      ok: allowed,
      score,
      reasons,
      shadow,
      ts: new Date().toISOString(),
    };

    return decision as RiskDecision;
  }
}
