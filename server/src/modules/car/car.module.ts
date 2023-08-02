import { Module } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { RouteService } from '../route/route.service';
import { SpotService } from '../spot/spot.service';
import { CarController } from './car.controller';
import { CarService } from './car.service';

@Module({
  controllers: [CarController],
  providers: [CarService, RouteService, SpotService, PrismaService],
  exports: [CarService],
})
export class CarModule {}
