# SDD Navigator Dashboard — Agent Entry Point

## Stack

Next.js 14+ App Router · TypeScript strict · React Server Components + Client Components
CSS Modules + CSS variables (no CSS framework) · Vitest + RTL · pnpm · Vercel

## Key Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm test` | Run Vitest tests |
| `pnpm typecheck` | TypeScript check (no emit) |
| `pnpm lint` | ESLint |
| `pnpm gen:types` | Generate `lib/api/types.ts` from `spec/sdd-coverage-api.yaml` |
| `pnpm check-coverage` | Verify all SCD requirements are referenced in code |
| `pnpm verify` | Full gate: typecheck → lint → test → check-coverage → build |

## Source of Truth

- **API contract**: `spec/sdd-coverage-api.yaml`
- **Project requirements**: `requirements.yaml` (17 SCD-XXX-NNN IDs)
- **Full plan**: see the plan file referenced in `docs/dev-log.md`
- **Types**: `lib/api/types.ts` (generated — never edit by hand)
- **Logic**: `lib/coverage.ts` (filter/sort/assess/orphan — single copy)

## SDD Four Pillars (brief)

1. **Traceability** — `@req SCD-XXX-NNN` on every behavior and test; commits `type(scope): msg [SCD-...]`
2. **DRY** — types from `lib/api/types.ts`; logic from `lib/coverage.ts`; no duplicates
3. **Deterministic Enforcement** — `pnpm verify` must be green before every commit
4. **Parsimony** — minimal deps, no boilerplate, concise docs

## Subagents

`.cursor/agents/`: `scaffolder`, `spec-author`, `data-layer-engineer`, `ui-engineer`, `test-engineer`, `sdd-verifier` (readonly).
