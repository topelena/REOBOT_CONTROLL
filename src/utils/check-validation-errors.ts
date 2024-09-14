import { ValidationError } from 'class-validator';

export const getConstraints = (error: ValidationError, prefix?: string) => {
  if (error.children.length) {
    const p = prefix ? `${prefix}.${error.property}` : `${error.property}`;
    return error.children.map((e) => getConstraints(e, p)).flat();
  }
  return prefix
    ? `${prefix}.${Object.values(error.constraints)}`
    : Object.values(error.constraints);
};

export const checkValidationErrors = (errors: ValidationError[]) => {
  if (errors.length > 0) {
    return errors.map((error) => getConstraints(error)).flat();
  }
};
