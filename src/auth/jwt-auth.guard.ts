import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true; // Si aucune annotation de rôle n'est présente, autorisez l'accès
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles || !user.roles.some(role => roles.includes(role))) {
      throw new UnauthorizedException(); // L'utilisateur n'a pas les rôles nécessaires
    }

    return true; // L'utilisateur a les rôles nécessaires
  }
}
