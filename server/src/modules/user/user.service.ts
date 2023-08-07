import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: { spot: true, cars: true },
    });
  }

  async findOne(filter: Partial<Prisma.UserWhereUniqueInput>): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: filter,
      include: { cars: true, push_notification_subs: true, spot: true },
    });
    return user;
  }

  async create(
    data: Prisma.UserCreateInput /* CreateUserDTO */,
  ): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        username: data?.username,
        password: data?.password,
        first_name: data.first_name,
        last_name: data.last_name,
        middle_name: data.middle_name,
        role: data.role,
        //@ts-expect-error
        cars: data.car_id && { connect: { id: data.car_id } },
        //@ts-expect-error
        spot: data.spot_id && { connect: { id: data.spot_id } },
      },
    });

    return user;
  }

  async update(
    userId: string,
    data: Prisma.UserUpdateInput /* UpdateUserDTO */,
  ): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        username: data?.username,
        password: data?.password,
        first_name: data.first_name,
        last_name: data.last_name,
        middle_name: data.middle_name,
        role: data.role,
        //@ts-expect-error
        cars: data.car_id && { connect: { id: data.car_id } },
        //@ts-expect-error
        spot: data.spot_id && { connect: { id: data.spot_id } },
      },
    });
    return user;
  }

  async remove(userId: string): Promise<User> {
    const user = await this.prisma.user.delete({
      where: { id: userId },
    });
    return user;
  }
}
