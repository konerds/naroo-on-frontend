import { FC } from 'react';
import { MutatorCallback } from 'swr/dist/types';
import { ILectureInList, ITags } from '../../interfaces';
import LectureEditCard from './lecture/LectureEditCard';

interface LecturesEditProps {
  token: string | null;
  setToken: (
    value: string | ((val: string | null) => string | null) | null,
  ) => void;
  allLecturesData: ILectureInList[] | undefined;
  allLecturesMutate: (
    data?:
      | ILectureInList[]
      | Promise<ILectureInList[]>
      | MutatorCallback<ILectureInList[]>
      | undefined,
    shouldRevalidate?: boolean | undefined,
  ) => Promise<ILectureInList[] | undefined>;
  allTags: ITags[] | [];
}

const LectureEdit: FC<LecturesEditProps> = ({
  token,
  setToken,
  allLecturesData,
  allLecturesMutate,
  allTags,
}) => {
  return (
    <div className="flex items-center justify-center mt-[30px]">
      <div>
        {allLecturesData && (
          <div className="grid grid-flow-row 2xl:grid-cols-2 2xl:gap-6 xl:grid-cols-2 xl:gap-6 lg:grid-cols-1 lg:gap-6 md:grid-cols-1 md:gap-3">
            {allLecturesData.map((lecture) => {
              return (
                <LectureEditCard
                  key={lecture.id}
                  id={lecture.id}
                  title={lecture.title}
                  images={lecture.images}
                  description={lecture.description}
                  thumbnail={lecture.thumbnail}
                  teacherNickname={lecture.teacher_nickname}
                  status={null}
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

export default LectureEdit;
