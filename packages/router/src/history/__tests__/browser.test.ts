/**
 * @jest-environment jsdom
 */

import { createBrowserHistory } from '..';

import InitialLocationDefaultKey from './TestSequences/InitialLocationDefaultKey.js';
import PushNewLocation from './TestSequences/PushNewLocation.js';
import PushSamePath from './TestSequences/PushSamePath.js';
import PushState from './TestSequences/PushState.js';
import PushMissingPathname from './TestSequences/PushMissingPathname.js';
import PushRelativePathname from './TestSequences/PushRelativePathname.js';
import ReplaceNewLocation from './TestSequences/ReplaceNewLocation.js';
import ReplaceSamePath from './TestSequences/ReplaceSamePath.js';
import ReplaceState from './TestSequences/ReplaceState.js';
import EncodedReservedCharacters from './TestSequences/EncodedReservedCharacters.js';
import GoBack from './TestSequences/GoBack.js';
import GoForward from './TestSequences/GoForward.js';
import BlockEverything from './TestSequences/BlockEverything.js';
import BlockPopWithoutListening from './TestSequences/BlockPopWithoutListening.js';
import { createRouter } from '../../router';
import { IRouter, IRouteRecord } from '../../types';

describe('a browser history', () => {
  let router: IRouter;
  beforeEach(() => {
    // @ts-ignore
    window.history.replaceState(null, null, '/');
    let history = createBrowserHistory();
    router = createRouter({ routes: [] as IRouteRecord[], history }).init();
  });

  it('knows how to create hrefs from location objects', () => {
    const { href } = router.resolve({
      pathname: '/the/path',
      search: '?the=query',
      hash: '#the-hash'
    });

    expect(href).toEqual('/the/path?the=query#the-hash');
  });

  it('knows how to create hrefs from strings', () => {
    const { href } = router.resolve('/the/path?the=query#the-hash');
    expect(href).toEqual('/the/path?the=query#the-hash');
  });

  it('does not encode the generated path', () => {
    const { href: encodedHref } = router.resolve({
      pathname: '/%23abc'
    });
    expect(encodedHref).toEqual('/%23abc');

    const { href: unencodedHref } = router.resolve({
      pathname: '/#abc'
    });
    expect(unencodedHref).toEqual('/#abc');
  });

  describe('the initial location', () => {
    it('has the "default" key', done => {
      InitialLocationDefaultKey(router, done);
    });
  });

  describe('push a new path', () => {
    it('calls change listeners with the new location', done => {
      PushNewLocation(router, done);
    });
  });

  describe('push the same path', () => {
    it('calls change listeners with the new location', done => {
      PushSamePath(router, done);
    });
  });

  describe('push state', () => {
    it('calls change listeners with the new location', done => {
      PushState(router, done);
    });
  });

  describe('push with no pathname', () => {
    it('reuses the current location pathname', done => {
      PushMissingPathname(router, done);
    });
  });

  describe('push with a relative pathname', () => {
    it('normalizes the pathname relative to the current location', done => {
      PushRelativePathname(router, done);
    });
  });

  describe('replace a new path', () => {
    it('calls change listeners with the new location', done => {
      ReplaceNewLocation(router, done);
    });
  });

  describe('replace the same path', () => {
    it('calls change listeners with the new location', done => {
      ReplaceSamePath(router, done);
    });
  });

  describe('replace state', () => {
    it('calls change listeners with the new location', done => {
      ReplaceState(router, done);
    });
  });

  describe('location created with encoded/unencoded reserved characters', () => {
    it('produces different location objects', done => {
      EncodedReservedCharacters(router, done);
    });
  });

  describe('back', () => {
    it('calls change listeners with the previous location', done => {
      GoBack(router, done);
    });
  });

  describe('forward', () => {
    it('calls change listeners with the next location', done => {
      GoForward(router, done);
    });
  });

  describe('block', () => {
    it('blocks all transitions', done => {
      BlockEverything(router, done);
    });
  });

  describe('block a POP without listening', () => {
    it('receives the next ({ action, location })', done => {
      BlockPopWithoutListening(router, done);
    });
  });
});
