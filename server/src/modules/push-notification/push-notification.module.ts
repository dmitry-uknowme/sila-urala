import { Module } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PushNotificationController } from './push-notification.controller';
import { PushNotificationService } from './push-notification.service';

@Module({
  controllers: [PushNotificationController],
  providers: [PushNotificationService, PrismaService],
  exports: [PushNotificationService],
})
export class PushNotificationModule {}
