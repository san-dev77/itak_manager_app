"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let LoggingInterceptor = class LoggingInterceptor {
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const { method, url } = req;
        const start = Date.now();
        const logger = new common_1.Logger();
        return next.handle().pipe((0, rxjs_1.tap)({
            next: () => {
                const ms = Date.now() - start;
                logger.log(JSON.stringify({
                    level: 'info',
                    msg: 'request_complete',
                    method,
                    url,
                    ms,
                }), 'request_complete');
            },
            error: (err) => {
                const ms = Date.now() - start;
                logger.error(JSON.stringify({
                    level: 'error',
                    msg: 'request_error',
                    method,
                    url,
                    ms,
                    error: { message: err?.message, stack: err?.stack },
                }), 'request_error');
            },
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map