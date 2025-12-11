import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

export function setupSwagger(app: INestApplication) {
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('ITAK Manager')
    .setDescription('API ITAK Manager')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter JWT access token',
    })
    .addServer(configService.get('app.url')!)
    .addServer('http://localhost:3000')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management')
    .addTag('Products', 'Product management')
    .addTag('Categories', 'Product categories')
    .addTag('Clients', 'Client management')
    .addTag('Sales', 'Sales transactions and payments')
    .addTag('Expenses', 'Business expenses tracking')
    .addTag('Receipts', 'Receipt generation and management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  });
}
