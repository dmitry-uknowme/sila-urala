import { Injectable } from '@nestjs/common';
import { Prisma, Route, RouteStatus, UserRole } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PushNotificationService } from '../push-notification/push-notification.service';
import { UserService } from '../user/user.service';
import { SpotService } from '../spot/spot.service';
import { CarService } from '../car/car.service';
import formatDate from 'src/helpers/formatDate';

@Injectable()
export class RouteService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private spotService: SpotService,
    private carService: CarService,
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

      const seller = await this.userService.findOne({
        spot: { id: route.car_id },
      });

      await this.pushNotificationService.send(driver.id, {
        title: `Добавлен активный рейс №${route.id}. Дата начала: ${formatDate(
          route.start_date,
        )}`,
        body: `Добавлен активный рейс №${route.id}. Дата начала: ${formatDate(
          route.start_date,
        )}`,
      });

      await this.pushNotificationService.send(seller.id, {
        title: `Добавлен активный рейс №${route.id}. Дата начала: ${formatDate(
          route.start_date,
        )}`,
        body: `Добавлен активный рейс №${route.id}. Дата начала: ${formatDate(
          route.start_date,
        )}`,
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
      const seller = await this.userService.findOne({
        spot: { id: route.end_spot_id },
      });

      await this.pushNotificationService.send(driver.id, {
        title: `Добавлен активный рейс №${route.id}. Дата начала: ${formatDate(
          route.start_date,
        )}`,
        body: `Добавлен активный рейс №${route.id}. Дата начала: ${formatDate(
          route.start_date,
        )}`,
      });

      await this.pushNotificationService.send(seller.id, {
        title: `Добавлен активный рейс №${route.id}. Дата начала: ${formatDate(
          route.start_date,
        )}`,
        body: `Добавлен активный рейс №${route.id}. Дата начала: ${formatDate(
          route.start_date,
        )}`,
      });
    }

    return route;
  }

  async driverStart(routeId: string): Promise<Route> {
    const route = await this.findOne({ id: routeId });
    await this.update(routeId, { status: RouteStatus.STATUS_STARTED });

    const carId = route.car_id;
    const car = await this.carService.findOne({ id: carId });
    const driver = await this.userService.findOne({ car_id: car.id });

    const spotId = route.end_spot_id;
    const spot = await this.spotService.findOne({ id: spotId });
    const seller = await this.userService.findOne({ spot_id: spotId });

    const admin = await this.userService.findOne({
      role: UserRole.ROLE_ADMIN,
    });
    const adminNotificationSub = await this.pushNotificationService.getSub({
      user_id: admin.id,
    });
    if (adminNotificationSub) {
      const notification = await this.pushNotificationService.send(admin.id, {
        title: `Пользователь ${driver.username} начал рейс №${route.id}`,
        body: `Пользователь ${driver.username} №${route.id}`,
      });
    }

    const sellerNotificationSub = await this.pushNotificationService.getSub({
      user_id: admin.id,
    });
    if (sellerNotificationSub) {
      const notification = await this.pushNotificationService.send(seller.id, {
        title: `Пользователь ${driver.username} начал рейс №${route.id}`,
        body: `Пользователь ${driver.username} №${route.id}`,
      });
    }

    return route;
  }

  async driverComplete(routeId: string): Promise<Route> {
    const route = await this.findOne({ id: routeId });

    await this.update(routeId, { status: RouteStatus.STATUS_COMPLETED });

    const spotId = route.end_spot_id;
    const spot = await this.spotService.findOne({ id: spotId });

    const carId = route.car_id;
    const car = await this.carService.findOne({ id: carId });
    const driver = await this.userService.findOne({ car_id: car.id });

    const prevCapability = spot.capability;
    const addCapability = route.add_capability;

    await this.spotService.update(spotId, {
      capability: prevCapability + addCapability,
    });

    const admin = await this.userService.findOne({ role: UserRole.ROLE_ADMIN });
    const notificationSub = await this.pushNotificationService.getSub({
      user_id: admin.id,
    });

    const notification = await this.pushNotificationService.send(admin.id, {
      title: `Пользователь ${driver.username} завершил рейс №${route.id}`,
      body: `Пользователь ${driver.username} завершил рейс №${route.id}`,
    });

    return route;
  }

  async remove(carId: string): Promise<Route> {
    const car = await this.prisma.route.delete({ where: { id: carId } });
    return car;
  }

  async handleActiveRoutes() {
    const routes = await this.findAll({
      where: {
        AND: {
          start_date: { lte: new Date() },
          status: { equals: RouteStatus.STATUS_ACTIVE },
        },
      },
    });

    await this.prisma.route.updateMany({
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

    await Promise.all(
      routes.map(async (route) => {
        const car = await this.carService.findOne({ id: route.car_id });
        console.log('c', car);
        const user = await this.userService.findOne({ car_id: car.id });
        console.log('u', user);
        const pushNotificationSub = await this.pushNotificationService.getSub({
          user_id: user.id,
        });
        if (!pushNotificationSub) return;
        console.log('ps', pushNotificationSub);

        const notification = await this.pushNotificationService.send(user.id, {
          title: `Рейс №${route.id} ожидает принятия`,
          body: `Рейс №${route.id} ожидает принятия`,
        });
      }),
    );

    return routes;
  }
}
