import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AppService } from './app.service.js';
import { Public } from './common/decorators/public.decorator.js';
import { Roles } from './common/decorators/roles.decorator.js';
import { RolesGuard } from './common/guards/roles.guard.js';
import { PositiveIntPipe } from './common/pipes/positive-int.pipe.js';

/**
 * ApiKeyGuard, TimingInterceptor, AllExceptionsFilter đều đã đăng ký GLOBAL
 * (xem app.module.ts) -> áp dụng cho MỌI route trong controller này,
 * không cần @UseGuards/@UseInterceptors/@UseFilters lặp lại nữa.
 *
 * RolesGuard thì đăng ký ở CONTROLLER-LEVEL (class decorator) vì nó chỉ
 * có ý nghĩa cho các route trong controller này, và hành vi của nó phụ
 * thuộc vào metadata @Roles() gắn riêng ở từng method.
 */
@Controller()
@UseGuards(RolesGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Thử: GET /   -> 200 luôn, vì @Public() bỏ qua ApiKeyGuard global.
   */
  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Thử: GET /secure (không header)                 -> 401 từ ApiKeyGuard GLOBAL
   *      GET /secure (header x-api-key: secret123)   -> 200
   * Không còn @UseGuards ở đây nữa -- guard global tự áp dụng.
   */
  @Get('secure')
  getSecure(): string {
    return 'Bạn đã qua được ApiKeyGuard (global)!';
  }

  /**
   * Route này bị áp 2 lớp Guard khác scope:
   *  - ApiKeyGuard (global)       -> cần header x-api-key
   *  - RolesGuard (controller)    -> cần header x-role đúng @Roles('admin')
   * Thử: thiếu 1 trong 2 header đều sẽ bị chặn.
   */
  @Get('admin-only')
  @Roles('admin')
  getAdminOnly(): string {
    return 'Chào admin!';
  }

  /**
   * @Public() để test Pipe mà không cần lo header api-key.
   * Thử: GET /items/5   -> 200, id=5 (number)
   *      GET /items/-1  -> 400 từ PositiveIntPipe
   */
  @Get('items/:id')
  @Public()
  getItem(@Param('id', PositiveIntPipe) id: number): { id: number } {
    return { id };
  }
}
