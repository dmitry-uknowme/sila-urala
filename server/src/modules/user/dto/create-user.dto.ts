import { UserRole } from '@prisma/client';
import { Equals, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AllowNullable } from 'src/core/validation/allow-null.validation';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsString()
  middle_name: string;

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
