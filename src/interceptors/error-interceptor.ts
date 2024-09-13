import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const req = context.switchToHttp().getRequest();

        return throwError(() => this.createException(req, err));
      }),
    );
  }
  private createException(req: any, err: any): HttpException {
    const statusCode = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      err.response?.message || err.message || 'Internal Server Error';

    return new HttpException(
      {
        statusCode,
        message,
      },
      statusCode,
    );
  }
}
