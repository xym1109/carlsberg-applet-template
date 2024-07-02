/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_H5_DEV_URL: string;
  readonly VITE_APP_H5_PROD_URL: string;

  readonly VITE_APP_WX_DEV_URL: string;
  readonly VITE_APP_WX_PROD_URL: string;

  readonly VITE_APP_MY_DEV_URL: string;
  readonly VITE_APP_MY_PROD_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
