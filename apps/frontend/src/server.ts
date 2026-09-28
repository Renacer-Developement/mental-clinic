import { resolve } from 'node:path';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';

// Resolved from CWD rather than import.meta.url: this project's browserslist
// targets Safari/iOS versions old enough that esbuild empties `import.meta`
// across the whole bundle (including the server output), so `import.meta.url`
// is unusable here. npm scripts always run with CWD at the project root.
const browserDistFolder = resolve(process.cwd(), 'dist/mental-clinic-fe/browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

// Only self-listen when run directly (e.g. `node dist/.../server/server.mjs`).
// The Angular build also imports this module in a worker to statically extract
// prerender routes — it must not bind a port in that context.
const isMain = process.argv[1]?.endsWith('server.mjs') ?? false;
if (isMain) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
