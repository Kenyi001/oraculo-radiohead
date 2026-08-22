/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CASANDRA_REGISTRY_ADDRESS?: string;
  readonly VITE_CASANDRA_REGISTRY_EXPLORER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
