import { FC } from 'react';
import ComponentElementEditLecture from './lecture/edit/ComponentElementEditLecture';
import { useSWRListLectureAll } from '../../hooks/api';

interface IPropsComponentContainerEditLecture {}

const ComponentContainerEditLecture: FC<
  IPropsComponentContainerEditLecture
> = ({}) => {
  const { data: dataListLectureAll } = useSWRListLectureAll();
  return (
    <div className="flex items-center justify-center">
      <div>
        {dataListLectureAll && (
          <div className="grid grid-flow-row gap-y-10 md:grid-cols-1 md:gap-3 lg:grid-cols-1 lg:gap-6 xl:grid-cols-2 xl:gap-6 2xl:grid-cols-2 2xl:gap-6">
            {dataListLectureAll.map((lecture, index) => {
              return (
                <ComponentElementEditLecture key={index} lecture={lecture} />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentContainerEditLecture;
