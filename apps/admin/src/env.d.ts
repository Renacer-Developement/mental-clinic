declare interface Env {
  readonly NG_APP_API_URL: string;
  readonly NG_APP_FE_URL: string;
  [key: string]: string | undefined;
}

declare interface ImportMeta {
  readonly env: Env;
}
