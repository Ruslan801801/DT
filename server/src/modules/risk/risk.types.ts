export type RiskInput = {
rssi: number;            // dBm
eidAgeSec: number;       // seconds since EID observed/rotated
foreground: boolean;     // app in foreground
unlocked: boolean;       // device unlocked
variance?: number;       // optional EMA variance of RSSI
driftScore?: number;     // optional time drift score
};

export type RiskDecision = {
allow: boolean;
reasons: string[];
score: number; // 0..1 where 1 = safest
simulated?: boolean;
};

export type RiskConfig = {
rssiMin: number;       // default -65
eidAgeMaxSec: number;  // default 30
requireForeground: boolean; // default true
requireUnlocked: boolean;   // default true
};