import path from 'path';
import fse from 'fs-extra';
import { IConfig } from '@shuvi/types';
import formatWebpackMessages from '@shuvi/toolpack/lib/utils/formatWebpackMessages';
import { Api } from '../api/api';
import { getBundler } from '../bundler/bundler';
import { Renderer } from '../renderer';
import { BUILD_CLIENT_DIR } from '../constants';

export interface IBuildOptions {
  target: 'spa' | 'ssr';
}

const defaultBuildOptions = {
  target: 'ssr',
} as const;

async function bundle({ api }: { api: Api }) {
  const bundler = getBundler(api);
  const result = await bundler.build();
  const messages = formatWebpackMessages(result);

  // If errors exist, only show errors.
  if (messages.errors.length) {
    // Only keep the first error. Others are often indicative
    // of the same problem, but confuse the reader with noise.
    throw new Error(messages.errors[0]);
  }

  // Show warnings if no errors were found.
  if (messages.warnings.length) {
    console.log('Compiled with warnings.\n');
    console.log(messages.warnings.join('\n\n'));
  }
}

function copyPublicFolder(api: Api) {
  fse.copySync(
    api.paths.publicDir,
    path.join(api.paths.buildDir, BUILD_CLIENT_DIR),
    {
      dereference: true,
    }
  );
}

async function buildHtml({
  api,
  pathname,
  filename,
}: {
  api: Api;
  pathname: string;
  filename: string;
}) {
  const html = await new Renderer({ api }).renderDocument({
    url: pathname,
  });
  await fse.writeFile(
    path.resolve(api.paths.buildDir, BUILD_CLIENT_DIR, filename),
    html
  );
}

export async function build(
  config: IConfig,
  options: Partial<IBuildOptions> = {}
) {
  const opts: IBuildOptions = {
    ...defaultBuildOptions,
    ...options,
  };
  const api = new Api({ mode: 'production', config });

  // generate application
  await api.buildApp();

  // Remove all content but keep the directory so that
  // if you're in it, you don't end up in Trash
  fse.emptyDirSync(api.paths.buildDir);

  // Merge with the public folder
  copyPublicFolder(api);

  // transpile the application
  await bundle({ api });

  if (opts.target === 'spa') {
    await buildHtml({ api, pathname: '/', filename: 'index.html' });
  }
}