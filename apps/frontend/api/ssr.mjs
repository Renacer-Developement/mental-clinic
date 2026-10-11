// Vercel serverless entry for Angular SSR. Static files and prerendered pages are
// served straight from dist/<app>/browser; every other route is rewritten here
// (see vercel.json) so crawlers get the real page HTML instead of the SPA shell.
export { reqHandler as default } from '../dist/mental-clinic-fe/server/server.mjs';
