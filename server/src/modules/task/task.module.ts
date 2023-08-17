import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { RouteModule } from '../route/route.module';
import { RouteService } from '../route/route.service';
import { UserModule } from '../user/user.module';
import { TaskService } from './task.service';
import { PushNotificationModule } from '../push-notification/push-notification.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UserModule,
    PushNotificationModule,
    RouteModule,
  ],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
