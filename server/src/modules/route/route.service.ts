import { Injectable } from '@nestjs/common';
import { Prisma, Route } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class RouteService {
  constructor(private prisma: PrismaService) {}

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
      orderBy,
      include: { car: true, end_spot: true },
    });
  }

  async findOne(id: Prisma.RouteWhereUniqueInput): Promise<Route> {
    const user = await this.prisma.route.findUnique({ where: id });
    return user;
  }

  async create(data: Prisma.RouteCreateInput): Promise<Route> {
    const user = await this.prisma.route.create({ data });
    return user;
  }

  async update(carId: string, data: Prisma.RouteUpdateInput): Promise<Route> {
    const car = await this.prisma.route.update({ where: { id: carId }, data });
    return car;
  }

  async remove(carId: string): Promise<Route> {
    const car = await this.prisma.route.delete({ where: { id: carId } });
    return car;
  }
}
