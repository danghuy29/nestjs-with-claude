import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Dùng để OVERRIDE guard global ở method-level/controller-level cụ thể.
 * Đây là pattern thực tế rất phổ biến: đăng ký 1 AuthGuard global cho
 * TOÀN BỘ app, rồi dùng @Public() để đánh dấu những route ngoại lệ
 * (login, health-check, docs...) không cần qua guard đó.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
