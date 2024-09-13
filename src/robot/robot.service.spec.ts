import { Test, TestingModule } from '@nestjs/testing';
import { RobotService } from './robot.service';
import { NavigateDto } from './dto';
import { Orientation } from './enums';

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
      // Arrange
      const navigateDto: NavigateDto = {
        roomSize: [5, 5],
        startPosition: { x: 1, y: 2, orientation: Orientation.N },
        commands: 'F',
      };
      const expectedResult = 'Report: 1 3 N';

      // Act
      const result = robotService.navigate(navigateDto);

      // Assert
      expect(result).toBe(expectedResult);
    });

    it('should throw an error if the robot goes out of bounds', () => {
      // Arrange
      const navigateDto: NavigateDto = {
        roomSize: [5, 5],
        startPosition: { x: 0, y: 0, orientation: Orientation.W },
        commands: 'F',
      };

      // Act & Assert
      expect(() => robotService.navigate(navigateDto)).toThrowError(
        new Error('Out of bounds at -1 0'),
      );
    });

    it('should throw an error for invalid commands', () => {
      // Arrange
      const navigateDto: NavigateDto = {
        roomSize: [5, 5],
        startPosition: { x: 1, y: 1, orientation: Orientation.N },
        commands: 'INVALID',
      };

      // Act & Assert
      expect(() => robotService.navigate(navigateDto)).toThrowError(
        'Invalid command',
      );
    });

    it('should correctly turn left and right during navigation', () => {
      // Arrange
      const navigateDto: NavigateDto = {
        roomSize: [5, 5],
        startPosition: { x: 1, y: 1, orientation: Orientation.N },
        commands: 'RFFLFF',
      };
      const expectedResult = 'Report: 3 3 N';

      // Act
      const result = robotService.navigate(navigateDto);

      // Assert
      expect(result).toBe(expectedResult);
    });
  });

  describe('turn', () => {
    it('should correctly turn left from North', () => {
      // Act
      const result = robotService['turn'](Orientation.N, 'L');

      // Assert
      expect(result).toBe(Orientation.W);
    });

    it('should correctly turn right from North', () => {
      // Act
      const result = robotService['turn'](Orientation.N, 'R');

      // Assert
      expect(result).toBe(Orientation.E);
    });
  });

  describe('processCommand', () => {
    it('should process the "L" command and turn the robot left', () => {
      // Arrange
      const x = 1,
        y = 1,
        orientation = Orientation.N;

      // Act
      const result = robotService['processCommand'](x, y, orientation, 'L');

      // Assert
      expect(result.orientation).toBe(Orientation.W);
    });

    it('should process the "R" command and turn the robot right', () => {
      // Arrange
      const x = 1,
        y = 1,
        orientation = Orientation.N;

      // Act
      const result = robotService['processCommand'](x, y, orientation, 'R');

      // Assert
      expect(result.orientation).toBe(Orientation.E);
    });

    it('should process the "F" command and move the robot forward', () => {
      // Arrange
      const x = 1,
        y = 1,
        orientation = Orientation.N;

      // Act
      const result = robotService['processCommand'](x, y, orientation, 'F');

      // Assert
      expect(result).toEqual({ x: 1, y: 2, orientation: Orientation.N });
    });

    it('should throw an error for an invalid command', () => {
      // Arrange
      const x = 1,
        y = 1,
        orientation = Orientation.N;

      // Act & Assert
      expect(() =>
        robotService['processCommand'](x, y, orientation, 'X'),
      ).toThrowError('Invalid command');
    });
  });

  describe('moveForward', () => {
    it('should move forward when facing North', () => {
      // Arrange
      const x = 1,
        y = 1,
        orientation = Orientation.N;

      // Act
      const result = robotService['moveForward'](x, y, orientation);

      // Assert
      expect(result).toEqual({ x: 1, y: 2, orientation: Orientation.N });
    });

    it('should move forward when facing East', () => {
      // Arrange
      const x = 1,
        y = 1,
        orientation = Orientation.E;

      // Act
      const result = robotService['moveForward'](x, y, orientation);

      // Assert
      expect(result).toEqual({ x: 2, y: 1, orientation: Orientation.E });
    });

    it('should move forward when facing South', () => {
      // Arrange
      const x = 1,
        y = 1,
        orientation = Orientation.S;

      // Act
      const result = robotService['moveForward'](x, y, orientation);

      // Assert
      expect(result).toEqual({ x: 1, y: 0, orientation: Orientation.S });
    });

    it('should move forward when facing West', () => {
      // Arrange
      const x = 1,
        y = 1,
        orientation = Orientation.W;

      // Act
      const result = robotService['moveForward'](x, y, orientation);

      // Assert
      expect(result).toEqual({ x: 0, y: 1, orientation: Orientation.W });
    });
  });

  describe('isOutOfBounds', () => {
    it('should return true when the robot is out of bounds', () => {
      // Arrange
      const x = -1,
        y = 0,
        roomSize = [5, 5];

      // Act
      const result = robotService['isOutOfBounds'](x, y, roomSize);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when the robot is within bounds', () => {
      // Arrange
      const x = 1,
        y = 1,
        roomSize = [5, 5];

      // Act
      const result = robotService['isOutOfBounds'](x, y, roomSize);

      // Assert
      expect(result).toBe(false);
    });
  });
});
