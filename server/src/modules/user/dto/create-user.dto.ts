import { UserRole } from '@prisma/client';
import { Equals, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AllowNullable } from 'src/core/validation/allow-null.validation';

export class CreateUserDTO {
  @IsString()
  first_name?: string;

  @IsString()
  last_name?: string;

  @IsString()
  middle_name?: string;

  @IsString()
  @AllowNullable()
  username?: string | null;

  @IsString()
  @AllowNullable()
  password?: string | null;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @AllowNullable()
  car_id: string;

  @IsString()
  @AllowNullable()
  spot_id: string;
}
