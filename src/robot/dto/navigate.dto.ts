import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsArray,
  ArrayMinSize,
  Matches,
  Min,
} from 'class-validator';
import { Position } from './position.dto';
import { INavigateDto } from '../interfaces';

export class NavigateDto implements INavigateDto {
  @ApiProperty({
    description: 'Room size represented as width and depth',
    example: [5, 5],
  })
  @IsArray()
  @ArrayMinSize(2)
  @IsNumber(
    {},
    { each: true, message: 'Room size must be an array of two numbers' },
  )
  @Min(1, {
    each: true,
    message: 'Room dimensions must be greater than or equal to 1',
  })
  roomSize: [number, number];

  @ApiProperty({
    description: 'Initial position and orientation of the robot',
  })
  startPosition: Position;

  @ApiProperty({
    description: 'Commands to control the robot (L, R, F)',
    example: 'LFFRFRFRFF',
  })
  @IsString()
  @Matches(/^[LFR]+$/, { message: 'Commands must only contain L, F, or R' })
  commands: string;
}
