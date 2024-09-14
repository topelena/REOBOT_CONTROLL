import { ApiProperty } from '@nestjs/swagger';
import { Position } from './position.dto';
import { IReportDto } from '../interfaces';

export class ReportDto implements IReportDto {
  
  @ApiProperty({
    description: 'Initial position and orientation of the robot',
  })
  report: Position;
  
}