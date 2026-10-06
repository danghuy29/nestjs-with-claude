import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

/**
 * Pipe = aspect chạy NGAY TRƯỚC khi handler nhận tham số.
 * Nhiệm vụ: transform dữ liệu đầu vào (ví dụ string -> number) và/hoặc
 * validate. Nếu throw, handler không bao giờ được gọi.
 *
 * Khác Guard: Guard quyết định có-được-vào-route-không (ở mức request).
 * Pipe xử lý TỪNG tham số cụ thể (ở mức argument).
 */
@Injectable()
export class PositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const n = Number(value);
    console.log(`[Pipe] validating param "${metadata.data}" = "${value}"`);

    if (Number.isNaN(n) || n <= 0) {
      throw new BadRequestException(
        `"${metadata.data}" must be a positive number, got "${value}"`,
      );
    }
    return n;
  }
}
