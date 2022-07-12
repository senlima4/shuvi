import { resolve, dirname, join } from 'path';

export const PACKAGE_DIR = resolve(__dirname, '..', '..', 'esm');

export const resolveAppFile = (...paths: string[]) =>
  `${resolve(PACKAGE_DIR, 'shuvi-app', ...paths)}`;

export const resolveDep = (module: string) => require.resolve(module);

export const resolveLib = (module: string) =>
  dirname(resolveDep(join(module, 'package.json')));