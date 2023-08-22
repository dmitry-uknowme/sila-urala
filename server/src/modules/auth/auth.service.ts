import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import { UserService } from '../user/user.service';
import { SignUpDTO } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.userService.findOne({ username });
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(dto: SignUpDTO) {
    const { username, password, role } = dto;
    const user = await this.userService.create({
      username,
      password,
      first_name: '',
      last_name: '',
      middle_name: '',
      role,
    });
    const payload = { username: user.username, sub: user.id, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return {
      user,
      access_token: token,
    };
  }

  async getSession(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'secret',
      });
      const user = await this.userService.findOne({
        username: payload.username,
      });
      return {
        user,
        access_token: token,
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
