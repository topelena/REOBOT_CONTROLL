import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggingInterceptor } from './logging-interceptor';
import { throwError, Observable, of } from 'rxjs';

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
describe('LogingInterceptor service', () => {
  let service: LoggingInterceptor;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggingInterceptor],
    }).compile();
    service = module.get<LoggingInterceptor>(LoggingInterceptor);
  });

  describe('LoggingInterceptor tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('Http logging with Errorexeption', () => {
      service.intercept(mockExecutionContext, mockCallHandler);
      expect(mockGetClass).toBeCalled();
      expect(mockGetRequest).toBeCalledWith();
      expect(mockHttpArgumentsHost).toBeCalled();
    });

    it('Http logging with Errorexeption', () => {
      const mockCallHandler = {
        handle: jest.fn(() => throwError(new Error('Not found'))),
      };
      service.intercept(mockExecutionContext, mockCallHandler);
      expect(mockGetClass).toBeCalled();
      expect(mockGetRequest).toBeCalledWith();
      expect(mockHttpArgumentsHost).toBeCalled();
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
        next: (value) => {
          value;
        },
        error: (error) => {
          expect(error.message).toBe('Not found');
          expect(mockGetRequest).toBeCalled();
          expect(mockGetResponse).toBeCalled();
          done();
        },
        complete: () => {
          expect(mockGetClass).toBeCalled();
          done();
        },
      });
    });

    it('Http logging with suсcess', (done) => {
      const mockCallHandler = {
        handle: jest.fn(() => of({ statusCode: 200 })),
      };
      const result: Observable<any> = service.intercept(
        mockExecutionContext,
        mockCallHandler,
      );
      result.subscribe({
        next: (value) => {
          expect(mockGetClass).toBeCalled();
          expect(mockGetResponse).toBeCalled();
          expect(value.statusCode).toBe(200);
          expect(mockExecutionContext.getClass().name).toBe(
            'ProcessController',
          );
        },
        error: (error) => {
          throw error;
        },
        complete: () => {
          expect(mockGetClass).toBeCalled();
          done();
        },
      });
    });
  });
  describe('logging with cashe url and empty body', () => {
    const mockMethod = jest.fn().mockImplementation(() => ({
      json: mockJson,
    }));
    const mockGetClass = jest.fn().mockImplementation(() => ({
      json: mockJson,
    }));
    const mockGetRequest = jest.fn().mockImplementation(() => ({
      url: 'cache',
      method: mockMethod,
      body: null,
    }));

    const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
      getResponse: mockGetResponse,
      getRequest: mockGetRequest,
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
    const mockCallHandler = {
      handle: jest.fn(() => of({ statusCode: 200 })),
    };
    const log = jest.spyOn(console, 'log').mockImplementation();

    afterAll(() => {
      log.mockReset();
    });

    it('logs with empty body', () => {
      service.intercept(mockExecutionContext, mockCallHandler);

      expect(mockGetRequest().body).toBe(null);
      expect(mockGetRequest().url).toBe('cache');
      expect(log).toBeCalledTimes(1);
    });
  });
  describe('logging with body', () => {
    const mockMethod = jest.fn().mockImplementation(() => ({
      json: mockJson,
    }));
    const mockGetClass = jest.fn().mockImplementation(() => ({
      json: mockJson,
    }));
    const mockGetRequest = jest.fn().mockImplementation(() => ({
      url: 'url',
      method: mockMethod,
      body: { message: 'test' },
    }));

    const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
      getResponse: mockGetResponse,
      getRequest: mockGetRequest,
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
    const mockCallHandler = {
      handle: jest.fn(() => of({ statusCode: 200 })),
    };
    const log = jest.spyOn(console, 'log').mockImplementation();

    afterAll(() => {
      log.mockReset();
    });

    it('logs with body', () => {
      service.intercept(mockExecutionContext, mockCallHandler);

      expect(mockGetRequest().body).toEqual({ message: 'test' });
      expect(mockGetRequest().url).toBe('url');
      expect(log).toBeCalledTimes(2);
    });
  });
});
