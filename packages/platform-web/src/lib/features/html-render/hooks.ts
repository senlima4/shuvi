import { IncomingMessage, ServerResponse } from 'http';
import {
  createSyncHook,
  createAsyncParallelHook,
  createAsyncSeriesWaterfallHook
} from '@shuvi/hook';
import { IContext } from '@shuvi/platform-shared/lib/runtime';
import { IServerMiddleware } from '@shuvi/service';
import { IDocumentProps } from './lib';

export type IRenderToHTML = (
  req: IncomingMessage,
  res: ServerResponse
) => Promise<string | null>;

const pageData = createAsyncParallelHook<
  void,
  IContext,
  Record<string, unknown>
>();
const renderToHTML = createAsyncSeriesWaterfallHook<IRenderToHTML>();
const modifyHtml = createAsyncSeriesWaterfallHook<IDocumentProps, IContext>();
const addMiddleware = createSyncHook<
  void,
  void,
  IServerMiddleware | IServerMiddleware[]
>();
export const extendedHooks = {
  pageData,
  renderToHTML,
  modifyHtml,
  addMiddleware
};