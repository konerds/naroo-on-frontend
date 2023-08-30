import { FC, useState, useMemo, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';
import { showError, useSWRListStatusLecture } from '../../../../hooks/api';
import { toast } from 'react-toastify';
import stateToken from '../../../../recoil/state-object-token/stateToken';
import { ILectureInListAdmin } from '../../../../interfaces';

interface IPropsComponentFormUpdateStatus {
  lectureStatus: ILectureInListAdmin;
}

const ComponentFormUpdateStatus: FC<IPropsComponentFormUpdateStatus> = ({
  lectureStatus,
}) => {
  const token = useRecoilValue(stateToken);
  const {
    student_id: studentId,
    lecture_id: lectureId,
    status,
  } = lectureStatus;
  const { mutate: mutateListStatusLecture } = useSWRListStatusLecture();
  const [updateToggle, setUpdateToggle] = useState<boolean>(false);
  const [updateStatus, setUpdateStatus] = useState<string | null>(status);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const statusOptions = useMemo(() => {
    return [
      { value: null, label: '공개' },
      { value: 'apply', label: '승인 대기' },
      { value: 'accept', label: '승인 완료' },
      { value: 'reject', label: '승인 거부' },
      { value: 'invisible', label: '비공개' },
    ];
  }, []);
  const handlerCallbackChange = useCallback(
    (changedOption: any) => {
      setUpdateStatus(changedOption.value);
    },
    [statusOptions],
  );
  const handlerToggleUpdate = () => {
    setUpdateToggle(!updateToggle);
    setUpdateStatus(status);
  };
  const handlerUpdateTag = async () => {
    try {
      setIsLoadingSubmit(true);
      if (updateStatus === status) {
        setUpdateToggle(!updateToggle);
        setUpdateStatus(status);
        return;
      }
      const response = await axios.put(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/status/${lectureId}?user_id=${studentId}`,
        {
          status: updateStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        await mutateListStatusLecture();
        toast('성공적으로 수강 상태가 업데이트되었습니다', { type: 'success' });
        setUpdateToggle(!updateToggle);
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingSubmit(false);
    }
  };
  return (
    <>
      {updateToggle ? (
        <form
          className="mt-[10px] block sm:flex sm:items-center"
          onSubmit={(event) => {
            event.preventDefault();
            handlerUpdateTag();
          }}
        >
          <Select
            className="w-full bg-harp text-xs text-gray-200 disabled:opacity-50"
            options={statusOptions}
            onChange={handlerCallbackChange}
            placeholder="수강 상태를 업데이트하세요"
            isDisabled={isLoadingSubmit}
          />
          <div className="mb-[10px] mt-[5px] flex items-center justify-end sm:justify-start">
            <button
              className="button-modify-cancel-admin mx-[10px] h-[32px] w-[65px]"
              type="submit"
              disabled={isLoadingSubmit}
            >
              수정
            </button>
            <button
              className="button-modify-cancel-admin relative h-[32px] w-[65px]"
              onClick={handlerToggleUpdate}
              disabled={isLoadingSubmit}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="flex w-full items-center">
          <div className="w-full text-right">
            상태 :
            {status === null
              ? ' 공개'
              : status === 'apply'
              ? ' 승인 대기'
              : status === 'accept'
              ? ' 승인 완료'
              : status === 'reject'
              ? ' 승인 거부'
              : status === 'invisible'
              ? ' 비공개'
              : ' 오류'}
          </div>
          <FontAwesomeIcon
            className="button-fa-icon-admin ml-[10px]"
            icon={faEdit}
            onClick={handlerToggleUpdate}
          />
        </div>
      )}
    </>
  );
};

export default ComponentFormUpdateStatus;
