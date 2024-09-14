import { Body, Controller, Post, Version, ValidationPipe, UsePipes, BadRequestException,} from '@nestjs/common';
import { RobotService } from './robot.service';
import { NavigateDto, ReportDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import {checkValidationErrors} from '../utils'
import { IReportDto } from './interfaces';

@ApiTags('API')
@Controller('robot')
@UsePipes(
  new ValidationPipe({
    exceptionFactory: (errors: ValidationError[]) => {
      const errorsMessages = checkValidationErrors(errors);
      return new BadRequestException(
       
        `Bad Request: ["${errorsMessages.join(
          '"|"',
        )}"].`,
      );
    },
  }),
)
export class RobotController {
  constructor(private readonly robotService: RobotService) {}
 
  @Version('1')
  @Post('navigate')
  @ApiOperation({ summary: 'Navigate the robot through the grid' })
  @ApiBody({
    description: 'Robot navigation API',
    type: NavigateDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The final position and orientation of the robot.',
    type: ReportDto,
    schema: {
      example: {
        report: {x:1, y:3,  orientation: "N"},
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or robot out of bounds',
  })
  navigate(@Body() navigateDto: NavigateDto): IReportDto {
    return this.robotService.navigate(navigateDto);
  }
}
