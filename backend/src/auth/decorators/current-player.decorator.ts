import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtPayload {
  sub: string;
}

export interface RequestWithPlayer {
  player?: JwtPayload;
}

export const CurrentPlayer = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithPlayer>();

    const player = request.player;

    if (!player) {
      return undefined;
    }

    return data ? player[data] : player.sub;
  },
);
