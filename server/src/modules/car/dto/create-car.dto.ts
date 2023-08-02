import { UserRole } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class CreateCarDTO {
  @IsString()
  number_plate: string;

  @IsNumber()
  capability: number;
}
