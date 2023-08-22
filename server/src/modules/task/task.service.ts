import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RouteService } from '../route/route.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(private routeService: RouteService) {}
  @Cron('30 * * * * *')
  async handleCron() {
    await this.routeService.handleActiveRoutes();
    this.logger.debug(`Called every second ${new Date().toUTCString()}`);
  }
}
