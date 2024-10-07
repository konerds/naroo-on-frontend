import { Helmet } from 'react-helmet-async';

export const Page404 = () => {
  return (
    <>
      <Helmet>
        <title>Page not found...</title>
      </Helmet>
      <div>
        <h1>404</h1>
      </div>
    </>
  );
};
