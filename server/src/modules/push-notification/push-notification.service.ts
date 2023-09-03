import { Injectable } from '@nestjs/common';
import { Prisma, PushNotificationSubStatus } from '@prisma/client';
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
    const prevSubs = await this.findAllSubs({
      user_id: { not: userId },
      status: { not: PushNotificationSubStatus.STATUS_ARCHIVED },
    });

    console.log('prev subsss on device', prevSubs);

    await Promise.all(
      prevSubs.map(async (sub) =>
        this.updateSub(sub.id, {
          status: PushNotificationSubStatus.STATUS_ARCHIVED,
        }),
      ),
    );

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

  async updateSub(id: string, data: Prisma.PushNotificationSubUpdateInput) {
    const sub = await this.prisma.pushNotificationSub.update({
      where: { id },
      data,
    });
    return sub;
  }

  async findAllSubs(filter?: Prisma.PushNotificationSubWhereInput) {
    const subs = await this.prisma.pushNotificationSub.findMany({
      where: filter || {
        status: { not: PushNotificationSubStatus.STATUS_ARCHIVED },
      },
      orderBy: { created_at: 'asc' },
    });
    return subs;
  }

  async findOneSub(filter?: Prisma.PushNotificationSubWhereInput) {
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

  async sendToUser(
    userId: string,
    data: {
      title?: string;
      body?: string;
    },
  ) {
    const notificationSubs = await this.findAllSubs({
      user: { id: userId },
    });

    if (!notificationSubs.length) return;

    notificationSubs.map(async (sub) => {
      const notification = await this.prisma.pushNotification.create({
        data: { ...data, sub: { connect: { id: sub.id } } },
      });

      try {
        const result = await webPush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              auth: sub.auth_token,
              p256dh: sub.public_key,
            },
          },
          JSON.stringify({
            title: notification.title,
            body: notification.body,
          }),
        );

        console.log('rreee', result);
      } catch (error) {
        await this.updateSub(sub.id, {
          status: PushNotificationSubStatus.STATUS_ARCHIVED,
        });
      }
    });
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
