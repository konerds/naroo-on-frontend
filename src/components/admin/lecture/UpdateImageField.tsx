import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { FC, FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MutatorCallback } from 'swr/dist/types';
import { ILectureInList } from '../../../interfaces';

interface UpdateImageFieldProps {
  token: string | null;
  setToken: (
    value: string | ((val: string | null) => string | null) | null,
  ) => void;
  fieldType: string;
  lectureId: string;
  userField: string | null;
  mutate: (
    data?:
      | ILectureInList[]
      | Promise<ILectureInList[]>
      | MutatorCallback<ILectureInList[]>
      | undefined,
    shouldRevalidate?: boolean | undefined,
  ) => Promise<ILectureInList[] | undefined>;
  imageIndex: number | null;
}

const UpdateImageField: FC<UpdateImageFieldProps> = ({
  token,
  setToken,
  fieldType,
  lectureId,
  userField,
  mutate,
  imageIndex,
}) => {
  const [preview, setPreview] = useState<any>(userField);
  const [updateToggle, setUpdateToggle] = useState<boolean>(false);
  const onClickUpdateToggle = () => {
    setUpdateToggle(!updateToggle);
    setPreview(userField);
  };
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const onSubmitUpdateImage = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setIsLoadingSubmit(true);
      if (!preview || preview === userField) {
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
        setTimeout(() => {
          mutate();
          setUpdateToggle(!updateToggle);
        }, 500);
      }
    } catch (error: any) {
      const messages = error.response.data.message;
      if (Array.isArray(messages)) {
        messages.map((message) => {
          toast.error(message);
        });
      } else {
        toast.error(messages);
      }
    } finally {
      setTimeout(() => {
        setIsLoadingSubmit(false);
      }, 500);
    }
  };
  return (
    <>
      {updateToggle ? (
        <form
          className="w-full items-center p-[10px] border-[1px] border-[#C4C4C4]"
          onSubmit={onSubmitUpdateImage}
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
          {preview && (
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
                if (!event.target.files || !event.target.files[0]) {
                  return;
                }
                const imageFile = event.target.files[0];
                const fileReader = new FileReader();
                fileReader.readAsDataURL(imageFile);
                fileReader.onload = (readerEvent) => {
                  setPreview(readerEvent.target?.result);
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
                    imageIndex ? '#' + imageIndex + ' ' : ''
                  }파일`
                : ''}
              {fieldType === 'thumbnail' && userField ? (
                <Link to={`/lecture/${lectureId}`}>
                  <img className="rounded-xl" src={userField} alt="lecture" />
                </Link>
              ) : (
                ''
              )}
              {fieldType === 'img_description' && userField ? (
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

export default UpdateImageField;
