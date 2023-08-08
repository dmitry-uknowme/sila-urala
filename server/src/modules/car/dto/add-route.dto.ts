import { RouteStatus } from '@prisma/client';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { AllowNullable } from 'src/core/validation/allow-null.validation';

export class AddRouteDTO {
  @IsString()
  car_id: string;

  // @IsString()
  // @AllowNullable()
  // start_spot_text: string;

  @IsString()
  end_spot_id: string;

  @IsEnum(RouteStatus)
  @AllowNullable()
  status: RouteStatus;
}
