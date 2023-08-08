import { UserRole } from '@prisma/client';
import {
  Equals,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';
import { AllowNullable } from 'src/core/validation/allow-null.validation';

export class CreateSpotDTO {
  // @IsString()
  // @AllowNullable()
  // coordinates: string|null;

  @IsNotEmpty()
  @IsString()
  address_name: string;
}
