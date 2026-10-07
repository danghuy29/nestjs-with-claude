---
paths:
  - "**/*.ts"
  - "**/*.js"
---
# TypeScript Coding Style

> Extends [common/coding-style.md](../common/coding-style.md).

- Add parameter and return types to exported functions and public class methods; let TS infer obvious locals.
- `interface` for extendable object shapes, `type` for unions/intersections/mapped types. Prefer string literal unions over `enum`.
- No `any` in app code. Use `unknown` for untrusted input and narrow it (`error instanceof Error`), or use generics.
- Immutability: return new objects (`{ ...user, name }`), use `Readonly<T>` for inputs.
- Errors: `async/await` with `try/catch`, catch as `unknown`, narrow before reading `.message`; rethrow Nest `HttpException` subclasses at the HTTP boundary.
- Input validation: DTOs with `class-validator` + `ValidationPipe` (or Zod); never trust raw request data.
- No `console.log` in production code; use Nest `Logger`.
