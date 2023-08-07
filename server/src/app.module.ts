import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
// import { AuthModule } from './modules/authhhh/auth.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpotModule } from './modules/spot/spot.module';
import { CarModule } from './modules/car/car.module';
import { RouteModule } from './modules/route/route.module';
import { PushNotificationService } from './modules/push-notification/push-notification.service';
import { PushNotificationModule } from './modules/push-notification/push-notification.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    AuthModule,
    UserModule,
    SpotModule,
    CarModule,
    RouteModule,
    PushNotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
