import * as React from 'react';
import axios from 'axios';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { KeyedMutator } from 'swr';
import { useStringInput } from '../../../../../hooks';
import { showError } from '../../../../../hooks/api';
import { ILectureInList } from '../../../../../interfaces';

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
          className="w-full items-center p-[10px] border-[1px] border-[#C4C4C4]"
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
            <div className="mb-[29px]">
              <img className="rounded-xl" src={preview} />
            </div>
          )}
          <div className="flex">
            <input
              className="w-full px-[10px] disabled:opacity-50"
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
            <button
              className="mx-[10px] lg:w-[4vw] w-[8vw] box-border rounded-[4px] border-[1px] border-[#4DBFF0] h-[41px] lg:text-[14px] text-[1vw] font-semibold leading-[150%] bg-[#4DBFF0] text-white disabled:opacity-50"
              type="submit"
              disabled={isLoadingSubmit}
            >
              수정
            </button>
            <button
              type="button"
              className="lg:w-[4vw] w-[8vw] box-border rounded-[4px] border-[1px] border-[#4DBFF0] h-[41px] lg:text-[14px] text-[1vw] font-semibold leading-[150%] bg-[#4DBFF0] text-white disabled:opacity-50"
              onClick={onClickUpdateToggle}
              disabled={isLoadingSubmit}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center p-[10px] w-full border-[1px] border-[#C4C4C4]">
          <div className="w-full overflow-x-hidden">
            <div className="text-xs bg-white text-shuttle-gray">
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
                  className="rounded-xl"
                  src={userField}
                  alt="lecture_description_img"
                />
              ) : (
                ''
              )}
            </div>
          </div>
          <FontAwesomeIcon
            className="mx-[10px]"
            icon={faEdit}
            onClick={onClickUpdateToggle}
          />
        </div>
      )}
    </>
  );
};

export default ComponentFormUpdateImage;