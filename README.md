# Mental Clinic monorepo

[pnpm](https://pnpm.io) workspaces monorepo containing:

| Workspace | Path | Stack | Dev port |
| --- | --- | --- | --- |
| `@mental-clinic/backend` | `apps/backend` | Express + MongoDB | 10000 |
| `@mental-clinic/frontend` | `apps/frontend` | Angular 21 (SSR), public site | 4200 |
| `@mental-clinic/admin` | `apps/admin` | Angular 18, admin dashboard | 4201 |
| `@mental-clinic/site-<name>` | `apps/personal-websites/<name>` | Angular 20 (Angular 14 for `illya-skrypnyk`), specialists' personal sites | 4200 (`ng serve` default) |

Personal websites: `illya-skrypnyk`, `kravchenko-natalia`, `litvinchuk-olena`, `mykhailyshyna-natalia`,
`skrypnik-iryna`, `tarnovska-lilia`, `vorona-kateryna`.

## Setup

Install everything once from the repo root (a single `pnpm-lock.yaml` lives at the root):

```bash
corepack enable   # once per machine; provides the pinned pnpm version
pnpm install
```

pnpm is used instead of npm because the apps run different Angular majors (18 and 21);
pnpm keeps each app's dependency tree isolated, so they never resolve each other's packages.

Add dependencies to a specific app with `--filter`:

```bash
pnpm add <pkg> --filter @mental-clinic/frontend
```

## Development

```bash
pnpm dev            # all three apps in parallel
pnpm dev:backend
pnpm dev:frontend
pnpm dev:admin
pnpm --filter @mental-clinic/site-<name> start   # one personal website
```

## Build

```bash
pnpm build          # every workspace
pnpm build:frontend
pnpm build:admin
pnpm build:sites     # all personal websites
```

## Deployment

- `render.yaml` (root) defines the backend and frontend Render services using `rootDir`.
- Vercel projects must set **Root Directory** to the matching `apps/<name>` folder
  (or `apps/personal-websites/<name>` for a personal site; each has its own `vercel.json`).
- GitHub config (`.github/`) lives at the root: the backend health-check workflow and Dependabot.
