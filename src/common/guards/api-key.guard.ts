import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';

/**
 * Guard này được đăng ký GLOBAL (xem app.module.ts, token APP_GUARD) nên
 * chạy cho MỌI route. Vì cần Reflector (1 provider của Nest) nên phải
 * đăng ký qua APP_GUARD để DI container inject đúng cách, không dùng
 * `app.useGlobalGuards(new ApiKeyGuard())` thủ công trong main.ts.
 *
 * Route nào gắn @Public() sẽ được bỏ qua check -> minh họa cách
 * "override" một aspect global ở method-level.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      console.log('[Guard] route is @Public() -> skip api-key check');
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'];

    console.log('[Guard] checking x-api-key header...');

    if (apiKey !== 'secret123') {
      throw new UnauthorizedException('Invalid or missing x-api-key header');
    }

    return true;
  }
}
