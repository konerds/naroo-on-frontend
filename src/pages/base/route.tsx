import { lazy, createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { compose, withSuspense } from '@shared/lib/react';
import { keysRoute } from '@shared/lib/react';

const Base = lazy(() => import('./ui').then((m) => ({ default: m.PageBase })));

const enhance = compose((cmp) => withSuspense(cmp, {}));

export const routeBase: RouteObject = {
  path: keysRoute.base,
  element: createElement(enhance(Base)),
};
