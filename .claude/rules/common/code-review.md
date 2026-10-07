# Code Review Standards

## When to review
After writing or modifying code, before commits to shared branches, and before merging PRs. Use `security-reviewer` for auth, user input, DB queries, file system, external calls, crypto, payments.

## Checklist
- Readable, well-named; functions <50 lines; files <800 lines; nesting ≤4 levels
- Errors handled explicitly; no hardcoded secrets; no `console.log`
- Tests exist for new code; coverage ≥80%
- No N+1 queries, unbounded queries or missing pagination

## Severity
| Level | Action |
|-------|--------|
| CRITICAL (security, data loss) | Block merge |
| HIGH (bug, significant quality) | Fix before merge |
| MEDIUM (maintainability) | Consider fixing |
| LOW (style) | Optional |

Approve with no CRITICAL/HIGH; block on any CRITICAL.

## Agents
`code-reviewer` (general), `typescript-reviewer` (TS/JS), `security-reviewer` (OWASP).
