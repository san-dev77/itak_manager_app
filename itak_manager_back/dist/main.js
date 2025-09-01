"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const app_config_1 = require("./config/app.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors(app_config_1.appConfig.cors);
    app.setGlobalPrefix('api');
    const port = app_config_1.appConfig.port;
    await app.listen(port);
    console.log(`🚀 ${app_config_1.appConfig.name} v${app_config_1.appConfig.version} démarré sur le port ${port}`);
    console.log(`🌍 Environnement: ${app_config_1.appConfig.environment}`);
    console.log(`📡 API disponible sur: http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map