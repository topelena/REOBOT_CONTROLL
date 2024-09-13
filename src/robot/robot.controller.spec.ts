import { Test, TestingModule } from '@nestjs/testing';
import { RobotController } from './robot.controller';
import { RobotService } from './robot.service';
import { NavigateDto } from './dto/navigate.dto';
import { Orientation } from './enums';

describe('RobotController', () => {
  let robotController: RobotController;
  let robotService: RobotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RobotController],
      providers: [
        {
          provide: RobotService,
          useValue: {
            navigate: jest.fn(),
          },
        },
      ],
    }).compile();

    robotController = module.get<RobotController>(RobotController);
    robotService = module.get<RobotService>(RobotService);
  });

  it('should be defined', () => {
    expect(robotController).toBeDefined();
  });

  describe('navigate', () => {
    it('should call robotService.navigate with the correct DTO', () => {
      const navigateDto: NavigateDto = {
        roomSize: [5, 5],
        startPosition: { x: 1, y: 2, orientation: Orientation.N },
        commands: 'LFFRFRFRFF',
      };

      robotController.navigate(navigateDto);

      expect(robotService.navigate).toHaveBeenCalledWith(navigateDto);
    });

    it('should return the result from robotService.navigate', () => {
      const navigateDto: NavigateDto = {
        roomSize: [5, 5],
        startPosition: { x: 1, y: 2, orientation: Orientation.N },
        commands: 'LFFRFRFRFF',
      };

      const mockResult = 'Report: 1 3 N';
      jest.spyOn(robotService, 'navigate').mockReturnValue(mockResult);

      const result = robotController.navigate(navigateDto);

      expect(result).toBe(mockResult);
    });

    it('should handle an out-of-bounds error from robotService', () => {
      const navigateDto: NavigateDto = {
        roomSize: [5, 5],
        startPosition: { x: 1, y: 2, orientation: Orientation.N },
        commands: 'FFFRFFFRFF',
      };

      const mockError = new Error('Out of bounds at 6 6');
      jest.spyOn(robotService, 'navigate').mockImplementation(() => {
        throw mockError;
      });

      expect(() => robotController.navigate(navigateDto)).toThrow(mockError);
    });
  });
});
