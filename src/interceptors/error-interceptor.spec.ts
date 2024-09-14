import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable, throwError } from 'rxjs';

import { ErrorsInterceptor } from './error-interceptor';

const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));

const mockMethod = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockBody = jest.fn().mockImplementation(() => ({
  body: mockJson,
}));
const mockGetRequest = jest.fn().mockImplementation(() => ({
  url: 'url',
  method: mockMethod,
  body: mockBody,
  headers: {},
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: mockGetRequest,
}));

const mockCallHandler = {
  handle: jest.fn(() =>
    throwError(new HttpException('Http exception', HttpStatus.BAD_REQUEST)),
  ),
};
const mockGetClass = jest.fn().mockImplementation(() => ({
  name: 'ProcessController',
}));

const mockExecutionContext = {
  switchToHttp: mockHttpArgumentsHost,
  getClass: mockGetClass,
  getHandler: jest.fn(),
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('ErrorsInterceptor', () => {
  let service: ErrorsInterceptor;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorsInterceptor],
    }).compile();
    service = module.get<ErrorsInterceptor>(ErrorsInterceptor);
  });

  describe('ErrorsInterceptor tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
    it('Error exception', async () => {
      await service.intercept(mockExecutionContext, mockCallHandler);
      expect(mockCallHandler.handle).toBeCalled();
    });
    it('Http logging with error', (done) => {
      const mockCallHandler = {
        handle: jest.fn(() => throwError(new Error('Not found'))),
      };
      const result: Observable<any> = service.intercept(
        mockExecutionContext,
        mockCallHandler,
      );
      result.subscribe({
        next: (value: any) => {
          value;
        },
        error: (error: any) => {
          expect(error).toBeInstanceOf(HttpException);
          done();
        },
        complete: () => {
          expect(mockGetClass).toBeCalled();
          done();
        },
      });
    });
    it('Http logging with error', (done) => {
      const mockCallHandler = {
        handle: jest.fn(() =>
          throwError(
            new HttpException(
              {
                message: 'Some Exception Error',
                status: 404,
                error: 'Failed to call provider',
              },
              404,
              {
                cause: new Error(),
              },
            ),
          ),
        ),
      };
      const result: Observable<any> = service.intercept(
        mockExecutionContext,
        mockCallHandler,
      );
      result.subscribe({
        next: (value: any) => {
          value;
        },
        error: (error: any) => {
          expect(error.message).toBe('Some Exception Error');
          expect(error).toBeInstanceOf(HttpException);
          done();
        },
        complete: () => {
          expect(mockGetClass).toBeCalled();
          done();
        },
      });
    });
  });
});
