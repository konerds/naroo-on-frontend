import { FC, useState } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useStringInput } from '../../../../../hooks';
import { showError, useSWRListLectureAll } from '../../../../../hooks/api';
import { toast } from 'react-toastify';
import stateToken from '../../../../../recoil/state-object-token/stateToken';

interface IPropsComponentFormUpdateImage {
  fieldType: string;
  lectureId: string;
  userField: string;
  imageIndex: number | null;
}

const ComponentFormUpdateImage: FC<IPropsComponentFormUpdateImage> = ({
  fieldType,
  lectureId,
  userField,
  imageIndex,
}) => {
  const token = useRecoilValue(stateToken);
  const { mutate: mutateLectureAll } = useSWRListLectureAll();
  const { value: preview, setValue: setPreview } = useStringInput(userField);
  const [updateToggle, setUpdateToggle] = useState<boolean>(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const handlerToggleUpdate = () => {
    setUpdateToggle(!updateToggle);
    setPreview(userField);
  };
  const handlerUpdateImage = async () => {
    try {
      setIsLoadingSubmit(true);
      if (!!!preview || preview === userField) {
        setUpdateToggle(!updateToggle);
        setPreview(userField);
        return;
      }
      const response = await axios.put(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/${lectureId}`,
        fieldType === 'img_description' && imageIndex !== null
          ? {
              [`${fieldType}_index`]: (imageIndex - 1).toString(),
              [fieldType]: preview,
            }
          : fieldType === 'thumbnail'
          ? { [fieldType]: preview }
          : {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        await mutateLectureAll();
        toast('성공적으로 이미지가 업데이트되었습니다', { type: 'success' });
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
          className="mt-[10px] w-full border-[1px] border-[#C4C4C4] p-[10px]"
          onSubmit={(event) => {
            event.preventDefault();
            handlerUpdateImage();
          }}
        >
          <div>
            <label htmlFor="image-file">
              {fieldType === 'thumbnail'
                ? '썸네일'
                : fieldType === 'img_description'
                ? '강의 설명'
                : ''}{' '}
              이미지 {imageIndex ? '#' + imageIndex + ' ' : ''}파일
            </label>
          </div>
          {!!preview && (
            <div className="my-[10px]">
              <img className="m-auto rounded-2xl" src={preview} />
            </div>
          )}
          <div className="block sm:flex sm:items-center">
            <input
              className="relative top-[5px] m-auto h-[32px] w-full px-[10px] disabled:opacity-50"
              type="file"
              disabled={isLoadingSubmit}
              onChange={(event) => {
                if (!!!event.target.files || !!!event.target.files[0]) {
                  return;
                }
                const imageFile = event.target.files[0];
                const fileReader = new FileReader();
                fileReader.readAsDataURL(imageFile);
                fileReader.onload = (readerEvent) => {
                  if (!!readerEvent.target) {
                    setPreview(readerEvent.target.result as string);
                  }
                };
              }}
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
                type="button"
                className="button-modify-cancel-admin h-[32px] w-[65px]"
                onClick={handlerToggleUpdate}
                disabled={isLoadingSubmit}
              >
                취소
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mt-[10px] flex w-full items-center border-[1px] border-[#C4C4C4] p-[10px]">
          <div className="w-full overflow-x-hidden">
            <div className="bg-white text-xs text-shuttle-gray">
              {fieldType === 'thumbnail'
                ? '썸네일 이미지 파일'
                : fieldType === 'img_description'
                ? `강의 설명 이미지 ${
                    !!imageIndex && imageIndex >= 0
                      ? '#' + imageIndex + ' '
                      : ''
                  }파일`
                : ''}
              {fieldType === 'thumbnail' && !!userField ? (
                <Link to={`/lecture/${lectureId}`}>
                  <img className="rounded-xl" src={userField} alt="lecture" />
                </Link>
              ) : (
                ''
              )}
              {fieldType === 'img_description' && !!userField ? (
                <img
                  className="mx-auto mt-[10px] rounded-xl"
                  src={userField}
                  alt="lecture_description_img"
                />
              ) : (
                ''
              )}
            </div>
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

export default ComponentFormUpdateImage;
