import * as React from 'react';
import axios from 'axios';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { KeyedMutator } from 'swr';
import { IResources } from '../../../interfaces';
import { showError } from '../../../hooks/api';
import { useStringInput } from '../../../hooks';
import { toast } from 'react-toastify';

interface IPropsComponentFormUpdateResource {
  index: number;
  token: string | null;
  type: string;
  content_id: string;
  content: string;
  mutate: KeyedMutator<IResources[]>;
}

const ComponentFormUpdateResource: React.FC<
  IPropsComponentFormUpdateResource
> = ({ index, token, type, content_id, content, mutate }) => {
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
        toast('성공적으로 리소스가 등록되었습니다', { type: 'success' });
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
        toast('성공적으로 리소스가 업데이트되었습니다', { type: 'success' });
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
        toast('성공적으로 리소스가 삭제되었습니다', { type: 'success' });
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingClickDeleteResource(false);
    }
  };
  return (
    <>
      {['info_banner', 'org_carousel'].includes(type) && +index === 0 && (
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
          <div className="mb-[10px] flex items-center">
            <label
              className="m-[10px] min-w-max text-[1rem] leading-[1.375rem]"
              htmlFor="resource"
            >
              이미지 파일
            </label>
            <input
              className="w-full p-[10px] disabled:cursor-not-allowed disabled:opacity-50"
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
            className="mb-[12px] h-[51px] w-full cursor-pointer bg-[#0D5B83] text-[1.5rem] font-semibold leading-[2.0625rem] text-white disabled:cursor-not-allowed disabled:opacity-50"
            value="리소스 추가"
            disabled={!!!addPreview || isLoadingSubmitAdd}
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
          <div className="block max-w-[100vw] sm:flex sm:w-full sm:items-center">
            <input
              className="ml-auto mr-0 h-[32px] max-w-full border-[1px] disabled:cursor-not-allowed disabled:opacity-50"
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
            <div className="mt-[5px] mb-[10px] flex items-center justify-end sm:justify-start">
              <button
                className="button-modify-cancel-admin mx-[10px] h-[32px] w-[65px]"
                type="submit"
                disabled={isLoadingSubmitUpdateResource}
              >
                수정
              </button>
              <button
                type="button"
                className="button-modify-cancel-admin h-[32px] w-[65px]"
                onClick={onClickUpdateToggle}
                disabled={isLoadingSubmitUpdateResource}
              >
                취소
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="flex w-full items-center p-[10px]">
          <div className="w-full overflow-x-hidden">
            <div>
              {['info_banner', 'org_carousel'].includes(type) && (
                <>{`#${(+index + 1).toString()}`}</>
              )}
              {!!preview && (
                <img className="rounded-xl" src={preview} alt="resource_img" />
              )}
            </div>
          </div>
          <FontAwesomeIcon
            className={`button-fa-icon-admin ml-[15px] mr-[10px] ${
              isLoadingClickDeleteResource
                ? 'pointer-events-none cursor-not-allowed opacity-50'
                : ''
            }`}
            icon={faEdit}
            onClick={onClickUpdateToggle}
          />
          {+content_id > 0 && (
            <FontAwesomeIcon
              icon={faTrash}
              onClick={onClickDeleteResource}
              className={`button-fa-icon-admin ${
                isLoadingClickDeleteResource
                  ? 'pointer-events-none cursor-not-allowed opacity-50'
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
