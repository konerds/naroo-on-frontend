import Select from 'react-select';
import { FC, useCallback, useState } from 'react';
import { useGetSWR } from '../../hooks/api';
import UpdateStatus from './lecture/UpdateStatus';
import { ILectureInListAdmin } from '../../interfaces';

interface LecturePermissionProps {
  token: string | null;
  setToken: (
    value: string | ((val: string | null) => string | null) | null,
  ) => void;
  studentOptions: { value: string; label: string }[] | [];
  lectureOptions: { value: string; label: string }[] | [];
}

const LecturePermission: FC<LecturePermissionProps> = ({
  token,
  setToken,
  studentOptions,
  lectureOptions,
}) => {
  const { data: lectureStatusesData, mutate: lectureStatusesMutate } =
    useGetSWR<ILectureInListAdmin[]>(
      `${process.env.REACT_APP_BACK_URL}/lecture/admin/status`,
      token,
      true,
    );
  const filters = [
    { value: 'lecture', label: '강의 별' },
    { value: 'student', label: '학생 별' },
  ];
  const [selectedFilter, setSelectedFilter] = useState<{
    value: string;
    label: string;
  }>();
  const [lectureFilter, setLectureFilter] = useState<{
    value: string;
    label: string;
  }>();
  const [studentFilter, setStudentFilter] = useState<{
    value: string;
    label: string;
  }>();
  const onHandleFilterChange = useCallback(
    (changedOption) => {
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
    (changedOption) => {
      setLectureFilter(changedOption);
    },
    [lectureOptions],
  );
  const onHandleUserChange = useCallback(
    (changedOption) => {
      setStudentFilter(changedOption);
    },
    [studentOptions],
  );
  return (
    <>
      <Select
        className="mt-[40px]"
        options={filters}
        value={selectedFilter}
        onChange={onHandleFilterChange}
        placeholder="필터를 선택하세요!"
      />
      {selectedFilter && selectedFilter.value === 'lecture' && (
        <Select
          className="mt-[20px]"
          options={lectureOptions}
          onChange={onHandleLectureChange}
          placeholder="강의를 선택하세요!"
        />
      )}
      {selectedFilter && selectedFilter.value === 'student' && (
        <Select
          className="mt-[20px]"
          options={studentOptions}
          onChange={onHandleUserChange}
          placeholder="유저를 선택하세요!"
        />
      )}
      {selectedFilter &&
        selectedFilter.value === 'lecture' &&
        lectureStatusesData &&
        lectureStatusesData.map((lectureStatus) => {
          if (lectureFilter) {
            if (lectureFilter.value === lectureStatus.lecture_id) {
              return (
                <div key={lectureStatus.student_id + lectureStatus.lecture_id}>
                  <div className="w-full mt-[40px]">
                    {lectureStatus.student_nickname}
                  </div>
                  <div className="w-full">{lectureStatus.student_email}</div>
                  <UpdateStatus
                    token={token}
                    setToken={setToken}
                    studentId={lectureStatus.student_id}
                    lectureId={lectureStatus.lecture_id}
                    status={lectureStatus.status}
                    mutate={lectureStatusesMutate}
                  />
                </div>
              );
            }
          }
        })}
      {selectedFilter &&
        selectedFilter.value === 'student' &&
        lectureStatusesData &&
        lectureStatusesData.map((lectureStatus) => {
          if (studentFilter) {
            if (studentFilter.value === lectureStatus.student_id) {
              return (
                <div
                  key={lectureStatus.student_id + lectureStatus.lecture_id}
                  className="border-[1px] border-black my-[20px] p-[10px]"
                >
                  <div className="w-full">{lectureStatus.title}</div>
                  <div className="w-full">
                    {lectureStatus.expired
                      ? lectureStatus.expired
                      : '만료 기간 없음'}{' '}
                  </div>
                  <div className="flex flex-wrap items-center w-full justify-evenly">
                    {lectureStatus.thumbnail && (
                      <img src={lectureStatus.thumbnail} width="200" />
                    )}
                    <div>{lectureStatus.teacher_nickname}</div>
                  </div>
                  <div className="w-full">
                    <UpdateStatus
                      token={token}
                      setToken={setToken}
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

export default LecturePermission;
