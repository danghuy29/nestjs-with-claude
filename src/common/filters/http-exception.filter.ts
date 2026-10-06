import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

/**
 * Exception Filter = aspect kiểu "after throwing advice".
 * Chạy khi middleware/guard/interceptor/pipe/handler NÉM lỗi ra.
 * Nó không nằm trên "đường vui" (happy path) của request, mà chặn
 * mọi lỗi lại để format response thống nhất, thay vì để lỗi raw của
 * Express/Nest lộ ra ngoài.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    console.log(`[Filter] caught ${exception.name}: ${exception.message}`);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
      message: exception.message,
    });
  }
}

/**
 * Catch-all cho lỗi KHÔNG phải HttpException (bug thật, lỗi chưa lường trước).
 * Đặt @Catch() không có argument -> bắt mọi loại exception.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    console.error('[Filter] unhandled exception:', exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
      message,
    });
  }
}
