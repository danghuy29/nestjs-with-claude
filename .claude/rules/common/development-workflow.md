# Development Workflow

1. **Research first** — check existing code, npm packages and library docs before writing new utilities.
2. **Plan** — use the `planner` agent for non-trivial features; identify dependencies and risks.
3. **TDD** — use `tdd-guide`: write failing test (RED), implement (GREEN), refactor; keep 80%+ coverage.
4. **Review** — run `code-reviewer` right after writing code; fix CRITICAL/HIGH issues.
5. **Commit** — conventional commits (see [git-workflow.md](./git-workflow.md)); CI green and branch up to date before requesting review.
