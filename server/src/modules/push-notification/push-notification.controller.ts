import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  UsePipes,
  ValidationPipe,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { Prisma, PushNotification } from '@prisma/client';
import { PushNotificationService } from './push-notification.service';

@Controller('api/push_notifications')
export class PushNotificationController {
  constructor(private pushNotificationService: PushNotificationService) {}

  @Post('users/:userId/subs')
  async createNotificationSub(
    @Param('userId') userId: string,
    @Body() dto: Prisma.PushNotificationSubCreateInput,
  ) {
    this.pushNotificationService.createSub(userId, dto);
  }

  @Put('subId')
  async updateNotificationSub(
    @Param('subId') subId: string,
    @Body() dto: Prisma.PushNotificationSubUpdateInput,
  ) {
    this.pushNotificationService.updateSub(subId, dto);
  }

  @Post('users/:userId')
  async sendNotification(
    @Param('userId') userId: string,
    @Body() dto: Prisma.PushNotificationCreateInput,
  ) {
    this.pushNotificationService.sendToUser(userId, dto);
  }

  @Post('subs/search')
  searchNotificationSub(@Body() filter: Prisma.PushNotificationSubWhereInput) {
    return this.pushNotificationService.findAllSubs(filter);
  }
}
