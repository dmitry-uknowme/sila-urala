import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import * as webPush from 'web-push';

@Injectable()
export class PushNotificationService {
  constructor(private prisma: PrismaService) {
    this.init();
  }

  async init() {
    const vapidKeys = {
      publicKey:
        'BLAXPY1VOrG3t5Aaaw4m5YopEwKoEifizU18J36UxuF_udVbGcVA7N76_mk0R6YgF42Oy2FfGanznZzD4bfvHuU',
      privateKey: '2FTz6oG05lq6n1Gtki3_byIdcVvolcTNPamVXvLYCP0',
    };
    webPush.setVapidDetails(
      'mailto:admin@sila-urala.site',
      vapidKeys.publicKey,
      vapidKeys.privateKey,
    );
  }

  async createSub(userId: string, data: Prisma.PushNotificationSubCreateInput) {
    const sub = await this.prisma.pushNotificationSub.create({
      data: {
        endpoint: data.endpoint,
        exp_time: data.exp_time,
        auth_token: data.auth_token,
        public_key: data.public_key,
        user: { connect: { id: userId } },
      },
    });
    return sub;
  }

  async findAll(filter?: Prisma.PushNotificationSubWhereInput) {
    const subs = await this.prisma.pushNotificationSub.findMany({
      where: filter,
    });
    return subs;
  }

  async getSub(filter?: Prisma.PushNotificationSubWhereInput) {
    const subs = await this.prisma.pushNotificationSub.findFirst({
      where: filter,
      orderBy: { created_at: 'asc' },
    });
    return subs;
  }

  async removeSub(id: string) {
    const sub = await this.prisma.pushNotificationSub.delete({
      where: { id },
    });
    return sub;
  }

  async send(
    userId: string,
    data: {
      title?: string;
      body?: string;
    },
  ) {
    const notificationSub = await this.prisma.pushNotificationSub.findFirst({
      where: { user: { id: userId } },
    });

    if (!notificationSub) return;

    const notification = await this.prisma.pushNotification.create({
      data: { ...data, sub: { connect: { id: notificationSub.id } } },
    });

    try {
      const result = await webPush.sendNotification(
        {
          endpoint: notificationSub.endpoint,
          keys: {
            auth: notificationSub.auth_token,
            p256dh: notificationSub.public_key,
          },
        },
        JSON.stringify({ title: notification.title, body: notification.body }),
      );

      console.log('rreee', result);
    } catch (error) {
      await this.removeSub(notificationSub.id);
      // console.log('errr', error);
    }
  }

  //   acceptPushNotification = async (
  //     user: any,
  //     notification_dto: NotificationDto,
  //   ): Promise<NotificationToken> => {};

  //   disablePushNotification = async (
  //     user: any,
  //     update_dto: UpdateNotificationDto,
  //   ): Promise<void> => {};

  //   getNotifications = async (): Promise<any> => {};

  //   sendPush = async (
  //     user: any,
  //     title: string,
  //     body: string,
  //   ): Promise<void> => {};
}
