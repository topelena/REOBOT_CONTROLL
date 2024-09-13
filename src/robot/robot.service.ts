import { Injectable } from '@nestjs/common';
import { NavigateDto, Position } from './dto';
import { Orientation } from './enums';

@Injectable()
export class RobotService {
  // Left and Right turn maps
  private readonly leftTurnMap = {
    [Orientation.N]: Orientation.W,
    [Orientation.W]: Orientation.S,
    [Orientation.S]: Orientation.E,
    [Orientation.E]: Orientation.N,
  };

  private readonly rightTurnMap = {
    [Orientation.N]: Orientation.E,
    [Orientation.E]: Orientation.S,
    [Orientation.S]: Orientation.W,
    [Orientation.W]: Orientation.N,
  };

  /**
   * Navigate the robot based on room size, start position, and commands.
   * @param navigateDto Input data with room size, start position, and commands
   */
  navigate(navigateDto: NavigateDto): string {
    const { roomSize, startPosition, commands } = navigateDto;
    let { x, y, orientation } = startPosition;

    this.validateInput(roomSize, startPosition, commands);

    // Process each command
    for (const command of commands) {
      if (command === 'L') {
        orientation = this.turnLeft(orientation);
      } else if (command === 'R') {
        orientation = this.turnRight(orientation);
      } else if (command === 'F') {
        ({ x, y } = this.moveForward(x, y, orientation));
      }

      // Check if the robot is out of bounds after each move
      if (this.isOutOfBounds(x, y, roomSize)) {
        throw new Error(`Out of bounds at ${x} ${y}`);
      }
    }

    return `Report: ${x} ${y} ${orientation}`;
  }

  /**
   * Rotate the robot to the left (counter-clockwise) using leftTurnMap.
   * @param currentOrientation Current orientation
   */
  private turnLeft(currentOrientation: Orientation): Orientation {
    return this.leftTurnMap[currentOrientation];
  }

  /**
   * Rotate the robot to the right (clockwise) using rightTurnMap.
   * @param currentOrientation Current orientation
   */
  private turnRight(currentOrientation: Orientation): Orientation {
    return this.rightTurnMap[currentOrientation];
  }

  /**
   * Move the robot forward based on its current orientation using switch-case.
   * @param x Current x position
   * @param y Current y position
   * @param orientation Current orientation
   */
  private moveForward(x: number, y: number, orientation: Orientation): Position {
    switch (orientation) {
      case Orientation.N:  // Moving North
        y += 1;
        break;
      case Orientation.E:  // Moving East
        x += 1;
        break;
      case Orientation.S:  // Moving South
        y -= 1;
        break;
      case Orientation.W:  // Moving West
        x -= 1;
        break;
      default:
        throw new Error('Invalid orientation');
    }

    return { x, y, orientation };
  }

  /**
   * Check if the robot is outside the room boundaries.
   * @param x Current x position
   * @param y Current y position
   * @param roomSize Array representing the width and height of the room
   */
  private isOutOfBounds(x: number, y: number, roomSize: number[]): boolean {
    const [roomWidth, roomDepth] = roomSize;
    return x < 0 || y < 0 || x >= roomWidth || y >= roomDepth;
  }

  /**
   * Validate the input parameters for room size, start position, and commands.
   * Throws an error if validation fails.
   * @param roomSize Array representing the width and depth of the room
   * @param startPosition Starting position and orientation of the robot
   * @param commands Commands string (only L, R, F are valid)
   */
  private validateInput(roomSize: number[], startPosition: Position, commands: string): void {
    const [roomWidth, roomDepth] = roomSize;

    // Validate room size
    if (roomWidth <= 0 || roomDepth <= 0) {
      throw new Error('Invalid room size. Width and depth must be positive numbers.');
    }

    // Validate start position
    const { x, y, orientation } = startPosition;
    if (x < 0 || y < 0 || x >= roomWidth || y >= roomDepth) {
      throw new Error('Invalid start position. Robot is out of bounds.');
    }

    if (!Object.values(Orientation).includes(orientation)) {
      throw new Error('Invalid orientation. Use N, E, S, or W.');
    }

    // Validate commands
    if (!/^[LFR]+$/.test(commands)) {
      throw new Error('Invalid commands. Only L, R, and F are allowed.');
    }
  }
}