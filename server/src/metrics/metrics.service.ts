import { Injectable } from '@nestjs/common';

type C = { help: string; value: number };
type H = { help: string; buckets: number[]; counts: number[]; sum: number; count: number };

@Injectable()
export class MetricsService {
private counters = new Map<string, C>();
private hist = new Map<string, H>();
private gauges = new Map<string, { help: string; value: number }>();

inc(name: string, help: string, delta = 1) {
const c = this.counters.get(name) || { help, value: 0 };
c.value += delta;
this.counters.set(name, c);
}

histogram(name: string, help: string, buckets: number[]) {
if (!this.hist.has(name)) {
this.hist.set(name, { help, buckets: buckets.slice().sort((a,b)=>a-b), counts: new Array(buckets.length+1).fill(0), sum: 0, count: 0 });
}
return {
observe: (v: number) => {
const h = this.hist.get(name)!;
h.sum += v; h.count += 1;
let i = h.buckets.findIndex(b => v <= b);
if (i === -1) i = h.counts.length - 1;
h.counts[i] += 1;
}
};
}

setGauge(name: string, help: string, value: number) {
this.gauges.set(name, { help, value });
}

text(): string {
let out = '';
for (const [name, c] of this.counters) {
out += `# HELP ${name} ${c.help}\n# TYPE ${name} counter\n${name} ${c.value}\n`;
}
for (const [name, h] of this.hist) {
out += `# HELP ${name} ${h.help}\n# TYPE ${name} histogram\n`;
let cumulative = 0;
for (let i=0;i<h.counts.length;i++){
cumulative += h.counts[i];
const le = i < h.buckets.length ? h.buckets[i] : '+Inf';
out += `${name}_bucket{le="${le}"} ${cumulative}\n`;
}
out += `${name}_sum ${h.sum}\n${name}_count ${h.count}\n`;
}
for (const [name, g] of this.gauges) {
out += `# HELP ${name} ${g.help}\n# TYPE ${name} gauge\n${name} ${g.value}\n`;
}
return out || '# no metrics yet\n';
}
}