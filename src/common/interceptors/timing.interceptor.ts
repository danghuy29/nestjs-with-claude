import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Interceptor = aspect kiểu "around advice" đúng nghĩa AOP nhất trong Nest.
 * Nó BAO QUANH lời gọi handler: code trước `next.handle()` chạy TRƯỚC handler,
 * code trong `.pipe(...)` sau `next.handle()` chạy SAU khi handler trả về
 * (kể cả khi kết quả là Promise/Observable, vì handle() trả Observable).
 *
 * Dùng cho: đo thời gian xử lý, transform response, cache, logging response,
 * retry, timeout...
 */
@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const handlerName = context.getHandler().name;
    console.log(`[Interceptor] BEFORE handler "${handlerName}"`);
    const start = Date.now();

    return next.handle().pipe(
      tap((result) => {
        const ms = Date.now() - start;
        console.log(
          `[Interceptor] AFTER handler "${handlerName}" (${ms}ms), result =`,
          result,
        );
      }),
    );
  }
}
