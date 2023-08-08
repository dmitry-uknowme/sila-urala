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
  Param,
  Delete,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateSpotDTO } from './dto/create-spot.dto';
import { UpdateSpotDTO } from './dto/update-spot.dto';
import { SpotService } from './spot.service';

@Controller('api/spots')
export class SpotController {
  constructor(private spotService: SpotService) {}

  @Get()
  getSpots() {
    return this.spotService.findAll({ take: 10 });
  }

  @Post('search')
  searchSpots(@Body() filter: Prisma.SpotWhereInput) {
    return this.spotService.findAll({ take: 10, where: filter });
  }

  @Post()
  createSpot(@Body() dto: CreateSpotDTO) {
    return this.spotService.create(dto);
  }

  @Put(':spotId')
  updateSpot(@Param('spotId') spotId: string, @Body() dto: UpdateSpotDTO) {
    return this.spotService.update(spotId, dto);
  }

  @Delete(':spotId')
  removeSpot(@Param('spotId') spotId: string) {
    return this.spotService.remove(spotId);
  }
}
