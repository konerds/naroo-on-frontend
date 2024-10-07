export const ErrorBox = (props: {
  error: Error;
  resetErrorBoundary?: (...args: unknown[]) => void;
}) => {
  const { error } = props;
  console.error(error);
  return (
    <div>
      <h1>Something went wrong.</h1>
    </div>
  );
};
