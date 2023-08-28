import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  UsePipes,
  ValidationPipe,
  Delete,
  Put,
  Param,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { access } from 'fs';
import { AccessToken } from '../auth/decorators/access-token.decorator';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.findAll({ take: 10 });
  }

  @Get(':userId')
  getUser(@Param('userId') userId: string) {
    return this.userService.findOne({ id: userId });
  }

  @Post()
  createUser(@AccessToken() accessToken: string, @Body() dto: CreateUserDTO) {
    return this.userService.create(dto, accessToken);
  }

  @Put(':userId')
  updateUser(@Param('userId') userId: string, @Body() dto: UpdateUserDTO) {
    return this.userService.update(userId, dto);
  }

  @Delete(':userId')
  removeUser(@Param('userId') userId: string) {
    return this.userService.remove(userId);
  }
}
