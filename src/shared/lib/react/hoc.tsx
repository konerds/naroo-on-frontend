import {
  SuspenseProps,
  Suspense,
  forwardRef,
  ComponentType,
  ForwardedRef,
  createElement,
} from 'react';

export function withSuspense<TProps extends object>(
  cmp: ComponentType<TProps>,
  propsSuspense: SuspenseProps & {
    FallbackComponent?: ComponentType;
  },
) {
  const Output = forwardRef<ComponentType<TProps>, TProps>(
    (props, ref: ForwardedRef<ComponentType<TProps>>) =>
      createElement(
        Suspense,
        {
          fallback:
            propsSuspense.fallback ||
            (propsSuspense.FallbackComponent &&
              createElement(propsSuspense.FallbackComponent)),
        },
        createElement(cmp, { ...props, ref } as TProps),
      ),
  );
  Output.displayName = `withSuspense(${cmp.displayName || cmp.name || 'Undefined'})`;
  return Output;
}

export { withErrorBoundary } from 'react-error-boundary';
