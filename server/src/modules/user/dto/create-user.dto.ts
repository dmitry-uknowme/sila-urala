import { UserRole } from '@prisma/client';
import {
  Equals,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AllowNullable } from 'src/core/validation/allow-null.validation';

export class CreateUserDTO {
  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsString()
  @IsOptional()
  middle_name?: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsOptional()
  car_id?: string;

  @IsString()
  @IsOptional()
  spot_id?: string;
}
