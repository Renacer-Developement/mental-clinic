# Mental Clinic monorepo

[pnpm](https://pnpm.io) workspaces monorepo containing:

| Workspace | Path | Stack | Dev port |
| --- | --- | --- | --- |
| `@mental-clinic/backend` | `apps/backend` | Express + MongoDB | 10000 |
| `@mental-clinic/frontend` | `apps/frontend` | Angular 21 (SSR), public site | 4200 |
| `@mental-clinic/admin` | `apps/admin` | Angular 18, admin dashboard | 4201 |

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
```

## Build

```bash
pnpm build          # every workspace
pnpm build:frontend
pnpm build:admin
```

## Deployment

- `render.yaml` (root) defines the backend and frontend Render services using `rootDir`.
- Vercel projects must set **Root Directory** to the matching `apps/<name>` folder.
- GitHub config (`.github/`) lives at the root: the backend health-check workflow and Dependabot.
