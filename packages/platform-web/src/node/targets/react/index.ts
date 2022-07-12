import { createPlugin } from '@shuvi/service';
import bundlerPlugin from './bundler';
import { RedoxReactPlugin } from './redox-react';
import { resolveAppFile, resolveDep, resolveLib } from '../../paths';

const webReactMainPlugin = createPlugin({
  addRuntimeService: () => [
    {
      source: resolveAppFile('react/head/head'),
      exported: '{ default as Head }'
    },
    {
      source: resolveAppFile('react/dynamic'),
      exported: '{ default as dynamic }'
    },
    {
      source: resolveAppFile('react/useLoaderData'),
      exported: '{ useLoaderData }'
    },
    {
      source: resolveLib('@shuvi/router-react'),
      exported: '{ useParams, useRouter, useCurrentRoute, RouterView }'
    },
    {
      source: resolveAppFile('react/Link'),
      exported: '{ Link }'
    }
  ]
});
const platformWebReact = () => {
  return {
    plugins: [webReactMainPlugin, bundlerPlugin, RedoxReactPlugin],
    platformModule: resolveAppFile('react/index'),
    polyfills: [
      resolveDep('react-app-polyfill/ie11'),
      resolveDep('react-app-polyfill/stable')
    ]
  };
};

export default platformWebReact;