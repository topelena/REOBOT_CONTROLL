import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RobotModule } from './robot/robot.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor, ErrorsInterceptor } from './interceptors';

@Module({
  imports: [RobotModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
  ],
})
export class AppModule {}
