import * as React from 'react';
import axios from 'axios';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { KeyedMutator } from 'swr';
import { useStringInput } from '../../../../../hooks';
import { ILectureInList } from '../../../../../interfaces';
import { showError } from '../../../../../hooks/api';
import { toast } from 'react-toastify';

interface IPropsComponentFormUpdateLecture {
  token: string | null;
  fieldType: string;
  lectureId: string;
  userField: string;
  mutate: KeyedMutator<ILectureInList[]>;
}

const ComponentFormUpdateLecture: React.FC<
  IPropsComponentFormUpdateLecture
> = ({ token, fieldType, lectureId, userField, mutate }) => {
  const [updateToggle, setUpdateToggle] = React.useState<boolean>(false);
  const {
    value: updateFieldName,
    setValue: setUpdateFieldName,
    onChange: onChangeUpdateFieldName,
  } = useStringInput('');
  const [isLoadingSubmit, setIsLoadingSubmit] = React.useState<boolean>(false);
  const onClickUpdateToggle = () => {
    setUpdateToggle(!updateToggle);
    setUpdateFieldName(userField);
  };
  const onSubmitUpdateField = async () => {
    try {
      setIsLoadingSubmit(true);
      if (!updateFieldName || updateFieldName === userField) {
        setUpdateToggle(!updateToggle);
        setUpdateFieldName(userField);
        return;
      }
      const response = await axios.put(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/${lectureId}`,
        {
          [fieldType]: updateFieldName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        await mutate();
        toast('성공적으로 강의 정보가 업데이트되었습니다', { type: 'success' });
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
            onSubmitUpdateField();
          }}
        >
          <input
            className="w-full h-[32px] border-[1px] box-border rounded-[10px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[0.875rem] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white px-[20px] disabled:opacity-50"
            type="text"
            value={updateFieldName}
            onChange={onChangeUpdateFieldName}
            disabled={isLoadingSubmit}
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
              className="w-[65px] h-[32px] button-modify-cancel-admin"
              onClick={onClickUpdateToggle}
              disabled={isLoadingSubmit}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-[10px] flex items-center">
          <div className="w-full flex items-center overflow-hidden rounded-[10px] text-gray-200 bg-harp p-[10px] text-xs">
            {`${
              (fieldType === 'thumbnail'
                ? '썸네일 URL : '
                : fieldType === 'expired'
                ? '강의 만료 일시 : '
                : fieldType === 'title'
                ? '강의 제목 : '
                : fieldType === 'description'
                ? '강의 설명 : '
                : fieldType === 'video_title'
                ? '강의 영상 제목 : '
                : fieldType === 'video_url'
                ? '강의 영상 URL : '
                : '') + (!!userField && userField)
            }`}
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

export default ComponentFormUpdateLecture;
