import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Matches, Min } from 'class-validator';
import { Orientation } from '../enums';

export class Position {
  @ApiProperty({
    description: 'The x-coordinate of the robot',
    example: 1,
  })
  @IsNumber()
  @Min(0, { message: 'x-coordinate must be greater than or equal to 0' })
  x: number;

  @ApiProperty({
    description: 'The y-coordinate of the robot',
    example: 2,
  })
  @IsNumber()
  @Min(0, { message: 'y-coordinate must be greater than or equal to 0' })
  y: number;

  @ApiProperty({
    description: 'The orientation of the robot (N, E, S, W)',
    example: 'N',
  })
  @IsString()
  @Matches(/^[NESW]$/, { message: 'Orientation must be one of N, E, S, W' })
  orientation: Orientation;
}
