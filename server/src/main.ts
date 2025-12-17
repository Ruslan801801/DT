import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import helmet from 'helmet';
import csurf from 'csurf';
import { ValidationPipe } from '@nestjs/common';
import { buildWinstonLogger } from './utils/winston.logger';
import cookieParser from 'cookie-parser';
import { buildCorsOptions } from './config/cors';

async function bootstrap() {
const app = await NestFactory.create(AppModule, { logger: buildWinstonLogger() });
  setupSwagger(app);
app.enableCors(buildCorsOptions());
app.use(helmet());
if (process.env.ENABLE_CSRF === '1') { app.use(csurf({ cookie: true })); }
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidUnknownValues: true }));
app.use(cookieParser());
await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
console.log('DeepTea server listening on :' + (process.env.PORT || 3000));
}
bootstrap();