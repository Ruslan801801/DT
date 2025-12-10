import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
private attempts = new Map<string, { count: number; resetTime: number }>();
private readonly WINDOW_MS = 60_000; // 1 minute
private readonly MAX_REQUESTS = 100; // per window

use(req: Request, res: Response, next: NextFunction) {
if (process.env.ENABLE_RATE_LIMITING === '0') return next();

const key = `${req.ip}:${req.method}:${req.path}`;
const now = Date.now();
const record = this.attempts.get(key);

if (!record || now > record.resetTime) {
this.attempts.set(key, { count: 1, resetTime: now + this.WINDOW_MS });
return next();
}
if (record.count >= this.MAX_REQUESTS) {
throw new HttpException(
{ code: 'rate_limit_exceeded', message: 'Too many requests', retryAfter: Math.ceil((record.resetTime - now) / 1000) },
HttpStatus.TOO_MANY_REQUESTS
);
}
record.count++;
this.attempts.set(key, record);
next();
}
}