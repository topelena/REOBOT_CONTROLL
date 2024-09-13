import { NavigateValidationService } from './navigate-validation.service';
import { Orientation } from './enums';

describe('NavigateValidationService', () => {
  describe('validateInput', () => {
    it('should throw an error for an invalid room size', () => {
      expect(() =>
        NavigateValidationService.validateInput(
          [0, 5],
          { x: 1, y: 1, orientation: Orientation.N },
          'FF',
        ),
      ).toThrow('Invalid room size. Width and depth must be positive numbers.');
    });

    it('should throw an error for an invalid start position', () => {
      expect(() =>
        NavigateValidationService.validateInput(
          [5, 5],
          { x: 6, y: 1, orientation: Orientation.N },
          'FF',
        ),
      ).toThrow('Invalid start position. Robot is out of bounds.');
    });

    it('should throw an error for an invalid orientation', () => {
      expect(() =>
        NavigateValidationService.validateInput(
          [5, 5],
          { x: 1, y: 1, orientation: 'X' as Orientation },
          'FF',
        ),
      ).toThrow('Invalid orientation. Use N, E, S, or W.');
    });

    it('should throw an error for invalid commands', () => {
      expect(() =>
        NavigateValidationService.validateInput(
          [5, 5],
          { x: 1, y: 1, orientation: Orientation.N },
          'FXT',
        ),
      ).toThrow('Invalid commands. Only L, R, and F are allowed.');
    });

    it('should not throw an error for valid input', () => {
      expect(() =>
        NavigateValidationService.validateInput(
          [5, 5],
          { x: 1, y: 1, orientation: Orientation.N },
          'FF',
        ),
      ).not.toThrow();
    });
  });
});
