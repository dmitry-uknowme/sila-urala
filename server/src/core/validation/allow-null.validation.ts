import { ValidationOptions, ValidateIf } from 'class-validator';
export function AllowNullable(validationOptions?: ValidationOptions) {
  return ValidateIf((_object, value) => value !== null, validationOptions);
}