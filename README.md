# SDD Navigator Dashboard

Next.js dashboard for SDD coverage: requirements, annotations, tasks, orphan detection, and stats from the [SDD Navigator API](spec/sdd-coverage-api.yaml).

**Live:** https://sdd-navigator-sable.vercel.app

## Modes

| Mode           | How                       | Data source           |
| -------------- | ------------------------- | --------------------- |
| Mock (default) | No env var                | `data/*.json` in repo |
| Live           | Set `NEXT_PUBLIC_API_URL` | Remote API (see spec) |

## Local run

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. Mock data is used unless `NEXT_PUBLIC_API_URL` is set.

## Verify

```bash
pnpm verify
```

Runs typecheck, lint, tests, `@req` coverage check, and production build.

## Deploy (Vercel)

Requires [Vercel CLI](https://vercel.com/docs/cli) ≥ 47 (`npm i -g vercel@latest` if outdated).

```bash
pnpm verify
npx vercel@latest deploy --prod -y
```

Project is linked to `alexey4717s-projects/sdd-navigator`. Production aliases include the live URL above.

## API spec

OpenAPI contract: [`spec/sdd-coverage-api.yaml`](spec/sdd-coverage-api.yaml)
