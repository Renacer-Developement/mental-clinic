# Mental Clinic monorepo

npm workspaces monorepo containing:

| Workspace | Path | Stack | Dev port |
| --- | --- | --- | --- |
| `@mental-clinic/backend` | `apps/backend` | Express + MongoDB | 10000 |
| `@mental-clinic/frontend` | `apps/frontend` | Angular 21 (SSR), public site | 4200 |
| `@mental-clinic/admin` | `apps/admin` | Angular 18, admin dashboard | 4201 |

## Setup

Install everything once from the repo root (a single `package-lock.json` lives at the root):

```bash
npm install
```

Add dependencies to a specific app with `-w`:

```bash
npm install <pkg> -w @mental-clinic/frontend
```

## Development

```bash
npm run dev            # all three apps in parallel
npm run dev:backend
npm run dev:frontend
npm run dev:admin
```

## Build

```bash
npm run build          # every workspace
npm run build:frontend
npm run build:admin
```

## Deployment

- `render.yaml` (root) defines the backend and frontend Render services using `rootDir`.
- Vercel projects must set **Root Directory** to the matching `apps/<name>` folder.
- GitHub config (`.github/`) lives at the root: the backend health-check workflow and Dependabot.
