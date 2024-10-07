import { Helmet } from 'react-helmet-async';

export const PageBase = () => {
  return (
    <>
      <Helmet>
        <title>Base</title>
      </Helmet>
      <div>
        <h1>Home</h1>
      </div>
    </>
  );
};
