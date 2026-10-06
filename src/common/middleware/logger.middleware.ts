import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

/**
 * Middleware = lớp AOP đầu tiên, chạy TRƯỚC KHI Nest biết request sẽ đi vào
 * controller/handler nào. Nó vẫn là middleware kiểu Express/Connect thuần,
 * không biết gì về @Controller, Guard, Pipe...
 *
 * Dùng cho: logging request thô, đọc/ghi raw req-res, rate limiting theo IP, CORS...
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    console.log(`[Middleware] --> ${req.method} ${req.originalUrl}`);

    res.on('finish', () => {
      const ms = Date.now() - start;
      console.log(
        `[Middleware] <-- ${req.method} ${req.originalUrl} ${res.statusCode} (${ms}ms)`,
      );
    });

    next();
  }
}
