import { Body, Controller, Post } from '@nestjs/common';
import { RobotService } from './robot.service';
import { NavigateDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('robot') 
@Controller('robot')
export class RobotController {
  constructor(private readonly robotService: RobotService) {}

  @Post('navigate')
  @ApiOperation({ summary: 'Navigate the robot through the grid' })
  @ApiResponse({
    status: 200,
    description: 'The final position and orientation of the robot.',
    schema: {
      example: {
        report: '1 3 N',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or robot out of bounds',
  })
  //@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  navigate(@Body() navigateDto: NavigateDto): string {
    return this.robotService.navigate(navigateDto);
  }
}
