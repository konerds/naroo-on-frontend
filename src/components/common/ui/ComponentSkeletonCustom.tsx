import * as React from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

interface IPropsComponentSkeletonCustom {
  className?: string;
  count?: number;
}

const ComponentSkeletonCustom: React.FC<IPropsComponentSkeletonCustom> = ({
  className,
  count,
}) => {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <Skeleton
        className={!!className ? className : undefined}
        count={!!count ? count : 1}
      />
    </SkeletonTheme>
  );
};

export default ComponentSkeletonCustom;
