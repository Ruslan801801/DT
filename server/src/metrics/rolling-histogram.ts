export class RollingHistogram {
  private readonly windowSize: number;
  private readonly measurements: number[] = [];

  constructor(windowSize = 1000) {
    this.windowSize = windowSize;
  }

  observe(value: number) {
    if (!Number.isFinite(value)) return;
    if (this.measurements.length >= this.windowSize) {
      this.measurements.shift();
    }
    this.measurements.push(value);
  }

  private quantile(sorted: number[], q: number): number {
    if (sorted.length === 0) return 0;
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    }
    return sorted[base];
  }

  get quantiles(): { p50: number; p95: number; p99: number } {
    const sorted = [...this.measurements].sort((a, b) => a - b);
    return {
      p50: this.quantile(sorted, 0.5),
      p95: this.quantile(sorted, 0.95),
      p99: this.quantile(sorted, 0.99),
    };
  }
}