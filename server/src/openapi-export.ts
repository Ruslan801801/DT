import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { AppModule } from './app.module';

async function main() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const cfg = new DocumentBuilder()
    .setTitle('DT API')
    .setDescription('DeepTea / DT backend API')
    .setVersion(process.env.APP_VERSION ?? '0.1.0')
    .build();

  const doc = SwaggerModule.createDocument(app, cfg);

  const outPath = process.env.OPENAPI_EXPORT_PATH ?? 'openapi.json';
  writeFileSync(resolve(outPath), JSON.stringify(doc, null, 2) + '\n');

  await app.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
