import * as React from 'react';
import axios from 'axios';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ILectureInListAdmin } from '../../../../interfaces';
import Select from 'react-select';
import { KeyedMutator } from 'swr';
import { showError } from '../../../../hooks/api';

interface IPropsComponentFormUpdateStatus {
  token: string | null;
  studentId: string;
  lectureId: string;
  status: string | null;
  mutate: KeyedMutator<ILectureInListAdmin[]>;
}

const ComponentFormUpdateStatus: React.FC<IPropsComponentFormUpdateStatus> = ({
  token,
  studentId,
  lectureId,
  status,
  mutate,
}) => {
  const [updateToggle, setUpdateToggle] = React.useState<boolean>(false);
  const [updateStatus, setUpdateStatus] = React.useState<string | null>(status);
  const [isLoadingSubmit, setIsLoadingSubmit] = React.useState<boolean>(false);
  const statusOptions = React.useMemo(() => {
    return [
      { value: null, label: '공개' },
      { value: 'apply', label: '승인 대기' },
      { value: 'accept', label: '승인 완료' },
      { value: 'reject', label: '승인 거부' },
      { value: 'invisible', label: '비공개' },
    ];
  }, []);
  const onHandleChange = React.useCallback(
    (changedOption: any) => {
      setUpdateStatus(changedOption.value);
    },
    [statusOptions],
  );
  const onClickUpdateToggle = () => {
    setUpdateToggle(!updateToggle);
    setUpdateStatus(status);
  };
  const onSubmitUpdateTag = async () => {
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
        await mutate();
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
            onSubmitUpdateTag();
          }}
        >
          <Select
            className="w-full text-xs text-gray-200 bg-harp disabled:opacity-50"
            options={statusOptions}
            onChange={onHandleChange}
            placeholder="수강 상태를 업데이트하세요"
            isDisabled={isLoadingSubmit}
          />
          <div className="flex justify-end sm:justify-start items-center mt-[5px] mb-[10px]">
            <button
              className="w-[65px] h-[32px] mx-[10px] button-modify-cancel-admin"
              type="submit"
              disabled={isLoadingSubmit}
            >
              수정
            </button>
            <button
              className="w-[65px] h-[32px] button-modify-cancel-admin relative"
              onClick={onClickUpdateToggle}
              disabled={isLoadingSubmit}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center w-full">
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
            className="ml-[10px] button-fa-icon-admin"
            icon={faEdit}
            onClick={onClickUpdateToggle}
          />
        </div>
      )}
    </>
  );
};

export default ComponentFormUpdateStatus;
