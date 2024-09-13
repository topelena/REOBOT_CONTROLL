import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RobotModule } from './robot/robot.module';

@Module({
  imports: [RobotModule],
  controllers: [AppController],
})
export class AppModule {}
