import { lazy, createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { compose, withSuspense } from '@shared/lib/react';
import { keysRoute } from '@shared/lib/react';

const NotFound = lazy(() =>
  import('./ui').then((m) => ({ default: m.Page404 })),
);

const enhance = compose((cmp) => withSuspense(cmp, {}));

export const route404: RouteObject = {
  path: keysRoute.notFound(),
  element: createElement(enhance(NotFound)),
};
