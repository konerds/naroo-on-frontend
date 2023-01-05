import * as React from 'react';
import Select from 'react-select';
import useSWR from 'swr';
import moment from 'moment';
import ComponentUpdateStatus from './lecture/permission/ComponentFormUpdateStatus';
import { ILectureInListAdmin } from '../../interfaces';
import { axiosGetfetcher } from '../../hooks/api';

interface IPropsComponentContainerPermissionLecture {
  token: string | null;
  studentOptions: { value: string; label: string }[] | [];
  lectureOptions: { value: string; label: string }[] | [];
}

const ComponentContainerPermissionLecture: React.FC<
  IPropsComponentContainerPermissionLecture
> = ({ token, studentOptions, lectureOptions }) => {
  const { data: lectureStatusesData, mutate: lectureStatusesMutate } = useSWR<
    ILectureInListAdmin[]
  >(
    !!token ? `${process.env.REACT_APP_BACK_URL}/lecture/admin/status` : null,
    () =>
      axiosGetfetcher(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/status`,
        token,
      ),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const filters = [
    { value: 'lecture', label: '강의 별' },
    { value: 'student', label: '학생 별' },
  ];
  const [selectedFilter, setSelectedFilter] = React.useState<{
    value: string;
    label: string;
  }>();
  const [lectureFilter, setLectureFilter] = React.useState<{
    value: string;
    label: string;
  }>();
  const [studentFilter, setStudentFilter] = React.useState<{
    value: string;
    label: string;
  }>();
  const onHandleFilterChange = React.useCallback(
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
  const onHandleLectureChange = React.useCallback(
    (changedOption: any) => {
      setLectureFilter(changedOption);
    },
    [lectureOptions],
  );
  const onHandleUserChange = React.useCallback(
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
        lectureStatusesData &&
        lectureStatusesData.map((lectureStatus, index) => {
          if (lectureFilter) {
            if (lectureFilter.value === lectureStatus.lecture_id) {
              return (
                <div key={index} className="my-[20px] border-[1px] p-[15px]">
                  <div className="w-full">{lectureStatus.student_nickname}</div>
                  <div className="w-full">{lectureStatus.student_email}</div>
                  <div className="ml-auto mr-0">
                    <ComponentUpdateStatus
                      token={token}
                      studentId={lectureStatus.student_id}
                      lectureId={lectureStatus.lecture_id}
                      status={lectureStatus.status}
                      mutate={lectureStatusesMutate}
                    />
                  </div>
                </div>
              );
            }
          }
        })}
      {selectedFilter &&
        selectedFilter.value === 'student' &&
        lectureStatusesData &&
        lectureStatusesData.map((lectureStatus, index) => {
          if (studentFilter) {
            if (studentFilter.value === lectureStatus.student_id) {
              return (
                <div
                  key={index}
                  className="border-[1px] border-black my-[20px] p-[10px]"
                >
                  <div className="mb-[5px] w-full">{lectureStatus.title}</div>
                  <div className="w-full text-xs">
                    {'강사 이름 : ' + lectureStatus.teacher_nickname}
                  </div>
                  <div className="w-full text-xs">
                    {!!!lectureStatus.expired && (
                      <div>강의 만료 일시가 설정되어 있지 않습니다</div>
                    )}
                    {!!lectureStatus.expired && (
                      <div>
                        {'강의 만료 일시 : ' +
                          moment(lectureStatus.expired).format(
                            'YYYY-MM-DD HH:mm:ss',
                          )}
                      </div>
                    )}
                  </div>
                  <div className="my-[10px] flex flex-wrap items-center w-full justify-evenly">
                    {lectureStatus.thumbnail && (
                      <img
                        className="w-full md:w-[600px] rounded-full border-[1px]"
                        src={lectureStatus.thumbnail}
                      />
                    )}
                  </div>
                  <div className="ml-auto mr-0">
                    <ComponentUpdateStatus
                      token={token}
                      studentId={lectureStatus.student_id}
                      lectureId={lectureStatus.lecture_id}
                      status={lectureStatus.status}
                      mutate={lectureStatusesMutate}
                    />
                  </div>
                </div>
              );
            }
          }
        })}
    </>
  );
};

export default ComponentContainerPermissionLecture;
