import { ComponentType } from 'react';

export function compose<Props extends object>(
  ...hocs: Array<(cmp: ComponentType<Props>) => ComponentType<Props>>
): (cmp: ComponentType<Props>) => ComponentType<Props> {
  return (cmp: ComponentType<Props>) =>
    hocs.reduceRight((output, hoc) => hoc(output), cmp);
}
