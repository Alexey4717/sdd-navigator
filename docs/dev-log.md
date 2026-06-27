# SDD Navigator Dashboard — Developer Log

<!-- Every SA must append its own entry here.
     This log is the primary source for generating PROCESS.md at SA10. -->

---

## SA0 — Cursor tooling

**Start**: 2026-06-27 ~16:12 local (UTC+10)
**End**: 2026-06-27 ~16:30 local (UTC+10)

### Task summary

Set up all Cursor tooling for the project before any code is written:

- Cursor Rules (`.cursor/rules/*.mdc`): 4 rules enforcing SDD pillars, data layer conventions, component conventions, and test conventions.
- Cursor Hooks (`.cursor/hooks.json` + `.cursor/hooks/*.mjs`): 4 hooks — format-fix (afterFileEdit), guard (beforeShellExecution), gate (subagentStop), remind (stop).
- Cursor Subagents (`.cursor/agents/*.md`): 6 specialized subagents — scaffolder, spec-author, data-layer-engineer, ui-engineer, test-engineer, sdd-verifier (readonly).
- `AGENTS.md`: concise stack/commands/links entry point for any agent.
- `PROCESS.md`: skeleton with 7 sections, pre-filled SA0 entries.
- `docs/dev-log.md`: this file.

**Plan reference**: `C:\Users\Alexey\.cursor\plans\sdd_navigator_dashboard_c8569307.plan.md`, section §5 and §6 SA0.

### What was created

| File                                    | Purpose                                                   |
| --------------------------------------- | --------------------------------------------------------- |
| `.cursor/rules/sdd-core.mdc`            | Four pillars, @req rule, no-any, commit format            |
| `.cursor/rules/data-layer.mdc`          | Types from spec, Result errors, DataProvider, coverage.ts |
| `.cursor/rules/components.mdc`          | RSC/client boundary, CSS Modules, a11y, responsive        |
| `.cursor/rules/tests.mdc`               | Vitest+RTL, first-line @req, behavioral testing           |
| `.cursor/hooks.json`                    | Hook definitions (version 1)                              |
| `.cursor/hooks/format-fix.mjs`          | Prettier + ESLint --fix on edited files                   |
| `.cursor/hooks/guard.mjs`               | Block secret file reads and destructive git commands      |
| `.cursor/hooks/gate.mjs`                | Run typecheck + check-coverage after each subagent        |
| `.cursor/hooks/remind.mjs`              | Remind to update dev-log and run pnpm verify              |
| `.cursor/agents/scaffolder.md`          | CLI-driven project scaffolding subagent                   |
| `.cursor/agents/spec-author.md`         | requirements.yaml + mock data authoring subagent          |
| `.cursor/agents/data-layer-engineer.md` | lib/api/\* + lib/coverage.ts subagent                     |
| `.cursor/agents/ui-engineer.md`         | RSC + client components + CSS Modules subagent            |
| `.cursor/agents/test-engineer.md`       | Vitest + RTL tests subagent                               |
| `.cursor/agents/sdd-verifier.md`        | Read-only SDD audit subagent                              |
| `AGENTS.md`                             | Agent entry point: stack, commands, pointers              |
| `PROCESS.md`                            | Process document skeleton (7 sections)                    |
| `docs/dev-log.md`                       | This file                                                 |

### What was accepted

All files as designed in the plan. No deviations.

### What was rejected / corrected

None at this step.

### Verification

- `node -v` → v24.12.0 ✓
- Hook scripts sanity-checked: guard returns `ask` for `.env` commands, `allow` otherwise; gate no-ops with no `package.json`; remind emits reminder JSON.

---

## SA1 — Scaffolding & config

**Start**: 2026-06-27 ~16:31 local (UTC+10)
**End**: 2026-06-27 ~18:05 local (UTC+10)

### Task summary

Finish Next.js App Router scaffolding and tooling config after an interrupted first attempt. User manually set package versions (`next@16.2.1`, `pnpm@10.33.0`) and ran `pnpm install` successfully (Next + ESLint + TypeScript only).

### What was already present (skipped)

| Item                                   | Status                                                         |
| -------------------------------------- | -------------------------------------------------------------- |
| `tsconfig.json`                        | `strict: true`, `noUncheckedIndexedAccess: true`, `@/*` alias  |
| `vitest.config.ts` / `vitest.setup.ts` | jsdom, globals, react plugin, jest-dom setup                   |
| `.prettierrc`                          | `{ singleQuote, semi }`                                        |
| `app/globals.css`                      | Light/dark CSS variables, WCAG AA contrast, `color-scheme`     |
| `scripts/check-coverage.ts`            | SA9 placeholder, exits 0                                       |
| `package.json` scripts                 | dev/build/start/typecheck/test/gen:types/check-coverage/verify |
| `.gitignore`                           | `node_modules`, `.next` covered                                |

### What was changed

- `package.json` `lint` script: `next lint` → `eslint .` (Next.js 16 removed the `lint` subcommand; `next lint` was mis-parsed as a directory).

### Dev dependencies installed

Added via `pnpm add -D`: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`, `@vitejs/plugin-react`, `openapi-typescript`, `tsx`, `yaml`, `prettier`.

No config fixes required — existing vitest/eslint/tsconfig setup worked as-is.

### Verification

| Command               | Result                                             |
| --------------------- | -------------------------------------------------- |
| `pnpm typecheck`      | PASS                                               |
| `pnpm lint`           | PASS (3 warnings in `.cursor/hooks/*.mjs`, exit 0) |
| `pnpm test`           | PASS (passWithNoTests, no test files yet)          |
| `pnpm check-coverage` | PASS (SA9 placeholder, exit 0)                     |
| `pnpm build`          | PASS                                               |
| `pnpm verify`         | PASS                                               |

---

## SA2 — Spec artifacts and data

**Start**: 2026-06-27 ~17:50 local (UTC+10)
**End**: 2026-06-27 ~18:20 local (UTC+10)

### Task summary

Authored all spec artifacts and mock data for the SDD Navigator Dashboard:

- Downloaded `spec/sdd-coverage-api.yaml` (~25 KB, OpenAPI 3.0.3, title "SDD Navigator API") from the live endpoint.
- Wrote `requirements.yaml` with 17 SCD-XXX-NNN requirements (each with `id`, `title`, MUST/SHOULD `description`).
- Created `data/requirements.json` (8 Requirement objects), `data/annotations.json` (16 Annotation objects), `data/tasks.json` (6 Task objects), `data/stats.json` (Stats object).
- Ran `pnpm gen:types` → generated `lib/api/schema.d.ts`.
- Created `lib/api/types.ts` re-exporting 14 named domain types from the generated schema.

### What was created

| File                         | Purpose                                                                                                                                                                                                               |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `spec/sdd-coverage-api.yaml` | API contract downloaded from api.pdd.foreachpartners.com                                                                                                                                                              |
| `requirements.yaml`          | 17 SCD dashboard requirements with MUST/SHOULD descriptions                                                                                                                                                           |
| `data/requirements.json`     | 8 Requirement objects (FR×6, AR×2; covered×5, partial×1, missing×2)                                                                                                                                                   |
| `data/annotations.json`      | 16 Annotation objects (impl×10, test×6, orphans×2)                                                                                                                                                                    |
| `data/tasks.json`            | 6 Task objects (open×3, in_progress×1, done×2; orphan×1)                                                                                                                                                              |
| `data/stats.json`            | Stats object consistent with the arrays above                                                                                                                                                                         |
| `lib/api/schema.d.ts`        | Generated by `pnpm gen:types` (openapi-typescript 7.13.0)                                                                                                                                                             |
| `lib/api/types.ts`           | Re-exports: Stats, RequirementStats, AnnotationStats, TaskStats, Requirement, RequirementDetail, Annotation, Task, ScanStatus, Healthcheck, ApiErrorBody, RequirementType, CoverageStatus, AnnotationType, TaskStatus |

### DRY-consistency check (arrays → stats.json)

| Metric                     | Computed from arrays                                            | stats.json value | Match |
| -------------------------- | --------------------------------------------------------------- | ---------------- | ----- |
| requirements.total         | count(requirements.json) = 8                                    | 8                | ✓     |
| byType.FR                  | FR items = 6                                                    | 6                | ✓     |
| byType.AR                  | AR items = 2                                                    | 2                | ✓     |
| byStatus.covered           | covered items = 5 (FR-SCAN-001/002/003, FR-API-001, FR-API-003) | 5                | ✓     |
| byStatus.partial           | partial items = 1 (FR-API-002)                                  | 1                | ✓     |
| byStatus.missing           | missing items = 2 (AR-PERF-001, AR-SEC-001)                     | 2                | ✓     |
| coverage                   | 5/8 × 100 = 62.5                                                | 62.5             | ✓     |
| annotations.total          | count(annotations.json) = 16                                    | 16               | ✓     |
| annotations.impl           | impl annotations = 10                                           | 10               | ✓     |
| annotations.test           | test annotations = 6                                            | 6                | ✓     |
| annotations.orphans        | orphan reqIds (FR-LEGACY-001, FR-API-099) = 2                   | 2                | ✓     |
| tasks.total                | count(tasks.json) = 6                                           | 6                | ✓     |
| tasks.byStatus.open        | open tasks = 3                                                  | 3                | ✓     |
| tasks.byStatus.in_progress | in_progress tasks = 1                                           | 1                | ✓     |
| tasks.byStatus.done        | done tasks = 2                                                  | 2                | ✓     |
| tasks.orphans              | orphan requirementIds (FR-EXPORT-001) = 1                       | 1                | ✓     |

Coverage status consistency (covered = has impl AND test; partial = impl only; missing = none):

- FR-SCAN-001: impl×2 + test×1 → covered ✓
- FR-SCAN-002: impl×1 + test×1 → covered ✓
- FR-SCAN-003: impl×1 + test×1 → covered ✓
- FR-API-001: impl×2 + test×1 → covered ✓
- FR-API-003: impl×1 + test×1 → covered ✓
- FR-API-002: impl×2 + test×0 → partial ✓
- AR-PERF-001: 0 annotations → missing ✓
- AR-SEC-001: 0 annotations → missing ✓

### `pnpm gen:types` result

Ran successfully. openapi-typescript 7.13.0. Output: `lib/api/schema.d.ts` (generated).
`pnpm typecheck` exits 0 after creating `lib/api/types.ts`.

### What was accepted

All files as specified in the SA2 prompt. No deviations from the plan.

### What was rejected / corrected

None.

---

## SA3 — Data layer

**Start**: 2026-06-27 ~18:32 local (UTC+10)
**End**: 2026-06-27 ~18:48 local (UTC+10)

### Task summary

Built the typed, framework-agnostic data layer: a `Result`-based error model, a single
shared coverage-logic module, one `DataProvider` interface with mock + live
implementations, and a public entrypoint that selects the provider by env var. Strict
TypeScript, zero `any`, no thrown exceptions for expected failures.

**Plan reference**: `sdd_navigator_dashboard_c8569307.plan.md` §SA3, §1 (DRY/Traceability), §2 (Architecture).

### Files created

| File                  | Purpose                                                            |
| --------------------- | ------------------------------------------------------------------ |
| `lib/api/errors.ts`   | `ApiErrorKind`/`ApiError`/`Result<T>` + `ok()`/`err()` helpers     |
| `lib/coverage.ts`     | Single source of filter/sort/assess/orphan/`computeStats` logic    |
| `lib/api/provider.ts` | `DataProvider` interface (7 methods) + exported filter param types |
| `lib/api/mock.ts`     | Server-side provider reading `data/*.json` via `fs/promises`       |
| `lib/api/live.ts`     | `fetch`-based provider mapping all failures to `Result`            |
| `lib/api/index.ts`    | Provider selection by `NEXT_PUBLIC_API_URL` + bound public API     |

### Design

- **`Result` over exceptions**: `type Result<T> = { ok: true; data: T } | { ok: false; error: ApiError }`.
  `ApiErrorKind = 'network' | 'not_found' | 'malformed' | 'http'`. Helpers `ok(data)` and
  `err(kind, message, status?)`. No expected failure is ever thrown.
- **Single `DataProvider` interface**: both `mock.ts` and `live.ts` implement the same 7
  methods returning `Promise<Result<...>>`. Selection lives only in `index.ts`.
- **DRY coverage module**: all filtering/sorting/orphan/assessment lives in `lib/coverage.ts`
  and is reused by both providers (and later components/tests). Provider filter param types
  (`RequirementListFilters`, `AnnotationListFilters`, `TaskListFilters`) extend the shared
  coverage filters and add list-only `sort`/`order`.
- **Domain types**: imported exclusively from `@/lib/api/types` (generated from the spec) —
  no hand-rolled shapes anywhere.

### @req mapping

| Behavior                                                           | @req         |
| ------------------------------------------------------------------ | ------------ |
| Typed client/types, coverage module header                         | SCD-API-001  |
| Provider selection by env, `DataProvider`, scan methods, factories | SCD-API-002  |
| `Result`/`ApiError`, `ok`/`err`, error model                       | SCD-API-003  |
| `computeStats`, `getStats`, `getScanStatus`                        | SCD-SUM-001  |
| `filterRequirements`, `listRequirements`                           | SCD-FLT-001  |
| `sortRequirements`                                                 | SCD-SORT-001 |
| `assessCoverage`, `getRequirement` (detail)                        | SCD-DET-001  |
| `findOrphanAnnotations`, `filterAnnotations`, `listAnnotations`    | SCD-ORPH-001 |
| `findOrphanTasks`, `filterTasks`, `sortTasks`, `listTasks`         | SCD-TASK-001 |

### Mock reads / live error mapping

- **Mock**: reads `data/*.json` from a configurable base dir (default `<cwd>/data`) so SA8 can
  point it at fixtures. Each read goes through a guarded helper: missing/empty file → `err('malformed')`,
  `JSON.parse` failure → `err('malformed')`, shape mismatch (not array / not object) → `err('malformed')`.
  `getRequirement(id)` joins the requirement with its annotations (`reqId === id`) and tasks
  (`requirementId === id`); absent id → `err('not_found', …, 404)`. `getStats` reads `stats.json`
  (with `computeStats` kept available in `lib/coverage.ts` as the single computation path).
  `triggerScan` → `{ status: 'scanning', startedAt: now }`; `getScanStatus` → `completed` using `stats.lastScanAt`.
- **Live**: `fetch(`${baseUrl}${path}`)` with `baseUrl` from `NEXT_PUBLIC_API_URL`; query strings
  built from filters. Mapping: thrown fetch → `err('network')`; `res.status === 404` → `err('not_found')`;
  other non-ok → `err('http', …, status)`; `res.json()` failure → `err('malformed')`; success → `ok(data as T)`.

### Verification

| Command                         | Result                                                                                                                                                                                                                                    |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm typecheck`                | PASS (strict, no `any`)                                                                                                                                                                                                                   |
| `pnpm lint`                     | PASS (0 errors; 3 pre-existing `.cursor/hooks/*.mjs` warnings only)                                                                                                                                                                       |
| `pnpm check-coverage`           | PASS (SA9 placeholder)                                                                                                                                                                                                                    |
| Smoke (mock provider via `tsx`) | `getStats` coverage=62.5 total=8; `listRequirements` count=8; `status=missing` → AR-PERF-001, AR-SEC-001; orphan annotations FR-LEGACY-001, FR-API-099; orphan task TASK-006; detail FR-SCAN-001 anns=3 tasks=1; `NOPE-999` → `not_found` |

Smoke script was temporary and removed (no test files added — that is SA8).

### What was accepted

All deliverables as specified. No `git` commit made (left for the user to review).

### What was rejected / corrected

None.

---

## SA4 — Summary panel + theme

**Start**: 2026-06-27 ~18:55 local (UTC+10)
**End**: 2026-06-27 ~19:10 local (UTC+10)

### Task summary

Implemented `SummaryPanel` RSC, `ThemeToggle` client component, anti-FOUC layout script, updated `app/page.tsx` + `app/layout.tsx`. Added `app/loading.tsx` with a pulse-skeleton.

### Components created

| File                                 | Type             | Purpose                                                                        |
| ------------------------------------ | ---------------- | ------------------------------------------------------------------------------ |
| `components/SummaryPanel.tsx`        | RSC              | Totals, byType, byStatus bars, coverage% progress, orphan warnings, lastScanAt |
| `components/SummaryPanel.module.css` | CSS Module       | Status bars, progress track, warning block, responsive grid                    |
| `components/ThemeToggle.tsx`         | Client Component | Toggles `data-theme` on `<html>`, persists in `localStorage`                   |
| `components/ThemeToggle.module.css`  | CSS Module       | Pill button with focus-visible ring                                            |
| `app/layout.tsx`                     | Server layout    | Anti-FOUC inline script in `<head>`, sticky nav with ThemeToggle               |
| `app/layout.module.css`              | CSS Module       | Sticky header, constrained main area                                           |
| `app/page.tsx`                       | RSC page         | Calls `getStats()`, renders SummaryPanel or accessible error state             |
| `app/loading.tsx`                    | Next.js loading  | Pulse-skeleton (SCD-STATE-001)                                                 |
| `app/loading.module.css`             | CSS Module       | `@keyframes pulse` skeleton blocks                                             |

### RSC vs client boundary

`SummaryPanel` is a pure RSC — receives `stats: Stats` as prop, no state/effects. `ThemeToggle` is the only `'use client'` component; uses `useSyncExternalStore` with a custom `sdd-theme-change` event to avoid `setState` inside `useEffect`. Layout and page remain Server Components.

### Anti-FOUC approach

Inline `<script dangerouslySetInnerHTML>` in `<head>` runs synchronously before first paint: reads `localStorage.theme`, falls back to `window.matchMedia('(prefers-color-scheme: dark)')`, sets `document.documentElement.dataset.theme`.

### A11y / contrast notes

All CSS variables in `globals.css` verified WCAG AA (≥4.5:1): foreground/background ~14–15:1; status-covered/partial/missing and warning colors pass in both themes. `SummaryPanel` uses `<section aria-labelledby>`, `<dl>`, `role="progressbar"` with `aria-valuenow/min/max`, `role="alert"` for orphan warnings. `ThemeToggle` has `aria-label` + `aria-pressed` + `focus-visible` outline.

### @req mapping

| @req            | File(s)                                        |
| --------------- | ---------------------------------------------- |
| `SCD-SUM-001`   | `components/SummaryPanel.tsx`, `app/page.tsx`  |
| `SCD-A11Y-001`  | `components/SummaryPanel.tsx`                  |
| `SCD-RESP-001`  | `components/SummaryPanel.tsx`                  |
| `SCD-THEME-001` | `components/ThemeToggle.tsx`, `app/layout.tsx` |
| `SCD-STATE-001` | `app/page.tsx`, `app/loading.tsx`              |

### Verification results

| Check            | Result                                             |
| ---------------- | -------------------------------------------------- |
| `pnpm typecheck` | PASS (strict, 0 errors)                            |
| `pnpm lint`      | PASS (0 errors; 3 pre-existing hook warnings only) |
| `pnpm build`     | PASS (Next.js 16.2.1, static `/` route)            |

### What was accepted

All deliverables as specified. `useSyncExternalStore` + custom event chosen to avoid `react-hooks/set-state-in-effect` lint error.

### What was rejected / corrected

Initial `ThemeToggle` called `setTheme()` inside `useEffect` body — rejected by ESLint. Replaced with `useSyncExternalStore` + custom `sdd-theme-change` event subscription.

No `git` commit made (left for user to review).

---

## SA4 — Hydration fix

**Start**: 2026-06-27 ~19:32 local (UTC+10)
**End**: 2026-06-27 ~19:40 local (UTC+10)

### Symptom

Dev server logged a React hydration mismatch on the home page:

> A tree hydrated but some attributes of the server rendered HTML didn't match the client properties… `<html lang="en" data-theme="dark">`

### Root cause

The anti-FOUC bootstrap (`next/script`, `beforeInteractive`, inline children) sets `document.documentElement.dataset.theme` **before** hydration. The SSR HTML has no `data-theme` attribute, so the client `<html>` (now `data-theme="dark"`) no longer matches the server markup — React flags it. This is expected for an intentional pre-hydration theme attribute.

### Fix

Added `suppressHydrationWarning` to the `<html>` element only in `app/layout.tsx` — the canonical Next.js/React pattern for elements whose attributes are intentionally mutated before hydration. Anti-FOUC approach unchanged (still inline children + `beforeInteractive`, no `dangerouslySetInnerHTML`). The attribute is scoped to `<html>` only — not applied broadly.

```tsx
<html lang="en" suppressHydrationWarning>
```

### Verification

Loaded the running dev server (localhost:3000) in a browser, injected a `console.error`/`console.warn` capture before page scripts (CDP `Page.addScriptToEvaluateOnNewDocument`), then reloaded to re-run hydration with `data-theme="dark"` applied pre-hydration. Captured **0** console errors/warnings, **0** hydration-related messages — the `data-theme` mismatch warning is gone. `pnpm typecheck` / `pnpm lint` (0 errors) / `pnpm build` all pass.

No `git` commit made (left for user to review).

---

## SA4 — Review refactor

**Start**: 2026-06-27 ~19:18 local (UTC+10)
**End**: 2026-06-27 ~19:35 local (UTC+10)

User-requested refactor of the SA4 deliverables. Six changes applied.

### 1. globals.css split

`app/globals.css` now contains only three ordered `@import`s. CSS extracted into `app/styles/`:

- `reset.css` — box-sizing reset + html/body sizing/overflow.
- `theme.css` — `:root` (light) + `[data-theme='dark']` CSS variables.
- `base.css` — body typography/layout + anchor styles.

Import order is reset → theme → base. `app/layout.tsx` still imports `./globals.css`.

### 2. Anti-FOUC via next/script (decision + rationale)

Replaced the raw `<script dangerouslySetInnerHTML>` with `next/script`'s `<Script id="theme-bootstrap" strategy="beforeInteractive">{…inline JS…}</Script>` (**inline children**, NOT external `src`).

**Why not external `/scripts/theme-bootstrap.js`?** An external `src` with `beforeInteractive` is a separate network request that the browser may resolve _after_ first paint, reintroducing FOUC. Inline children with `beforeInteractive` are inlined by Next into the initial HTML as a synchronous script placed at the start of `<body>`, before the header/panel DOM — so it executes before that content is painted. **Zero FOUC, fully declarative (no `dangerouslySetInnerHTML`).**

Verified against the production build: `dataset.theme` script is present in `.next/server/app/index.html` at the start of `<body>` (pos before the "Coverage Summary" content). No `public/scripts/` file was created (parsimony).

### 3. Reusable Skeleton component

`components/Skeleton/` — props: `width?: string|number`, `height?: string|number`, `variant?: 'rect'|'text'|'circle'` (default `rect`), `className?`. Numbers are coerced to `px`. Renders an `aria-hidden` `<span>` with the pulse animation. `app/loading.tsx` now composes `<Skeleton>` instances; `loading.module.css` keeps only the container + grid layout (pulse animation moved into Skeleton).

### 4. components/ reorganization (per-folder + SRP)

Each component now lives in its own same-named folder with a barrel `index.ts` so `@/components/SummaryPanel` and `@/components/ThemeToggle` import paths are unchanged. `SummaryPanel` split into focused subcomponents under `SummaryPanel/components/`:

```
components/
  Skeleton/{index.ts, Skeleton.tsx, Skeleton.module.css}
  ThemeToggle/{index.ts, ThemeToggle.tsx, ThemeToggle.module.css}
  SummaryPanel/
    {index.ts, SummaryPanel.tsx, SummaryPanel.module.css}
    components/
      StatCard/{index.ts, StatCard.tsx, StatCard.module.css}
      CoverageProgress/{index.ts, CoverageProgress.tsx, CoverageProgress.module.css}
      StatusBreakdown/{index.ts, StatusBreakdown.tsx, StatusBreakdown.module.css}
      OrphanWarning/{index.ts, OrphanWarning.tsx, OrphanWarning.module.css}
```

`OrphanWarning` self-hides (returns `null`) when both orphan counts are 0. `CoverageProgress` owns the `role="progressbar"` semantics; `StatusBreakdown` owns the status bars (internal `StatusBar` row helper). Old flat files (`components/SummaryPanel.tsx`, `SummaryPanel.module.css`, `ThemeToggle.tsx`, `ThemeToggle.module.css`) deleted.

### 5. public/ asset audit

Grepped the codebase for the create-next-app SVGs — zero references. Deleted all five: `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`. `public/` is now empty (no external bootstrap script needed).

### @req mapping (preserved + moved with code)

| @req            | File(s)                                                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `SCD-SUM-001`   | `SummaryPanel.tsx`, `StatCard.tsx`, `CoverageProgress.tsx`, `StatusBreakdown.tsx`, `OrphanWarning.tsx`, `app/page.tsx` |
| `SCD-A11Y-001`  | `SummaryPanel.tsx`, `CoverageProgress.tsx`, `OrphanWarning.tsx`                                                        |
| `SCD-RESP-001`  | `SummaryPanel.tsx`                                                                                                     |
| `SCD-THEME-001` | `ThemeToggle.tsx`, `app/layout.tsx`                                                                                    |
| `SCD-STATE-001` | `Skeleton.tsx`, `app/loading.tsx`, `app/page.tsx`                                                                      |

### Verification results

| Check            | Result                                                       |
| ---------------- | ------------------------------------------------------------ |
| `pnpm typecheck` | PASS (0 errors)                                              |
| `pnpm lint`      | PASS (0 errors; 3 pre-existing hook warnings)                |
| `pnpm build`     | PASS (Next.js 16.2.1; theme script verified inlined in HTML) |

No `git` commit made (left for user to review).

---

## SA4 — DataError + error boundary

**Start**: 2026-06-27 ~20:00 local (UTC+10)
**End**: 2026-06-27 ~20:10 local (UTC+10)

### Task summary

Extracted inline error UI from `app/page.tsx` into a reusable `DataError` client component. `page.tsx` still checks `Result` from `getStats()` (expected API failures). Added `app/error.tsx` as a Next.js error boundary safety net for unexpected thrown errors.

### Architecture

| Layer                         | Mechanism               | When                                    |
| ----------------------------- | ----------------------- | --------------------------------------- |
| `page.tsx` + `DataError`      | Explicit `Result` check | Provider returns `{ ok: false, error }` |
| `app/error.tsx` + `DataError` | Next.js error boundary  | Uncaught throw during render            |

`error.tsx` does **not** replace `Result` handling — it catches only exceptions. Expected failures stay in the type system per SCD-API-003.

### Files

| File                                        | Purpose                                                    |
| ------------------------------------------- | ---------------------------------------------------------- |
| `components/DataError/DataError.tsx`        | RSC alert UI: title + message (no interactivity)           |
| `components/DataError/DataError.module.css` | Shared styles for DataError and `app/error.tsx`            |
| `components/DataError/index.ts`             | Barrel export                                              |
| `app/page.tsx`                              | `<DataError message={…} />` on failed `getStats()`         |
| `app/error.tsx`                             | Client error boundary; reuses DataError CSS + retry button |

### @req mapping

| @req            | File(s)                                          |
| --------------- | ------------------------------------------------ |
| `SCD-STATE-001` | `DataError.tsx`, `app/page.tsx`, `app/error.tsx` |
| `SCD-A11Y-001`  | `DataError.tsx`                                  |

### Verification results

| Check            | Result |
| ---------------- | ------ |
| `pnpm typecheck` | PASS   |
| `pnpm lint`      | PASS   |
| `pnpm build`     | PASS   |

No `git` commit made (left for user to review).

---

## Component conventions — arrow functions + direct imports

**Start**: 2026-06-27 ~20:15 local (UTC+10)
**End**: 2026-06-27 ~20:20 local (UTC+10)

### Task summary

Extended `.cursor/rules/components.mdc` with two conventions: client components (`'use client'`) use `const` arrow functions + `export default`; no barrel `index.ts` in `components/` — import `@/components/<Name>/<Name>` directly.

### Rule changes

| Convention                | Scope                     | Rationale                                                                |
| ------------------------- | ------------------------- | ------------------------------------------------------------------------ |
| Arrow function components | `'use client'` files only | Consistent client-component style; RSC keeps `function`/`async function` |
| No `index.ts` barrels     | `components/**`           | Explicit import paths; one less indirection layer                        |

`lib/api/index.ts` unchanged — provider selection barrel is intentional (data-layer rule).

### Refactor applied

- Deleted 8 `index.ts` barrels under `components/`.
- Updated imports in `app/page.tsx`, `app/layout.tsx`, `app/loading.tsx`, `app/error.tsx`, `SummaryPanel.tsx`.
- Converted `ThemeToggle.tsx` and `app/error.tsx` from `function` to arrow components.

### Verification results

| Check         | Result                        |
| ------------- | ----------------------------- |
| `pnpm verify` | PASS (typecheck, lint, build) |

No `git` commit made (left for user to review).

---

## SA5 — Requirements table + filters

**Start**: 2026-06-27 ~20:27 local (UTC+10)
**End**: 2026-06-27 ~20:45 local (UTC+10)

### Task summary

Built the interaction-heavy table node: a server-rendered `RequirementsTable` (ID, type, title, status, updated; sortable ID/Updated headers), a client `FilterChips` multi-select for type + status, and an `EmptyState`. Wired both into `app/page.tsx`, which now `await`s `searchParams` (Next 16 promise), parses URL state, and applies multi-select filter + sort through the shared `lib/coverage.ts` functions.

### URL as the single source of truth

State lives in the query string, never in client React state, so any filtered/sorted view is shareable by URL. `lib/url-filters.ts` is the single query<->state mapping (DRY across page + chips):

- `parseTableState(rawSearchParams)` — validates `type`/`status` against the allowed enums (invalid values ignored, options de-duplicated/canonically ordered) and `sort`/`order` with safe defaults (`id`/`asc`).
- `stateToSearchParams` / `currentQuery` / `sortHref` — serialize state back to repeated params (`?type=FR&type=AR&status=missing`), omitting default sort/order to keep URLs clean.

`FilterChips` toggles a value in a clone of the live `URLSearchParams` and calls `router.replace(..., { scroll: false })` — `replace` (not `push`) avoids history spam, `scroll:false` avoids scroll jumps; the RSC page re-renders the table from the new URL.

### Multi-select via coverage.ts

The REST API filters by a single type/status only, so the page fetches the full `listRequirements()` list and applies MULTI-SELECT `filterRequirements({ type: [...], status: [...] })` + `sortRequirements(sort, order)` from `lib/coverage.ts`. Identical behavior for mock and live, zero duplicated filter/sort logic.

### Accessibility & responsive

| Concern               | Handling                                                                                                                                                                          |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Semantic table        | `<table>` + `<thead>/<tbody>`, `<th scope="col">`, visually-hidden `<caption>`                                                                                                    |
| Sort (`aria-sort`)    | `SortableHeader` sets `aria-sort` ascending/descending/none on the active `<th>`; control is a real `<a>` link carrying the toggled query — keyboard-focusable + shareable, no JS |
| Status not color-only | `StatusBadge` = color dot + text label                                                                                                                                            |
| Chips                 | `<button aria-pressed>` in `role="group"` with `aria-label`; `:focus-visible` rings                                                                                               |
| Empty state           | `role="status"` message + "Clear filters" link (SCD-FLT-003)                                                                                                                      |
| Responsive            | Desktop `<table>`; mobile (`max-width:640px`) CSS-only card layout via `display:block` + `td::before { content: attr(data-label) }`; no JS detection                              |
| Row -> detail         | ID-cell `<Link>` to `/requirements/{id}` preserving `currentQuery` (SA6 may 404 until built)                                                                                      |

### Components / structure

| File                                                      | Purpose                                                   |
| --------------------------------------------------------- | --------------------------------------------------------- |
| `lib/url-filters.ts`                                      | Query<->state mapping, validation, serialization (shared) |
| `components/RequirementsTable/RequirementsTable.tsx`      | Server table                                              |
| `components/RequirementsTable/components/SortableHeader/` | `aria-sort` header link                                   |
| `components/RequirementsTable/components/StatusBadge/`    | Color + text status                                       |
| `components/RequirementsTable/components/EmptyState/`     | Accessible empty state                                    |
| `components/FilterChips/FilterChips.tsx`                  | Client multi-select (URL-driven)                          |
| `components/FilterChips/components/Chip/`                 | `aria-pressed` toggle button                              |
| `app/page.tsx`                                            | `await searchParams`, parse, filter+sort, render          |
| `app/page.module.css`                                     | Vertical stack layout                                     |

### @req mapping

| @req            | File(s)                                             |
| --------------- | --------------------------------------------------- |
| `SCD-TBL-001`   | `RequirementsTable.tsx`, `StatusBadge.tsx`          |
| `SCD-SORT-001`  | `SortableHeader.tsx`, `url-filters.ts`              |
| `SCD-FLT-001`   | `FilterChips.tsx`, `Chip.tsx`                       |
| `SCD-FLT-002`   | `url-filters.ts`, `FilterChips.tsx`, `app/page.tsx` |
| `SCD-FLT-003`   | `EmptyState.tsx`                                    |
| `SCD-RESP-001`  | `RequirementsTable.tsx` + module CSS                |
| `SCD-A11Y-001`  | table/header/badge/chips/empty-state                |
| `SCD-STATE-001` | `app/page.tsx` (Result error handling)              |

### Verification results

| Check            | Result                                                   |
| ---------------- | -------------------------------------------------------- |
| `pnpm typecheck` | PASS (0 errors, strict, no `any`)                        |
| `pnpm lint`      | PASS (0 errors; 3 acceptable `.cursor/hooks/*` warnings) |
| `pnpm build`     | PASS (`/` correctly dynamic `ƒ`)                         |

No `git` commit made (left for user to review).

---

## Import convention — same-layer relative paths

**Date**: 2026-06-27

### Change

Added a project-wide rule: within the same top-level layer (`lib/`, `components/`, `app/`), imports must use **relative** paths; the `@/` alias is reserved for **cross-layer** imports only.

### Rule location

- `.cursor/rules/sdd-core.mdc` — new section «Same-layer imports — relative paths only»
- `.cursor/rules/data-layer.mdc` — examples updated to show `./api/types` instead of `@/lib/api/types`

### Audit & fix

| Layer                          | Same-layer `@/` imports found                              | Action                                               |
| ------------------------------ | ---------------------------------------------------------- | ---------------------------------------------------- |
| `lib/`                         | `lib/url-filters.ts` (`@/lib/api/types`, `@/lib/coverage`) | Fixed → `./api/types`, `./coverage`                  |
| `lib/api/*`, `lib/coverage.ts` | —                                                          | Already relative                                     |
| `components/`                  | —                                                          | Cross-layer `@/lib/...` only (correct)               |
| `app/`                         | —                                                          | Cross-layer `@/lib/`, `@/components/` only (correct) |

---

## SA5 — Review bugfix (filters + sort toggle)

**Date**: 2026-06-27

### Bugs reported

1. **Sort toggle stuck** — repeated clicks on the same sortable column left the URL at `?order=desc`; asc ↔ desc did not toggle.
2. **Filter deselect stale table** — deselecting a type/status chip updated the URL (e.g. `?type=AR`) but the RSC table kept the previous row set (e.g. still FR+AR or all rows).

### Root causes

| Bug             | Root cause                                                                                                                                                                                                                       |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sort toggle     | `sortHref` returned an empty string when toggling back to default sort/order (`id`/`asc`). Next.js `<Link href="">` does not clear existing query params, so the second click was a no-op while the URL stayed at `?order=desc`. |
| Filter deselect | `FilterChips` called `router.replace(..., { scroll: false })` which updated the client URL but did not re-fetch the Server Component tree. The table kept rendering from stale `searchParams`.                                   |

### Fix

| File                                     | Change                                                                                                                               |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `lib/url-filters.ts`                     | `sortHref`: return `'?'` (not `''`) when serialized query is empty so Link navigation clears default-only params like `?order=desc`. |
| `components/FilterChips/FilterChips.tsx` | Call `router.refresh()` immediately after `router.replace` so the RSC page re-reads `await searchParams` and re-filters/sorts.       |

URL remains the single source of truth; no client React state for filters. `@req` annotations preserved.

### Verification

| Check                     | Result                                                                                                                       |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Browser — filter deselect | `?type=FR&type=AR` → click FR → URL `?type=AR`, table shows 2 AR rows only (AR-PERF-001, AR-SEC-001)                         |
| Browser — sort toggle     | `?order=desc` → click ID → URL `/`, rows asc (AR-PERF-001 first); click again → `?order=desc`, rows desc (FR-SCAN-003 first) |
| `pnpm typecheck`          | PASS                                                                                                                         |
| `pnpm lint`               | PASS (3 pre-existing hook warnings)                                                                                          |
| `pnpm build`              | PASS (`/` dynamic)                                                                                                           |

No `git` commit made (left for user review).

---
