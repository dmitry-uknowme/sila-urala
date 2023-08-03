import { Module } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PushNotificationService } from './push-notification.service';
// import { SpotController } from './spot.controller';
// import { SpotService } from './spot.service';

@Module({
  //   controllers: [SpotController],
  providers: [PushNotificationService, PrismaService],
  exports: [PushNotificationService],
})
export class SpotModule {}
