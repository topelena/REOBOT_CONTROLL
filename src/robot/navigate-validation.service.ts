import { BadRequestException } from '@nestjs/common';
import { Position } from './dto';
import { Orientation } from './enums';

export class NavigateValidationService {
  static validateInput(
    roomSize: number[],
    startPosition: Position,
    commands: string,
  ): void {
    this.validateRoomSize(roomSize);
    this.validateStartPosition(roomSize, startPosition);
    this.validateOrientation(startPosition.orientation);
    this.validateCommands(commands);
  }

  private static validateRoomSize(roomSize: number[]): void {
    if (!Array.isArray(roomSize) || roomSize.length !== 2) {
      throw new BadRequestException(
        'Room size must be an array with two elements.',
      );
    }

    const [roomWidth, roomDepth] = roomSize;

    if (roomWidth <= 0 || roomDepth <= 0) {
      throw new BadRequestException(
        'Invalid room size. Width and depth must be positive numbers.',
      );
    }
  }

  private static validateStartPosition(
    roomSize: number[],
    startPosition: Position,
  ): void {
    const { x, y } = startPosition;
    const [roomWidth, roomDepth] = roomSize;

    if (x < 0 || y < 0 || x >= roomWidth || y >= roomDepth) {
      throw new BadRequestException(
        'Invalid start position. Robot is out of bounds.',
      );
    }
  }

  private static validateOrientation(orientation: Orientation): void {
    if (!Object.values(Orientation).includes(orientation)) {
      throw new BadRequestException('Invalid orientation. Use N, E, S, or W.');
    }
  }

  private static validateCommands(commands: string): void {
    if (!/^[LFR]*$/.test(commands)) {
      throw new BadRequestException(
        'Invalid commands. Only L, R, and F are allowed.',
      );
    }
  }
}
