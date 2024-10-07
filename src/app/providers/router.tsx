import { createElement } from 'react';
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  redirect,
  useRouteError,
} from 'react-router-dom';
import { compose, withSuspense } from '@shared/lib/react';
import { keysRoute } from '@shared/lib/react';

import { routeBase } from '../../pages/base';
import { route404 } from '../../pages/404';

const enhance = compose((component) => withSuspense(component, {}));

const browserRouter = createBrowserRouter([
  {
    errorElement: createElement(() => {
      const e = useRouteError();
      if (e) {
        throw e;
      }
      return null;
    }),
    children: [
      {
        element: createElement(enhance(LayoutDefault)),
        children: [routeBase],
      },
      {
        element: createElement(enhance(LayoutDefault)),
        children: [route404],
      },
      {
        path: '*',
        loader: async () => redirect(keysRoute.notFound()),
      },
    ],
  },
]);

function LayoutDefault() {
  return (
    <>
      <header>This is header!</header>
      <main>
        <Outlet />
      </main>
      <footer>This is footer!</footer>
    </>
  );
}

export function BrowserRouter() {
  return <RouterProvider router={browserRouter} />;
}
