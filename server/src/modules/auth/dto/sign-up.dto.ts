import { UserRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
