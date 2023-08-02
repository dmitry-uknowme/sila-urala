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
import { UpdateRouteDTO } from './dto/update-route.dto';
import { RouteService } from './route.service';

@Controller('/api/routes')
export class RouteController {
  constructor(private routeService: RouteService) {}

  @Get()
  getRoutes() {
    return this.routeService.findAll({ take: 10 });
  }

  @Put(':routeId')
  updateRoute(@Param('routeId') routeId: string, @Body() dto: UpdateRouteDTO) {
    return this.routeService.update(routeId, dto);
  }

  @Delete(':routeId')
  removeRoute(@Param('routeId') routeId: string) {
    return this.routeService.remove(routeId);
  }
}
