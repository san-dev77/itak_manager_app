import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const start = Date.now();
    const logger = new Logger();

    return next.handle().pipe(
      tap({
        next: () => {
          const ms = Date.now() - start;
          // Structured log

          logger.log(
            JSON.stringify({
              level: 'info',
              msg: 'request_complete',
              method,
              url,
              ms,
            }),
            'request_complete',
          );
        },
        error: (err) => {
          const ms = Date.now() - start;

          logger.error(
            JSON.stringify({
              level: 'error',
              msg: 'request_error',
              method,
              url,
              ms,
              error: { message: err?.message, stack: err?.stack },
            }),
            'request_error',
          );
        },
      }),
    );
  }
}
