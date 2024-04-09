import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const adminRole = this.reflector.get('admin', context.getHandler());
    if (!adminRole) {
      // Se a rota não requer permissão de admin, permite o acesso
      return true;
    }
    const request = context.switchToHttp().getRequest();
    console.log('Request user:', request.user); //
    if (!request.user || !request.user.admin) {
      console.log('Unauthorized access:', request.user);
      // Se o usuário não é admin, lança uma exceção
      throw new UnauthorizedException(
        'Você não tem permissão para acessar esta rota',
      );
    }

    // Se o usuário for admin, permite o acesso
    return true;
  }
}
