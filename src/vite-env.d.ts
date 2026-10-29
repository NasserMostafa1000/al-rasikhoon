/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ASK_API?: string;
  readonly VITE_CASCO_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
