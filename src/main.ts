import { createSSRApp } from 'vue';
import * as Pinia from 'pinia';
import App from './App.vue';
import Container from '@/components/container.vue';
import UnAuthorized from '@/components/unAuthorized.vue';
import mixin from '@/hooks/useMixin';
import { afterTokenHooks, afterUserInfoHooks } from '@/hooks/authorization';

export function createApp() {
  const app = createSSRApp(App);
  app.component('Container', Container);
  app.component('UnAuthorized', UnAuthorized);

  app.use(Pinia.createPinia());
  app.mixin(mixin);

  app.provide('useAfterToken', afterTokenHooks);
  app.provide('useAfterUserInfo', afterUserInfoHooks);
  return {
    app,
    Pinia
  };
}
