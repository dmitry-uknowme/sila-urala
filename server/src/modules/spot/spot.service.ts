import { Injectable } from '@nestjs/common';
import { Prisma, Spot } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class SpotService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SpotWhereUniqueInput;
    where?: Prisma.SpotWhereInput;
    orderBy?: Prisma.SpotOrderByWithRelationInput;
  }): Promise<Spot[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.spot.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: { users: true, routes: true },
    });
  }

  async findOne(id: Prisma.SpotWhereUniqueInput): Promise<Spot> {
    const user = await this.prisma.spot.findUnique({ where: id });
    return user;
  }

  async create(data: Prisma.SpotCreateInput): Promise<Spot> {
    const user = await this.prisma.spot.create({ data });
    return user;
  }

  async update(spotId: string, data: Prisma.SpotUpdateInput): Promise<Spot> {
    const user = await this.prisma.spot.update({ where: { id: spotId }, data });
    return user;
  }

  async remove(spotId: string): Promise<Spot> {
    const user = await this.prisma.spot.delete({ where: { id: spotId } });
    return user;
  }

  // async getOneByUsername(username: string): Promise<UserModel> {
  //   return await this.userRepo.findOne({ where: { first_name: username } });
  // }

  // async
}
