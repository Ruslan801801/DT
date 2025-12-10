import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export function buildWinstonLogger() {
const transportConsole = new winston.transports.Console({
format: winston.format.combine(
winston.format.timestamp(),
winston.format.json()
),
});

const transportRotate = new (winston.transports as any).DailyRotateFile({
dirname: process.env.LOG_DIR || 'logs',
filename: 'deeptea-%DATE%.log',
datePattern: 'YYYY-MM-DD',
maxSize: '20m',
maxFiles: '14d',
zippedArchive: true,
format: winston.format.combine(
winston.format.timestamp(),
winston.format.json()
)
});

return WinstonModule.createLogger({
transports: [transportConsole, transportRotate],
});
}