import { FC, useState, useCallback } from 'react';
import Select from 'react-select';
import moment from 'moment';
import ComponentFormUpdateStatus from './lecture/permission/ComponentFormUpdateStatus';
import { useSWRListStatusLecture } from '../../hooks/api';
import { IObjectOption } from '../../interfaces';

interface IPropsComponentContainerPermissionLecture {
  studentOptions: IObjectOption[] | [];
  lectureOptions: IObjectOption[] | [];
}

const ComponentContainerPermissionLecture: FC<
  IPropsComponentContainerPermissionLecture
> = ({ studentOptions, lectureOptions }) => {
  const { data: dataListStatusLecture } = useSWRListStatusLecture();
  const filters = [
    { value: 'lecture', label: '강의 별' },
    { value: 'student', label: '학생 별' },
  ];
  const [selectedFilter, setSelectedFilter] = useState<IObjectOption>();
  const [lectureFilter, setLectureFilter] = useState<IObjectOption>();
  const [studentFilter, setStudentFilter] = useState<IObjectOption>();
  const onHandleFilterChange = useCallback(
    (changedOption: any) => {
      setSelectedFilter(changedOption);
      if (changedOption.value === 'lecture') {
        setStudentFilter({ value: '', label: '' });
      } else if (changedOption.value === 'student') {
        setLectureFilter({ value: '', label: '' });
      }
    },
    [filters],
  );
  const onHandleLectureChange = useCallback(
    (changedOption: any) => {
      setLectureFilter(changedOption);
    },
    [lectureOptions],
  );
  const onHandleUserChange = useCallback(
    (changedOption: any) => {
      setStudentFilter(changedOption);
    },
    [studentOptions],
  );
  return (
    <>
      <Select
        options={filters}
        value={selectedFilter}
        onChange={onHandleFilterChange}
        placeholder="필터를 선택하세요"
      />
      {selectedFilter && selectedFilter.value === 'lecture' && (
        <Select
          className="mt-[20px]"
          options={lectureOptions}
          onChange={onHandleLectureChange}
          placeholder="강의를 선택하세요"
        />
      )}
      {selectedFilter && selectedFilter.value === 'student' && (
        <Select
          className="mt-[20px]"
          options={studentOptions}
          onChange={onHandleUserChange}
          placeholder="유저를 선택하세요"
        />
      )}
      {selectedFilter &&
        selectedFilter.value === 'lecture' &&
        dataListStatusLecture &&
        dataListStatusLecture.map((lectureStatus, index) => {
          if (lectureFilter) {
            if (lectureFilter.value === lectureStatus.lecture_id) {
              return (
                <div key={index} className="my-[20px] border-[1px] p-[15px]">
                  <div className="block w-full overflow-hidden text-ellipsis whitespace-nowrap">
                    {lectureStatus.student_nickname}
                  </div>
                  <div className="block w-full overflow-hidden text-ellipsis whitespace-nowrap">
                    {lectureStatus.student_email}
                  </div>
                  <div className="ml-auto mr-0">
                    <ComponentFormUpdateStatus lectureStatus={lectureStatus} />
                  </div>
                </div>
              );
            }
          }
        })}
      {selectedFilter &&
        selectedFilter.value === 'student' &&
        dataListStatusLecture &&
        dataListStatusLecture.map((lectureStatus, index) => {
          return (
            <>
              {studentFilter &&
              studentFilter.value === lectureStatus.student_id ? (
                <div
                  key={index}
                  className="my-[20px] border-[1px] border-black p-[10px]"
                >
                  <div className="mb-[5px] w-full">{lectureStatus.title}</div>
                  <div className="w-full text-xs">
                    {'강사 이름 : ' + lectureStatus.teacher_nickname}
                  </div>
                  <div className="w-full text-xs">
                    {lectureStatus.expired ? (
                      <div>
                        {'강의 만료 일시 : ' +
                          moment(lectureStatus.expired).format(
                            'YYYY-MM-DD HH:mm:ss',
                          )}
                      </div>
                    ) : (
                      <div>강의 만료 일시가 설정되어 있지 않습니다</div>
                    )}
                  </div>
                  <div className="my-[10px] flex w-full flex-wrap items-center justify-evenly">
                    {lectureStatus.thumbnail ? (
                      <img
                        className="w-full rounded-full border-[1px] md:w-[600px]"
                        src={lectureStatus.thumbnail}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="ml-auto mr-0">
                    <ComponentFormUpdateStatus lectureStatus={lectureStatus} />
                  </div>
                </div>
              ) : (
                <></>
              )}
            </>
          );
        })}
    </>
  );
};

export default ComponentContainerPermissionLecture;
