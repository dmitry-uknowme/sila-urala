import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  UsePipes,
  ValidationPipe,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { RouteService } from '../route/route.service';
import { CarService } from './car.service';
import { AddRouteDTO } from './dto/add-route.dto';
import { CreateCarDTO } from './dto/create-car.dto';

@Controller('api/cars')
export class CarController {
  constructor(
    private carService: CarService,
    private routeService: RouteService,
  ) {}

  @Get()
  getCars() {
    return this.carService.findAll({ take: 10 });
  }

  @Post()
  createCar(@Body() dto: CreateCarDTO) {
    return this.carService.create(dto);
  }

  @Put(':carId')
  updateCar(@Param('carId') carId: string, @Body() dto: CreateCarDTO) {
    return this.carService.update(carId, dto);
  }

  @Delete(':carId')
  removeCar(@Param('carId') carId: string) {
    return this.carService.remove(carId);
  }

  @Post(':carId/routes')
  addRouteToCar(@Param('carId') carId: string, @Body() dto: AddRouteDTO) {
    return this.carService.addRoute(carId, dto);
  }

  @Get(':carId/routes')
  getRoutesByCardId(@Param('carId') carId: string) {
    return this.routeService.findAll({ where: { car_id: carId } });
  }
}
