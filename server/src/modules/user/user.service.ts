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

  async findOne(filter: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: filter });
    return user;
  }

  async create(data: CreateUserDTO): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        password: '',
        first_name: data.first_name,
        last_name: data.last_name,
        middle_name: data.middle_name,
        role: data.role,
        cars: { connect: { id: data.car_id } },
        spot: { connect: { id: data.spot_id } },
      },
    });
    return user;
  }

  async update(userId: string, data: UpdateUserDTO): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        middle_name: data.middle_name,
        role: data.role,
        cars: { connect: { id: data.car_id } },
        spot: { connect: { id: data.spot_id } },
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
