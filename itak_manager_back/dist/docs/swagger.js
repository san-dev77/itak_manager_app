"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
function setupSwagger(app) {
    const configService = app.get(config_1.ConfigService);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('ITAK Manager')
        .setDescription('API ITAK Manager')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT access token',
    })
        .addServer(configService.get('app.url'))
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
        },
    });
}
//# sourceMappingURL=swagger.js.map