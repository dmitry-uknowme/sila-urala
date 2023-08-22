import { Injectable } from '@nestjs/common';
import { Prisma, Route, RouteStatus, UserRole } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PushNotificationService } from '../push-notification/push-notification.service';
import { UserService } from '../user/user.service';

@Injectable()
export class RouteService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private pushNotificationService: PushNotificationService,
  ) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RouteWhereUniqueInput;
    where?: Prisma.RouteWhereInput;
    orderBy?: Prisma.RouteOrderByWithRelationInput;
  }): Promise<Route[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.route.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy: orderBy ?? { start_date: 'desc' },
      include: { car: true, end_spot: true },
    });
  }

  async findOne(filter: Prisma.RouteWhereUniqueInput): Promise<Route> {
    const user = await this.prisma.route.findFirst({
      where: filter,
      include: { car: true, end_spot: true },
    });
    return user;
  }

  async create(data: Prisma.RouteCreateInput): Promise<Route> {
    const route = await this.prisma.route.create({ data });
    if (data.status === RouteStatus.STATUS_ACTIVE) {
      const driver = await this.userService.findOne({
        car: { id: route.car_id },
      });

      const notificationSub = await this.pushNotificationService.getSub({
        user_id: driver.id,
      });

      const notification = await this.pushNotificationService.send(driver.id, {
        title: `Добавлен активный рейс №${route.id}`,
        body: `Добавлен активный рейс №${route.id}`,
        sub: { connect: { id: notificationSub.id } },
      });
    }
    return route;
  }

  async update(routeId: string, data: Prisma.RouteUpdateInput): Promise<Route> {
    const route = await this.prisma.route.update({
      where: { id: routeId },
      data,
    });
    if (data.status === RouteStatus.STATUS_ACTIVE) {
      const driver = await this.userService.findOne({
        car: { id: route.car_id },
      });
      const notificationSub = await this.pushNotificationService.getSub({
        user_id: driver.id,
      });
      if (notificationSub) {
        const notification = await this.pushNotificationService.send(
          driver.id,
          {
            title: `Добавлен активный рейс №${route.id}`,
            body: `Добавлен активный рейс №${route.id}`,
            sub: { connect: { id: notificationSub.id } },
          },
        );
      }
    }

    return route;
  }

  async driverStart(routeId: string): Promise<Route> {
    const route = await this.prisma.route.update({
      where: { id: routeId },
      data: { status: RouteStatus.STATUS_STARTED },
    });

    const driverId = route.car_id;

    const admin = await this.userService.findOne({
      role: UserRole.ROLE_ADMIN,
    });
    const notificationSub = await this.pushNotificationService.getSub({
      user_id: admin.id,
    });

    if (notificationSub) {
      const notification = await this.pushNotificationService.send(admin.id, {
        title: `Пользователь vodila начал рейс №${route.id}`,
        body: `Пользователь vodila начал рейс №${route.id}`,
        sub: { connect: { id: notificationSub.id } },
      });
    }
    return route;
  }

  async driverComplete(routeId: string): Promise<Route> {
    const route = await this.prisma.route.update({
      where: { id: routeId },
      data: { status: RouteStatus.STATUS_COMPLETED },
    });
    const admin = await this.userService.findOne({ role: UserRole.ROLE_ADMIN });
    const notificationSub = await this.pushNotificationService.getSub({
      user_id: admin.id,
    });

    const notification = await this.pushNotificationService.send(admin.id, {
      title: `Пользователь vodila завершил рейс №${route.id}`,
      body: `Пользователь vodila завершил рейс №${route.id}`,
      sub: { connect: { id: notificationSub.id } },
    });

    console.log('notificat', notification);
    return route;
  }

  async remove(carId: string): Promise<Route> {
    const car = await this.prisma.route.delete({ where: { id: carId } });
    return car;
  }

  async handleActiveRoutes() {
    const routes = await this.prisma.route.updateMany({
      where: {
        AND: {
          start_date: { lte: new Date() },
          status: { equals: RouteStatus.STATUS_ACTIVE },
        },
      },
      data: {
        status: RouteStatus.STATUS_WAITING,
      },
    });
    return routes;
  }
}
