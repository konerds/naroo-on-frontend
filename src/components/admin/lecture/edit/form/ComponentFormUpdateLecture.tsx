import { FC, useState } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useStringInput } from '../../../../../hooks';
import { showError, useSWRListLectureAll } from '../../../../../hooks/api';
import { toast } from 'react-toastify';
import stateToken from '../../../../../recoil/state-object-token/stateToken';

interface IPropsComponentFormUpdateLecture {
  fieldType: string;
  lectureId: string;
  userField: string;
}

const ComponentFormUpdateLecture: FC<IPropsComponentFormUpdateLecture> = ({
  fieldType,
  lectureId,
  userField,
}) => {
  const token = useRecoilValue(stateToken);
  const { mutate: mutateLectureAll } = useSWRListLectureAll();
  const [updateToggle, setUpdateToggle] = useState<boolean>(false);
  const {
    value: updateFieldName,
    setValue: setUpdateFieldName,
    onChange: onChangeUpdateFieldName,
  } = useStringInput('');
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const handlerClickToggleUpdate = () => {
    setUpdateToggle(!updateToggle);
    setUpdateFieldName(userField);
  };
  const handlerUpdateField = async () => {
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
        await mutateLectureAll();
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
    <div className="bg-white text-xs text-shuttle-gray">
      {updateToggle ? (
        <form
          className="mt-[10px] block sm:flex sm:items-center"
          onSubmit={(event) => {
            event.preventDefault();
            handlerUpdateField();
          }}
        >
          <input
            className="box-border h-[32px] w-full rounded-[10px] border-[1px] border-[#DCDEE2] bg-[#F3FBFE] px-[20px] py-[10px] text-[0.875rem] font-medium placeholder-[#DCDEE2] focus:border-[#00A0E9] focus:bg-white focus:outline-none disabled:opacity-50"
            type="text"
            value={updateFieldName}
            onChange={onChangeUpdateFieldName}
            disabled={isLoadingSubmit}
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
              className="button-modify-cancel-admin h-[32px] w-[65px]"
              onClick={handlerClickToggleUpdate}
              disabled={isLoadingSubmit}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-[10px] flex items-center">
          <div className="flex w-full items-center overflow-hidden rounded-[10px] bg-harp p-[10px] text-xs text-gray-200">
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
            className="button-fa-icon-admin ml-[10px]"
            icon={faEdit}
            onClick={handlerClickToggleUpdate}
          />
        </div>
      )}
    </div>
  );
};

export default ComponentFormUpdateLecture;
