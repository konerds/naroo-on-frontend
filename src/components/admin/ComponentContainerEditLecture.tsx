import * as React from 'react';
import { KeyedMutator } from 'swr';
import { ILectureInList, ITags } from '../../interfaces';
import ComponentElementEditLecture from './lecture/edit/ComponentElementEditLecture';

interface IPropsComponentContainerEditLecture {
  token: string | null;
  setToken: (v: string | null) => void;
  allLecturesData: ILectureInList[] | undefined;
  allLecturesMutate: KeyedMutator<ILectureInList[]>;
  allTags: ITags[] | [];
}

const ComponentContainerEditLecture: React.FC<
  IPropsComponentContainerEditLecture
> = ({ token, setToken, allLecturesData, allLecturesMutate, allTags }) => {
  return (
    <div className="flex items-center justify-center">
      <div>
        {allLecturesData && (
          <div className="grid grid-flow-row 2xl:grid-cols-2 2xl:gap-6 xl:grid-cols-2 xl:gap-6 lg:grid-cols-1 lg:gap-6 md:grid-cols-1 md:gap-3 gap-y-10">
            {allLecturesData.map((lecture, index) => {
              return (
                <ComponentElementEditLecture
                  key={index}
                  id={lecture.id}
                  title={lecture.title}
                  images={lecture.images}
                  description={lecture.description}
                  thumbnail={lecture.thumbnail}
                  teacherNickname={lecture.teacher_nickname}
                  expired={lecture.expired}
                  tags={lecture.tags}
                  videoTitle={lecture.video_title}
                  videoUrl={lecture.video_url}
                  token={token}
                  setToken={setToken}
                  allTags={allTags}
                  mutate={allLecturesMutate}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentContainerEditLecture;
