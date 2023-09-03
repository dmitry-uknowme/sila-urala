import { BadRequestException, Injectable } from '@nestjs/common';
import { User, Prisma, UserRole } from '@prisma/client';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService, // private authService: AuthService,
  ) {}

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
      include: { push_notification_subs: true, spot: true, car: true },
    });
  }

  async findOne(filter: Partial<Prisma.UserWhereUniqueInput>): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: filter,
      include: { push_notification_subs: true, spot: true, car: true },
    });
    return user;
  }

  async create(data: CreateUserDTO, accessToken: string): Promise<User> {
    // const session = await this.authService.getSession(accessToken);
    // const userRole = session?.user?.role;

    // if (userRole && userRole === UserRole.ROLE_ADMIN) {
    //   if (data.role === UserRole.ROLE_EMPLOYEE_DRIVER && !data.car_id) {
    //     throw new BadRequestException({
    //       message: ['Выберите автомобиль для сотрудника'],
    //       statusCode: 400,
    //     });
    //   }

    //   if (data.role === UserRole.ROLE_EMPLOYEE_SELLER && !data.spot_id) {
    //     throw new BadRequestException({
    //       message: ['Выберите точку для сотрудника'],
    //       statusCode: 400,
    //     });
    //   }
    // }

    const user = await this.prisma.user.create({
      data: {
        username: data?.username,
        password: data?.password,
        first_name: data?.first_name,
        last_name: data?.last_name,
        middle_name: data?.middle_name,
        role: data.role,
        car: data?.car_id && { connect: { id: data.car_id } },
        spot: data?.spot_id && { connect: { id: data.spot_id } },
      },
    });

    return user;
  }

  async update(userId: string, data: UpdateUserDTO): Promise<User> {
    if (data.role === UserRole.ROLE_EMPLOYEE_DRIVER && !data.car_id) {
      throw new BadRequestException({
        message: ['Выберите автомобиль для сотрудника'],
        statusCode: 400,
      });
    }
    if (data.role === UserRole.ROLE_EMPLOYEE_SELLER && !data.spot_id) {
      throw new BadRequestException({
        message: ['Выберите точку для сотрудника'],
        statusCode: 400,
      });
    }
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        username: data?.username,
        password: data?.password,
        first_name: data.first_name,
        last_name: data.last_name,
        middle_name: data.middle_name,
        role: data.role,
        car: data.car_id && { connect: { id: data.car_id } },
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
