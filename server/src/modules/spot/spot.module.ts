import { Module } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { SpotController } from './spot.controller';
import { SpotService } from './spot.service';

@Module({
  controllers:[SpotController],
  providers: [SpotService,PrismaService],
  exports: [SpotService],
})
export class SpotModule {}
