/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APPCHECK_WEB_SITE_KEY?: string;
  readonly VITE_APPCHECK_WEB_DEBUG?: string;
  readonly VITE_APPCHECK_NATIVE_DEBUG?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
