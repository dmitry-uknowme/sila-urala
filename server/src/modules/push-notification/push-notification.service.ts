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

    const pushSubscription = {
      endpoint:
        'https://fcm.googleapis.com/fcm/send/dqyXKxe70bw:APA91bGXBL-QZ0I39jMvd-GgFPVTJDC4OqMA2DZCuDrUak25YkuuDeFlveTXjjGPRMWNnrVGaQNeEBb2aoBYTUY1vTwvGhnvgBZhcTXBCPTxU1GKH1ouYl0IHsbMNk0rVloU3G5lOU2t',
      expirationTime: null,
      keys: {
        p256dh:
          'BFKcXRJc485SKRPiedWVCb_XJDIJKcdhqzB7hkY66lL4yUKhA-97Vlt9t1iyYOeJoFNJickr6GwYwB3-LGZlt00',
        auth: 'b-nEd_cJ4vaeVjidmbMTFA',
      },
    };

    const payload = { title: 'Title', body: 'Body' };
    // const payload = '< Push Payload String >';
    try {
      const result = await webPush.sendNotification(
        pushSubscription,
        JSON.stringify(payload),
        // options
      );

      console.log('rreee', result);
    } catch (error) {
      console.log('errr', error);
    }
  }

  async createSub(data: Prisma.PushNotificationSubCreateInput) {
    const sub = await this.prisma.pushNotificationSub.create({ data });
    return sub;
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
