import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  UsePipes,
  ValidationPipe,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UpdateRouteDTO } from './dto/update-route.dto';
import { RouteService } from './route.service';

@Controller('/api/routes')
export class RouteController {
  constructor(private routeService: RouteService) {}

  @Get()
  getRoutes() {
    return this.routeService.findAll({ take: 10 });
  }

  @Post('search')
  searchRoutes(@Body() filter: Prisma.RouteWhereInput) {
    return this.routeService.findAll({ take: 10, where: filter });
  }

  @Put(':routeId')
  updateRoute(
    @Param('routeId') routeId: string,
    @Body() dto: Prisma.RouteUpdateInput /* UpdateRouteDTO */,
  ) {
    return this.routeService.update(routeId, dto);
  }

  @Post(':routeId/start')
  driverStart(@Param('routeId') routeId: string) {
    return this.routeService.driverStart(routeId);
  }

  @Post(':routeId/complete')
  driverComplete(@Param('routeId') routeId: string) {
    return this.routeService.driverComplete(routeId);
  }

  @Delete(':routeId')
  removeRoute(@Param('routeId') routeId: string) {
    return this.routeService.remove(routeId);
  }
}
