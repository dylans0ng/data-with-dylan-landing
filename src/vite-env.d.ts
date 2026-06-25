/// <reference types="vite/client" />

declare module "*.pdf?url" {
  const url: string;
  export default url;
}

interface ImportMetaEnv {
  readonly VITE_CONVERTKIT_API_KEY: string;
  readonly VITE_CONVERTKIT_FORM_ID: string;
  readonly VITE_CONVERTKIT_SQL_TAG_ID: string;
  readonly VITE_CONVERTKIT_PYTHON_TAG_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
