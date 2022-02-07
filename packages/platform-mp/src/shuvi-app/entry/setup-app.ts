import { CLIENT_CONTAINER_ID } from '@shuvi/shared/lib/constants';
// renderer must be imported before application
// we need to init init renderer before import AppComponent
import { view } from '@shuvi/app/core/platform';
import { getAppData } from '@shuvi/platform-core';
import { IRouter } from '@shuvi/router/lib/types';
import { createApp } from '../application';

const appData = getAppData();
const { routeProps = {}, appState } = appData;

const app = createApp(
  {
    // @ts-ignore
    pageData: appData.pageData || {},
    routeProps
  },
  {
    async render({ appContext, AppComponent, router, appStore }) {
      const appContainer = document.getElementById(CLIENT_CONTAINER_ID)!;
      view.renderApp({
        AppComponent: AppComponent,
        router: router as any as IRouter,
        appData,
        appContainer,
        // @ts-ignore
        appContext,
        appStore
      });
    },
    appState
  }
);

const rerender = () => {
  app.rerender();
};

export { app, rerender };
