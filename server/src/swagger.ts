import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const env = process.env.NODE_ENV || 'development';
  const enabled = process.env.SWAGGER_ENABLED
    ? process.env.SWAGGER_ENABLED !== 'false'
    : env !== 'production';

  if (!enabled) return;

  const cfg = new DocumentBuilder()
    .setTitle('DeepTea API')
    .setDescription('Demo + P2P tips backend')
    .setVersion(process.env.APP_VERSION || '0.1.0')
    .addBearerAuth()
    .build();

  const doc = SwaggerModule.createDocument(app, cfg);
  SwaggerModule.setup('docs', app, doc, {
    swaggerOptions: { persistAuthorization: true },
  });
}
