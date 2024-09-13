import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const method = req.method;
    const url = req.url;
    const now = Date.now();

    console.log(`${method} START  ${url} ${context.getClass().name}`);
    if (req.body) {
      console.log(JSON.stringify(req.body?.message || req.body));
    }
    return next.handle().pipe(
      tap({
        next: () => {
          if (req.url !== '/health') {
            console.log(
              `${method} ${res.statusCode} FINISH  ${url} ${Date.now() - now}ms ${context.getClass().name}`,
            );
          }
        },
        error: (error) => {
          const status =
            error instanceof HttpException ? error.getStatus() : 500;
          console.log(
            `${method} ${status} FINISH  ${url} ${context.getClass().name}`,
            JSON.stringify(error.message),
          );
        },
      }),
    );
  }
}
