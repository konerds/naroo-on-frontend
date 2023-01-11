import * as React from 'react';
import axios from 'axios';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { KeyedMutator } from 'swr';
import { useStringInput } from '../../../../../hooks';
import { showError } from '../../../../../hooks/api';
import { ILectureInList } from '../../../../../interfaces';
import { toast } from 'react-toastify';

interface IPropsComponentFormUpdateImage {
  token: string | null;
  fieldType: string;
  lectureId: string;
  userField: string;
  mutate: KeyedMutator<ILectureInList[]>;
  imageIndex: number | null;
}

const ComponentFormUpdateImage: React.FC<IPropsComponentFormUpdateImage> = ({
  token,
  fieldType,
  lectureId,
  userField,
  mutate,
  imageIndex,
}) => {
  const { value: preview, setValue: setPreview } = useStringInput(userField);
  const [updateToggle, setUpdateToggle] = React.useState<boolean>(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = React.useState<boolean>(false);
  const onClickUpdateToggle = () => {
    setUpdateToggle(!updateToggle);
    setPreview(userField);
  };
  const onSubmitUpdateImage = async () => {
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
        await mutate();
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
            onSubmitUpdateImage();
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
            <div className="mt-[5px] mb-[10px] flex items-center justify-end sm:justify-start">
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
                onClick={onClickUpdateToggle}
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
            onClick={onClickUpdateToggle}
          />
        </div>
      )}
    </>
  );
};

export default ComponentFormUpdateImage;
