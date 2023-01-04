import * as React from 'react';
import axios from 'axios';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { KeyedMutator } from 'swr';
import { IResources } from '../../../interfaces';
import { showError } from '../../../hooks/api';
import { useStringInput } from '../../../hooks';

interface IPropsComponentFormUpdateResource {
  token: string | null;
  type: string;
  content_id: string;
  content: string;
  mutate: KeyedMutator<IResources[]>;
  resourceIndex: number | null;
}

const ComponentFormUpdateResource: React.FC<
  IPropsComponentFormUpdateResource
> = ({ token, type, content_id, content, mutate, resourceIndex }) => {
  const { value: addPreview, setValue: setAddPreview } = useStringInput('');
  const { value: preview, setValue: setPreview } = useStringInput(content);
  const [updateToggle, setUpdateToggle] = React.useState<boolean>(false);
  const [isLoadingSubmitAdd, setIsLoadingSubmitAdd] =
    React.useState<boolean>(false);
  const [isLoadingSubmitUpdateResource, setIsLoadingSubmitUpdateResource] =
    React.useState<boolean>(false);
  const [isLoadingClickDeleteResource, setIsLoadingClickDeleteResource] =
    React.useState<boolean>(false);
  const onClickUpdateToggle = () => {
    setUpdateToggle(!updateToggle);
    setPreview(content);
  };
  const onSubmitAddHandler = async () => {
    try {
      setIsLoadingSubmitAdd(true);
      if (!!!addPreview) {
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
        await mutate();
        setAddPreview('');
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingSubmitAdd(false);
    }
  };
  const onSubmitUpdateResource = async () => {
    try {
      setIsLoadingSubmitUpdateResource(true);
      if (!!!preview || preview === content) {
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
        await mutate();
        setUpdateToggle(!updateToggle);
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingSubmitUpdateResource(false);
    }
  };
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
        await mutate();
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingClickDeleteResource(false);
    }
  };
  return (
    <>
      {type === 'org_carousel' && +content_id === 0 && (
        <form
          className="w-full p-[10px]"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitAddHandler();
          }}
        >
          {!!addPreview && (
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
                if (!!!event.target.files || !!!event.target.files[0]) {
                  return;
                }
                const imageFile = event.target.files[0];
                const fileReader = new FileReader();
                fileReader.readAsDataURL(imageFile);
                fileReader.onload = (readerEvent) => {
                  if (!!readerEvent.target) {
                    setAddPreview(readerEvent.target.result as string);
                  }
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
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitUpdateResource();
          }}
        >
          {!!preview && (
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
              {type === 'org_carousel' && (
                <>{`#${
                  !!resourceIndex && resourceIndex >= 0 && resourceIndex
                }`}</>
              )}
              {!!preview && (
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
          {+content_id > 0 && (
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

export default ComponentFormUpdateResource;
