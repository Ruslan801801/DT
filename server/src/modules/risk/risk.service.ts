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
const reasons: string[] = [];
let score = 1;
