import { Module } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PushNotificationService } from '../push-notification/push-notification.service';
import { UserService } from '../user/user.service';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';
import { SpotService } from '../spot/spot.service';
import { CarService } from '../car/car.service';

@Module({
  controllers: [RouteController],
  providers: [
    RouteService,
    PrismaService,
    UserService,
    SpotService,
    CarService,
    PushNotificationService,
  ],
  exports: [RouteService],
})
export class RouteModule {}
