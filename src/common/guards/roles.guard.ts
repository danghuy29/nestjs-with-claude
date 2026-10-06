import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator.js';

/**
 * Guard này không biết trước route nào cần role gì — nó ĐỌC metadata
 * được gắn bởi @Roles(...) lúc runtime bằng Reflector. Đây là cơ chế
 * "weaving" của Nest: decorator gắn metadata (compile-time-ish),
 * Reflector + Guard đọc và áp dụng logic (runtime).
 *
 * Giả lập user đã đăng nhập qua header "x-role" cho dễ test.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // route không gắn @Roles -> không giới hạn
    }

    const request = context.switchToHttp().getRequest<Request>();
    const userRole = request.headers['x-role'] as string | undefined;

    console.log(
      `[RolesGuard] required=${requiredRoles.join(',')} actual=${userRole}`,
    );

    if (!userRole || !requiredRoles.includes(userRole)) {
      throw new ForbiddenException(
        `Requires one of roles: ${requiredRoles.join(', ')}`,
      );
    }
    return true;
  }
}
