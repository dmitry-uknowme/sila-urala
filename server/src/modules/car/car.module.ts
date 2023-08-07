import { Module } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PushNotificationService } from '../push-notification/push-notification.service';
import { RouteService } from '../route/route.service';
import { SpotService } from '../spot/spot.service';
import { UserService } from '../user/user.service';
import { CarController } from './car.controller';
import { CarService } from './car.service';

@Module({
  controllers: [CarController],
  providers: [
    CarService,
    RouteService,
    SpotService,
    UserService,
    PrismaService,
    PushNotificationService,
  ],
  exports: [CarService],
})
export class CarModule {}
