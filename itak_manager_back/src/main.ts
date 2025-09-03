import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS
  app.enableCors(appConfig.cors);

  // Validation globale avec transformation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Préfixe global pour l'API
  app.setGlobalPrefix('api');

  const port = appConfig.port;
  await app.listen(port);

  console.log(
    `🚀 ${appConfig.name} v${appConfig.version} démarré sur le port ${port}`,
  );
  console.log(`🌍 Environnement: ${appConfig.environment}`);
  console.log(`📡 API disponible sur: http://localhost:${port}/api`);
}
bootstrap();
