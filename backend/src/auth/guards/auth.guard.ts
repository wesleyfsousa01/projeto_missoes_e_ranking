import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { InvalidTokenError } from '../erros';
import {
  JwtPayload,
  RequestWithPlayer,
} from '../decorators/current-player.decorator';

type AuthRequest = Request & RequestWithPlayer;

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new InvalidTokenError();
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      request.player = payload;
    } catch {
      throw new InvalidTokenError();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
