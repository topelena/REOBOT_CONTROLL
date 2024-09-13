import { IPosition } from './position.interface';

export interface INavigateDto {
  roomSize: number[];
  startPosition: IPosition;
  commands: string;
}
