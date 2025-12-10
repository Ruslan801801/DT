import { Injectable } from '@nestjs/common';

type TipContext = {
  transaction_amount: number;
  historical_tips: number[];
  service_quality?: number; // 0-5
  time_of_day?: number; // 0-23
};

@Injectable()
export class AiTipsService {
  recommend(ctx: TipContext) {
    const base = this.baseAmount(ctx);
    const rounded = this.roundToPreset(base);
    const alternatives = this.alternatives(rounded, ctx);

    const explanation = `Рекомендуем ${rounded} ₽ на основе суммы чека, вашей истории и оценки сервиса.`;

    return {
      recommended_amount: rounded,
      alternatives,
      explanation,
    };
  }

  private baseAmount(ctx: TipContext) {
    const bill = ctx.transaction_amount || 0;
    let perc = 0.1; // 10%

    if (ctx.service_quality && ctx.service_quality >= 4.5) perc = 0.15;
    if (ctx.service_quality && ctx.service_quality <= 2.5) perc = 0.05;

    const histAvg = ctx.historical_tips.length
      ? ctx.historical_tips.reduce((a, b) => a + b, 0) / ctx.historical_tips.length
      : null;

    let candidate = bill * perc;
    if (histAvg && candidate < histAvg * 0.7) candidate = histAvg * 0.7;

    const min = 10;
    const max = 10_000;
    return Math.min(max, Math.max(min, candidate));
  }

  private roundToPreset(x: number) {
    const presets = [50, 100, 150, 200, 300, 500, 1000];
    let best = presets[0];
    let bestDiff = Math.abs(x - best);
    for (const p of presets) {
      const diff = Math.abs(x - p);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = p;
      }
    }
    return best;
  }

  private alternatives(base: number, ctx: TipContext) {
    return [
      {
        amount: Math.round(base * 0.7),
        label: 'Экономно',
        icon: '💰',
      },
      {
        amount: base,
        label: 'Стандарт',
        icon: '👍',
      },
      {
        amount: Math.round(base * 1.5),
        label: 'Щедро',
        icon: '💎',
      },
      ...(ctx.transaction_amount
        ? [10, 15, 20].map(p => ({
            amount: Math.round((ctx.transaction_amount * p) / 100),
            label: `${p}% от чека`,
            icon: '📊',
          }))
        : []),
    ];
  }
}

---