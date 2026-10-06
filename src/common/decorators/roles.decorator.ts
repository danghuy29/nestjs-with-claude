import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Custom decorator = cách NestJS "đánh dấu" (annotate) một handler để
 * một aspect khác (ở đây là RolesGuard) đọc được lúc runtime qua Reflector.
 * Đây chính là tinh thần AOP rõ nhất: khai báo policy ngay tại chỗ dùng
 * (@Roles('admin')) mà không viết logic kiểm tra role trong handler.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
