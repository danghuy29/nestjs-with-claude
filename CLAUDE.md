# NestJS with Claude

NestJS 12 · TypeScript 6 (ESM) · Bun · Vitest · oxlint · Prettier

## Commands
- `bun run start:dev` — dev server (watch)
- `bun run build` — nest build
- `bun run lint` — oxlint (type-aware)
- `bun run format` — prettier
- `bun run test` / `test:watch` / `test:cov` — Vitest unit tests
- `bun run test:e2e` — e2e tests

## Layout
- `src/common/{guards,filters,interceptors,pipes,middleware,decorators}` — shared building blocks
- Unit tests live beside source as `*.spec.ts`; e2e tests in `test/`

## Conventions
- Follow `.claude/rules/` (common + typescript); skills in `.claude/skills/` (start with `nestjs-patterns`).
- Write tests first for new features/bug fixes (`tdd-guide` agent, `tdd-workflow` skill).
- Before finishing: `bun run lint && bun run test && bun run build`.
- Review changes with the `code-reviewer` / `typescript-reviewer` agents; use `security-reviewer` for auth/input handling.

## Credits
`.claude/{agents,commands,skills,rules}` adapted from [everything-claude-code](https://github.com/affaan-m/everything-claude-code) (MIT, see `.claude/ECC-LICENSE`).
