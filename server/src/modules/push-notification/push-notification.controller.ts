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

  @Post('users/:userId')
  async sendNotification(
    @Param('userId') userId: string,
    @Body() dto: Prisma.PushNotificationCreateInput,
  ) {
    this.pushNotificationService.send(userId, dto);
  }

  // @Post(':subId/send')
  // async sendNotification(@Param('notificationId') subId:string) {

  // }
  //   @Get()
  //   getSpots() {
  //     return this.spotService.findAll({ take: 10 });
  //   }

  //   @Post()
  //   createSpot(@Body() dto: CreateSpotDTO) {
  //     return this.spotService.create(dto);
  //   }

  //   @Put(':spotId')
  //   updateSpot(@Param('spotId') spotId: string, @Body() dto: UpdateSpotDTO) {
  //     return this.spotService.update(spotId, dto);
  //   }

  //   @Delete(':spotId')
  //   removeSpot(@Param('spotId') spotId: string) {
  //     return this.spotService.remove(spotId);
  //   }
}
