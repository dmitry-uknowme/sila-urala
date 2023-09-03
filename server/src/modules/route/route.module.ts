import { Module } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';
import { UserModule } from '../user/user.module';
import { SpotModule } from '../spot/spot.module';
import { CarModule } from '../car/car.module';
import { PushNotificationModule } from '../push-notification/push-notification.module';

@Module({
  imports: [UserModule, SpotModule, CarModule, PushNotificationModule],
  controllers: [RouteController],
  providers: [RouteService, PrismaService],
  exports: [RouteService],
})
export class RouteModule {}
