import { Test, TestingModule } from '@nestjs/testing';
import { RobotService } from './robot.service';
import { NavigateDto } from './dto';
import { Orientation } from './enums';
import { IPosition, IReportDto } from './interfaces';

describe('RobotService', () => {
  let robotService: RobotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RobotService],
    }).compile();

    robotService = module.get<RobotService>(RobotService);
  });

  it('should be defined', () => {
    expect(robotService).toBeDefined();
  });

  describe('navigate', () => {
    it('should navigate and return the final position and orientation', () => {
      const navigateDto: NavigateDto = {
        roomSize: [5, 5],
        startPosition: { x: 1, y: 2, orientation: Orientation.N },
        commands: 'F',
      };
      const expectedResult: IReportDto = {report: {orientation: Orientation.N, x: 1, y: 3}};
      
      const result = robotService.navigate(navigateDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if the robot goes out of bounds', () => {
      const navigateDto: NavigateDto = {
        roomSize: [5, 5],
        startPosition: { x: 0, y: 0, orientation: Orientation.W },
        commands: 'F',
      };

      expect(() => robotService.navigate(navigateDto)).toThrowError(
        new Error('Out of bounds at -1 0'),
      );
    });

    it('should throw an error for invalid commands', () => {
      const navigateDto: NavigateDto = {
        roomSize: [5, 5],
        startPosition: { x: 1, y: 1, orientation: Orientation.N },
        commands: 'INVALID',
      };

      expect(() => robotService.navigate(navigateDto)).toThrowError(
        'Invalid command',
      );
    });

    it('should correctly turn left and right during navigation', () => {

      const navigateDto: NavigateDto = {
        roomSize: [5, 5],
        startPosition: { x: 1, y: 1, orientation: Orientation.N },
        commands: 'RFFLFF',
      };
      const expectedResult: IReportDto = {report: {orientation: Orientation.N, x: 3, y: 3}};

      const result = robotService.navigate(navigateDto);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('turn', () => {
    it('should correctly turn left from North', () => {
      const result = robotService['turn'](Orientation.N, 'L');

      expect(result).toBe(Orientation.W);
    });

    it('should correctly turn right from North', () => {
      const result = robotService['turn'](Orientation.N, 'R');

      expect(result).toBe(Orientation.E);
    });
  });

  describe('processCommand', () => {
    const startPosition: IPosition = {x:1, y:1, orientation:Orientation.N }
    it('should process the "L" command and turn the robot left', () => {
      const result = robotService['processCommand'](startPosition, 'L');

      expect(result.orientation).toBe(Orientation.W);
    });

    it('should process the "R" command and turn the robot right', () => {
      const result = robotService['processCommand'](startPosition, 'R');

      expect(result.orientation).toBe(Orientation.E);
    });

    it('should process the "F" command and move the robot forward', () => {
      const result = robotService['processCommand'](startPosition, 'F');

      expect(result).toEqual({ x: 1, y: 2, orientation: Orientation.N });
    });

    it('should throw an error for an invalid command', () => {

      expect(() =>
        robotService['processCommand'](startPosition, 'X'),
      ).toThrowError('Invalid command');
    });
  });

  describe('moveForward', () => {
    it('should move forward when facing North', () => {
      
      const result = robotService['moveForward'](1, 1, Orientation.N );

      expect(result).toEqual({ x: 1, y: 2, orientation: Orientation.N });
    });

    it('should move forward when facing East', () => {
      const result = robotService['moveForward'](1, 1, Orientation.E);

      expect(result).toEqual({ x: 2, y: 1, orientation: Orientation.E });
    });

    it('should move forward when facing South', () => {
     const result = robotService['moveForward'](1, 1, Orientation.S);

      expect(result).toEqual({ x: 1, y: 0, orientation: Orientation.S });
    });

    it('should move forward when facing West', () => {
      const result = robotService['moveForward'](1, 1, Orientation.W);

      expect(result).toEqual({ x: 0, y: 1, orientation: Orientation.W });
    });
  });

  describe('isOutOfBounds', () => {
    it('should return true when the robot is out of bounds', () => {
      const x = -1,
        y = 0,
        roomSize = [5, 5];

      const result = robotService['isOutOfBounds'](x, y, roomSize);

      expect(result).toBe(true);
    });

    it('should return false when the robot is within bounds', () => {
    
      const x = 1,
        y = 1,
        roomSize = [5, 5];

      const result = robotService['isOutOfBounds'](x, y, roomSize);

      expect(result).toBe(false);
    });
  });
});
