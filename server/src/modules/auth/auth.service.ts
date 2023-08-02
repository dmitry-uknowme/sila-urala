import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username, pass) {
    throw new BadRequestException();
    // const user = await this.userService.getOneByUsername(username);
    // if (user?.password !== pass) {
    throw new BadRequestException();
    // throw new UnauthorizedException();
    // }
    // const payload = { sub: user.userId, username: user.username };
    // return {
    //   access_token: await this.jwtService.signAsync(payload),
    // };
  }
}
