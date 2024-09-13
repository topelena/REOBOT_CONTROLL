import { Injectable } from '@nestjs/common';
import { NavigateDto, Position } from './dto';
import { Orientation } from './enums';
import { NavigateValidationService } from './navigate-validation.service';

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

  navigate(navigateDto: NavigateDto): string {
    const { roomSize, startPosition, commands } = navigateDto;
    let { x, y, orientation } = startPosition;

    NavigateValidationService.validateInput(roomSize, startPosition, commands);

    ({ x, y, orientation } = this.processCommands(
      commands,
      x,
      y,
      orientation,
      roomSize,
    ));

    return `Report: ${x} ${y} ${orientation}`;
  }

  private processCommands(
    commands: string,
    x: number,
    y: number,
    orientation: Orientation,
    roomSize: number[],
  ): Position {
    for (const command of commands) {
      ({ x, y, orientation } = this.processCommand(x, y, orientation, command));

      if (this.isOutOfBounds(x, y, roomSize)) {
        throw new Error(`Out of bounds at ${x} ${y}`);
      }
    }

    return { x, y, orientation };
  }

  private processCommand(
    x: number,
    y: number,
    orientation: Orientation,
    command: string,
  ): Position {
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
        throw new Error('Invalid command');
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
        throw new Error('Invalid orientation');
    }

    return { x, y, orientation };
  }

  private isOutOfBounds(x: number, y: number, roomSize: number[]): boolean {
    const [roomWidth, roomDepth] = roomSize;
    return x < 0 || y < 0 || x >= roomWidth || y >= roomDepth;
  }
}
