import { ForbiddenException, Injectable } from '@nestjs/common';
import { NavigateDto, Position } from './dto';
import { Orientation } from './enums';
import { NavigateValidationService } from './navigate-validation.service';
import { IReportDto } from './interfaces';

@Injectable()
export class RobotService {
  private turn(orientation: Orientation, direction: 'L' | 'R'): Orientation {
    const turnMap = {
      L: {
        [Orientation.N]: Orientation.W,
        [Orientation.W]: Orientation.S,
        [Orientation.S]: Orientation.E,
        [Orientation.E]: Orientation.N,
      },
      R: {
        [Orientation.N]: Orientation.E,
        [Orientation.E]: Orientation.S,
        [Orientation.S]: Orientation.W,
        [Orientation.W]: Orientation.N,
      },
    };

    return turnMap[direction][orientation];
  }

  navigate(navigateDto: NavigateDto): IReportDto {
    const { roomSize, startPosition, commands } = navigateDto;
    let { x, y, orientation } = startPosition;

    NavigateValidationService.validateInput(roomSize, startPosition, commands);

    ({ x, y, orientation } = this.processCommands(
      commands,
      startPosition,
      roomSize,
    ));
  const report: IReportDto = {report: {x, y, orientation}}
    return report;
  }

  private processCommands(
    commands: string,
    startPosition: Position,
    roomSize: number[],
  ): Position {
    let { x, y, orientation } = startPosition;
 
    for (const command of commands) {
      ({ x, y, orientation } = this.processCommand({x, y, orientation}, command));

      if (this.isOutOfBounds(x, y, roomSize)) {
        throw new ForbiddenException(`Out of bounds at ${x} ${y}`);
      }
    }

    return { x, y, orientation };
  }

  private processCommand(
    startPosition: Position,
    command: string,
  ): Position {
    let { x, y, orientation } = startPosition;
    switch (command) {
      case 'L':
        orientation = this.turn(orientation, 'L');
        break;
      case 'R':
        orientation = this.turn(orientation, 'R');
        break;
      case 'F':
        ({ x, y } = this.moveForward(x, y, orientation));
        break;
      default:
        throw new ForbiddenException('Invalid command');
    }
    return { x, y, orientation };
  }

  private moveForward(
    x: number,
    y: number,
    orientation: Orientation,
  ): Position {
    switch (orientation) {
      case Orientation.N:
        y += 1;
        break;
      case Orientation.E:
        x += 1;
        break;
      case Orientation.S:
        y -= 1;
        break;
      case Orientation.W:
        x -= 1;
        break;
      default:
        throw new ForbiddenException('Invalid orientation');
    }

    return { x, y, orientation };
  }

  private isOutOfBounds(x: number, y: number, roomSize: number[]): boolean {
    const [roomWidth, roomDepth] = roomSize;
    return x < 0 || y < 0 || x >= roomWidth || y >= roomDepth;
  }
}
