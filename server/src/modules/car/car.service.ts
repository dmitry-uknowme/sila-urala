import { Injectable } from '@nestjs/common';
import { Prisma, Car, Route, RouteStatus } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PushNotificationService } from '../push-notification/push-notification.service';
import { UserService } from '../user/user.service';
import { AddRouteDTO } from './dto/add-route.dto';

@Injectable()
export class CarService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private pushNotificationService: PushNotificationService,
  ) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CarWhereUniqueInput;
    where?: Prisma.CarWhereInput;
    orderBy?: Prisma.CarOrderByWithRelationInput;
  }): Promise<Car[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.car.findMany({
      skip,
      take,
      cursor,
      //@ts-expect-error
      where: where.user_id && { users: { every: { id: where.user_id } } },
      orderBy,
    });
  }

  async findOne(id: string): Promise<Car> {
    const car = await this.prisma.car.findUnique({ where: { id } });
    return car;
  }

  async create(data: Prisma.CarCreateInput): Promise<Car> {
    const car = await this.prisma.car.create({ data });
    return car;
  }

  async update(carId: string, data: Prisma.CarUpdateInput): Promise<Car> {
    const car = await this.prisma.car.update({ where: { id: carId }, data });
    return car;
  }

  async remove(carId: string): Promise<Car> {
    const car = await this.prisma.car.delete({ where: { id: carId } });
    return car;
  }

  async addRoute(carId: string, data: AddRouteDTO): Promise<Car> {
    const routeObj = {
      // start_spot_text: data.start_spot_text,
      end_spot_id: data.end_spot_id,
      status: data.status,
    };

    const car = await this.prisma.car.update({
      where: { id: carId },
      data: {
        routes: { create: routeObj },
      },
    });
    if (data.status === RouteStatus.STATUS_ACTIVE || !data.status) {
      const driver = await this.userService.findOne({
        car: { id: carId },
      });

      const notificationSub = await this.pushNotificationService.getSub({
        user_id: driver.id,
      });

      if (notificationSub) {
        const notification = await this.pushNotificationService.send(
          driver.id,
          {
            title: `Добавлен активный рейс`,
            body: `Добавлен активный рейс`,
            sub: { connect: { id: notificationSub.id } },
          },
        );
      }
    }

    return car;
  }
}
