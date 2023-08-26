import { RouteStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AllowNullable } from 'src/core/validation/allow-null.validation';

export class AddRouteDTO {
  @IsNumber()
  @IsNotEmpty()
  add_capability: number;
  @IsNumber()
  @IsNotEmpty()
  add_tanks5_capability: number;
  @IsNumber()
  @IsNotEmpty()
  add_tanks13_capability: number;
  @IsNumber()
  @IsNotEmpty()
  add_tanks19_capability: number;
  @IsString()
  @IsNotEmpty()
  car_id: string;
  @IsString()
  @IsNotEmpty()
  end_spot_id: string;
  @IsString()
  @IsNotEmpty()
  start_date: string;

  @IsEnum(RouteStatus)
  @IsNotEmpty()
  status: RouteStatus;

  // @IsString()
  // car_id: string;

  // // @IsString()
  // // @AllowNullable()
  // // start_spot_text: string;

  // @IsString()
  // end_spot_id: string;

  // @IsEnum(RouteStatus)
  // @AllowNullable()
  // status: RouteStatus;
}
