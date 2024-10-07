import { withErrorBoundary, compose } from '@shared/lib/react';
import { HelmetProvider } from 'react-helmet-async';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from './router';
import { ErrorBox } from '@shared/ui/error';

const enhance = compose((component) =>
  withErrorBoundary(component, {
    FallbackComponent: ErrorBox,
  }),
);

export const Provider = enhance(() => (
  <>
    <HelmetProvider>
      <RecoilRoot>
        <BrowserRouter />
      </RecoilRoot>
    </HelmetProvider>
  </>
));
