import { LoggerService } from '@nestjs/common';

export interface LogEntry {
level: 'debug' | 'info' | 'warn' | 'error';
timestamp: string;
message: string;
context?: string;
correlationId?: string;
[key: string]: any;
}

export class StructuredLogger implements LoggerService {
private correlationId = '';
setCorrelationId(id: string) { this.correlationId = id; }

private write(level: LogEntry['level'], message: string, context?: string, meta?: any) {
const entry: LogEntry = { level, timestamp: new Date().toISOString(), message, correlationId: this.correlationId, ...meta };
if (context) entry.context = context;
const out = JSON.stringify(entry);
if (level === 'error') console.error(out);
else if (level === 'warn') console.warn(out);
else console.log(out);
}

log(message: any, context?: string) { this.write('info', String(message), context); }
error(message: any, trace?: string, context?: string) { this.write('error', String(message), context, { trace }); }
warn(message: any, context?: string) { this.write('warn', String(message), context); }
debug(message: any, context?: string) { this.write('debug', String(message), context); }
verbose(message: any, context?: string) { this.write('debug', String(message), context); }
}