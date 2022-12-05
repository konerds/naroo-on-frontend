import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { FC, FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { MutatorCallback } from 'swr/dist/types';
import { IResources } from '../../../interfaces';

interface UpdateResourceFieldProps {
  token: string | null;
  setToken: (
    value: string | ((val: string | null) => string | null) | null,
  ) => void;
  type: string;
  content_id: string;
  content: string | null;
  mutate: (
    data?:
      | IResources[]
      | Promise<IResources[]>
      | MutatorCallback<IResources[]>
      | undefined,
    shouldRevalidate?: boolean | undefined,
  ) => Promise<IResources[] | undefined>;
  resourceIndex: number | null;
}

const UpdateResourceField: FC<UpdateResourceFieldProps> = ({
  token,
  setToken,
  type,
  content_id,
  content,
  mutate,
  resourceIndex,
}) => {
  const [addPreview, setAddPreview] = useState<any>('');
  const [preview, setPreview] = useState<any>(content);
  const [updateToggle, setUpdateToggle] = useState<boolean>(false);
  const onClickUpdateToggle = () => {
    setUpdateToggle(!updateToggle);
    setPreview(content);
  };
  const [isLoadingSubmitAdd, setIsLoadingSubmitAdd] = useState<boolean>(false);
  const onSubmitAddHandler = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setIsLoadingSubmitAdd(true);
      if (!addPreview) {
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/resource`,
        {
          type,
          content: addPreview,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 201) {
        setTimeout(() => {
          mutate();
          setAddPreview('');
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
        setIsLoadingSubmitAdd(false);
      }, 500);
    }
  };
  const [isLoadingSubmitUpdateResource, setIsLoadingSubmitUpdateResource] =
    useState<boolean>(false);
  const onSubmitUpdateResource = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setIsLoadingSubmitUpdateResource(true);
      if (!preview || preview === content) {
        setUpdateToggle(!updateToggle);
        setPreview(content);
        return;
      }

      const response = await axios.put(
        `${process.env.REACT_APP_BACK_URL}/resource`,
        {
          type,
          content_id,
          content: preview,
        },
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
        setIsLoadingSubmitUpdateResource(false);
      }, 500);
    }
  };
  const [isLoadingClickDeleteResource, setIsLoadingClickDeleteResource] =
    useState<boolean>(false);
  const onClickDeleteResource = async () => {
    try {
      setIsLoadingClickDeleteResource(true);
      const response = await axios.delete(
        `${process.env.REACT_APP_BACK_URL}/resource/${content_id}?type=${type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        setTimeout(() => {
          mutate();
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
        setIsLoadingClickDeleteResource(false);
      }, 500);
    }
  };
  return (
    <>
      {type === 'org_carousel' && +content_id === 0 && (
        <form className="w-full p-[10px]" onSubmit={onSubmitAddHandler}>
          {addPreview && (
            <div className="mb-[15px]">
              <img className="rounded-xl" src={addPreview} />
            </div>
          )}
          <div className="flex items-center mb-[10px]">
            <label
              className="min-w-max text-[16px] leading-[22px] m-[10px]"
              htmlFor="resource"
            >
              이미지 파일
            </label>
            <input
              className="w-full p-[10px] disabled:opacity-50"
              disabled={isLoadingSubmitAdd}
              type="file"
              onChange={(event) => {
                if (!event.target.files || !event.target.files[0]) {
                  return;
                }
                const imageFile = event.target.files[0];
                const fileReader = new FileReader();
                fileReader.readAsDataURL(imageFile);
                fileReader.onload = (readerEvent) => {
                  setAddPreview(readerEvent.target?.result);
                };
              }}
            />
          </div>
          <input
            type="submit"
            className="w-full h-[51px] text-[24px] font-semibold leading-[33px] bg-[#0D5B83] text-white mb-[12px] disabled:opacity-50"
            value="리소스 추가"
            disabled={isLoadingSubmitAdd}
          />
        </form>
      )}
      {updateToggle ? (
        <form
          className="items-center p-[10px]"
          onSubmit={onSubmitUpdateResource}
        >
          {preview && (
            <div className="mb-[29px]">
              <img className="rounded-xl" src={preview} />
            </div>
          )}
          <div className="flex w-full">
            <input
              className="w-full px-[10px] disabled:opacity-50"
              type="file"
              disabled={isLoadingSubmitUpdateResource}
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
              disabled={isLoadingSubmitUpdateResource}
            >
              수정
            </button>
            <button
              type="button"
              className="lg:w-[4vw] w-[8vw] box-border rounded-[4px] border-[1px] border-[#4DBFF0] h-[41px] lg:text-[14px] text-[1vw] font-semibold leading-[150%] bg-[#4DBFF0] text-white disabled:opacity-50"
              onClick={onClickUpdateToggle}
              disabled={isLoadingSubmitUpdateResource}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center w-full p-[10px]">
          <div className="w-full overflow-x-hidden">
            <div>
              {type === 'org_carousel' ? (
                <>{`#${
                  resourceIndex && resourceIndex >= 0 && resourceIndex
                }`}</>
              ) : (
                ''
              )}
              {preview && (
                <img className="rounded-xl" src={preview} alt="resource_img" />
              )}
            </div>
          </div>
          <FontAwesomeIcon
            className={`mx-[10px] ${
              isLoadingClickDeleteResource
                ? 'opacity-50 cursor-not-allowed pointer-events-none'
                : ''
            }`}
            icon={faEdit}
            onClick={onClickUpdateToggle}
          />
          {+content_id !== 0 && (
            <FontAwesomeIcon
              icon={faTrash}
              onClick={onClickDeleteResource}
              className={`${
                isLoadingClickDeleteResource
                  ? 'opacity-50 cursor-not-allowed pointer-events-none'
                  : ''
              }`}
            />
          )}
        </div>
      )}
    </>
  );
};

export default UpdateResourceField;
