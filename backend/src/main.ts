import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // Fix Prisma Decimal serialization
  const originalJson = JSON.stringify;
  (JSON as any).stringify = function (value: any, replacer: any, space: any) {
    return originalJson(value, (key, val) => {
      if (val !== null && typeof val === 'object' && typeof val.toFixed === 'function') {
        return Number(val);
      }
      return replacer ? replacer(key, val) : val;
    }, space);
  };

  const config = new DocumentBuilder()
    .setTitle('ERP System API')
    .setDescription('ERP System API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`📚 Swagger docs available at: http://localhost:${port}/docs`);
}

bootstrap();