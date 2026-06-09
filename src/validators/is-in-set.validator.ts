import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsInSet', async: false })
export class IsInSetConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const set = args.constraints[0] as Set<string>;

    if (typeof value !== 'string') return false;

    return set.has(value.toLowerCase());
  }

  defaultMessage(args: ValidationArguments) {
    return `Invalid ${args.property}: ${args.value}`;
  }
}

export function IsInSet(set: Set<string>, options?: ValidationOptions) {
  return Validate(IsInSetConstraint, [set], options);
}

import { Transform } from 'class-transformer';

export const Trim = () =>
  Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));

export const UniqueArray = () =>
  Transform(({ value }) =>
    Array.isArray(value) ? [...new Set(value)] : value,
  );
