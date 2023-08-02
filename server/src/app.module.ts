import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpotModule } from './modules/spot/spot.module';
import { CarModule } from './modules/car/car.module';
import { RouteModule } from './modules/route/route.module';

@Module({
  imports: [AuthModule, UserModule, SpotModule, CarModule, RouteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
