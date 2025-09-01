import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS
  app.enableCors(appConfig.cors);

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
