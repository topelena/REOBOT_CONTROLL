import { ErrorsInterceptor } from './error-interceptor';
import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { throwError } from 'rxjs';
import { Test, TestingModule } from '@nestjs/testing';
import { CallHandler } from '@nestjs/common/interfaces/features/nest-interceptor.interface';

describe('ErrorsInterceptor', () => {
  let interceptor: ErrorsInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorsInterceptor],
    }).compile();

    interceptor = module.get<ErrorsInterceptor>(ErrorsInterceptor);
  });

  it('should catch an error and return an HttpException', () => {
    const context = createMockExecutionContext();
    const next: CallHandler = {
      handle: () => throwError(() => new Error('Test Error')),
    };

    interceptor.intercept(context, next).subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(err.getResponse()).toEqual({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Test Error',
          path: '/test',
          timestamp: expect.any(String),
        });
      },
    });
  });

  it('should return original HttpException with the same status and message', () => {
    const context = createMockExecutionContext();
    const next: CallHandler = {
      handle: () =>
        throwError(
          () => new HttpException('Custom Error', HttpStatus.BAD_REQUEST),
        ),
    };

    interceptor.intercept(context, next).subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        expect(err.getResponse()).toEqual({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Custom Error',
          path: '/test',
          timestamp: expect.any(String),
        });
      },
    });
  });

  function createMockExecutionContext(): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          url: '/test',
        }),
      }),
    } as any;
  }
});
