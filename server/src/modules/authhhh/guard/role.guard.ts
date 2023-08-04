import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Partial<UserRole[]>>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userRoles = user.roles as Partial<UserRole[]>;
    return user.roles.some((role) => roles?.some((r) => r === role));
    // return user.roles.find(role=>roles.find(r=>r))
    // return matchRoles(roles, user.roles);
  }
}
