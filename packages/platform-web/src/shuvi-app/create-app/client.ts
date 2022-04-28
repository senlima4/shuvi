import UserAppComponent from '@shuvi/app/user/app';
import routes from '@shuvi/app/files/routes';
import {
  getRoutes,
  app as PlatformAppComponent
} from '@shuvi/app/core/platform';
import {
  IApplication,
  getModelManager,
  getErrorHandler,
  IAppState,
  IAppRenderFn,
  IApplicationCreaterClientContext,
  IAppRouteConfig
} from '@shuvi/platform-shared/esm/runtime';
import platform from '@shuvi/platform-shared/esm/runtime/platform';
import {
  createRouter,
  IRouter,
  createBrowserHistory,
  createHashHistory
} from '@shuvi/router';
import { historyMode } from '@shuvi/app/files/routerConfig';
import { History } from '@shuvi/router/lib/types';
import { SHUVI_ERROR_CODE } from '@shuvi/shared/lib/constants';

declare let __SHUVI: any;
let app: IApplication;
let appContext: IApplicationCreaterClientContext;
let appRouter: IRouter<IAppRouteConfig>;

export function createApp<
  Context extends IApplicationCreaterClientContext,
  Router extends IRouter<IAppRouteConfig>,
  CompType,
  AppState extends IAppState
>(
  context: Context,
  options: {
    render: IAppRenderFn<Context, Router, CompType>;
    appState?: AppState;
  }
) {
  // app is a singleton in client side
  if (app) {
    return app;
  }
  const modelManager = getModelManager(options.appState);
  let history: History;
  if (historyMode === 'hash') {
    history = createHashHistory();
  } else {
    history = createBrowserHistory();
  }
  const router = createRouter({
    history,
    routes: getRoutes(routes, context)
  }) as Router;
  router.afterEach(_current => {
    if (!_current.matches) {
      getErrorHandler(getModelManager()).errorHandler(
        SHUVI_ERROR_CODE.PAGE_NOT_FOUND
      );
    }
  });
  appRouter = router;
  appContext = context;
  app = platform({
    AppComponent: PlatformAppComponent,
    router,
    context,
    modelManager,
    render: options.render,
    UserAppComponent
  });
  return app;
}

if (module.hot) {
  module.hot.accept(
    [
      '@shuvi/app/user/app',
      '@shuvi/app/entry',
      '@shuvi/platform-shared/esm/runtime/platform',
      '@shuvi/app/files/routes',
      '@shuvi/app/user/runtime'
    ],
    async () => {
      const rerender = () => {
        const UserAppComponent = require('@shuvi/app/user/app').default;
        const routes = require('@shuvi/app/files/routes').default;
        appRouter.replaceRoutes(getRoutes(routes, appContext));
        app.rerender({ AppComponent: PlatformAppComponent, UserAppComponent });
      };
      // to solve routing problem, we need to rerender routes
      // wait navigation complete only rerender to ensure getInitialProps is called
      if (__SHUVI.router._pending) {
        const removelistener = __SHUVI.router.afterEach(() => {
          rerender();
          removelistener();
        });
      } else {
        rerender();
      }
    }
  );
}
