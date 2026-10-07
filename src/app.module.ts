import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { LoggerMiddleware } from './common/middleware/logger.middleware.js';
import { ApiKeyGuard } from './common/guards/api-key.guard.js';
import { TimingInterceptor } from './common/interceptors/timing.interceptor.js';
import { AllExceptionsFilter } from './common/filters/http-exception.filter.js';
import { UserModule } from './user/user.module.js';
import { DrizzleModule } from '@nestjs/drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
    }),
    UserModule,
    DrizzleModule.forRoot({
      drizzle,
      connection: process.env.DATABASE_URL!,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global Guard: dùng token APP_GUARD (không dùng app.useGlobalGuards()
    // trong main.ts) để Nest's DI container tự inject Reflector vào
    // ApiKeyGuard. Áp dụng cho MỌI route, trừ route gắn @Public().
    // { provide: APP_GUARD, useClass: ApiKeyGuard },
    // Global Interceptor: đo thời gian + log cho MỌI handler, không cần
    // lặp lại @UseInterceptors() ở từng route/controller nữa.
    // { provide: APP_INTERCEPTOR, useClass: TimingInterceptor },
    // Global Filter: bắt MỌI exception (cả lỗi không lường trước), format
    // response lỗi thống nhất cho toàn app.
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule implements NestModule {
  // Middleware được đăng ký ở Module, không dùng decorator trên handler,
  // vì nó chạy trước khi Nest resolve route -> áp dụng theo path pattern.
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
