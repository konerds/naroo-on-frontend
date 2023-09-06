import { FC, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { showError, useSWRListResourceAll } from '../../../hooks/api';
import { toast } from 'react-toastify';
import stateToken from '../../../recoil/state-object-token/stateToken';

interface IPropsComponentFormUpdateResource {
  index: number;
  type: string;
  content_id: string;
  content: string;
}

const ComponentFormUpdateResource: FC<IPropsComponentFormUpdateResource> = ({
  index,
  type,
  content_id,
  content,
}) => {
  const token = useRecoilValue(stateToken);
  const { mutate: mutateListResourceAll } = useSWRListResourceAll();
  const [objectContentNew, setObjectContentNew] = useState<{
    preview: string;
    file: any;
  }>();
  const [objectContent, setObjectContent] = useState<{
    preview: string;
    file: any;
  }>();
  const [updateToggle, setUpdateToggle] = useState<boolean>(false);
  const [isLoadingSubmitAdd, setIsLoadingSubmitAdd] = useState<boolean>(false);
  const [isLoadingSubmitUpdateResource, setIsLoadingSubmitUpdateResource] =
    useState<boolean>(false);
  const [isLoadingClickDeleteResource, setIsLoadingClickDeleteResource] =
    useState<boolean>(false);
  useEffect(() => {
    if (!!content) {
      setObjectContent({ preview: content, file: content });
    }
  }, [content]);
  const onClickUpdateToggle = () => {
    setUpdateToggle(!updateToggle);
    setObjectContent({ preview: content, file: content });
  };
  const onSubmitAddHandler = async () => {
    try {
      setIsLoadingSubmitAdd(true);
      if (!(!!objectContentNew && !!objectContentNew.file)) {
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/resource`,
        {
          type,
          content: objectContentNew.file,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (response.status === 201) {
        await mutateListResourceAll();
        toast('성공적으로 리소스가 등록되었습니다', { type: 'success' });
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
      if (
        !!!objectContent ||
        (!!objectContent && objectContent.file === content)
      ) {
        setUpdateToggle(!updateToggle);
        setObjectContent({ preview: content, file: content });
        return;
      }
      const response = await axios.put(
        `${process.env.REACT_APP_BACK_URL}/resource`,
        {
          type,
          content_id,
          content: objectContent.file,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (response.status === 200) {
        await mutateListResourceAll();
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
        await mutateListResourceAll();
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
          {!!objectContentNew && !!objectContentNew.preview && (
            <div className="mb-[15px]">
              <img className="rounded-xl" src={objectContentNew.preview} />
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
                if (!(!!event.target.files && !!event.target.files[0])) {
                  return;
                }
                const fileImage = event.target.files[0];
                const fileReader = new FileReader();
                fileReader.readAsDataURL(fileImage);
                fileReader.onload = (readerEvent) => {
                  if (!!readerEvent.target) {
                    setObjectContentNew({
                      preview: readerEvent.target.result as string,
                      file: fileImage,
                    });
                  }
                };
              }}
            />
          </div>
          <input
            type="submit"
            className="mb-[12px] h-[51px] w-full cursor-pointer bg-[#0D5B83] text-[1.5rem] font-semibold leading-[2.0625rem] text-white disabled:cursor-not-allowed disabled:opacity-50"
            value="리소스 추가"
            disabled={!!!objectContentNew || isLoadingSubmitAdd}
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
          {!!objectContent && !!objectContent.preview && (
            <div className="mb-[29px]">
              <img className="rounded-xl" src={objectContent.preview} />
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
                const fileImage = event.target.files[0];
                const fileReader = new FileReader();
                fileReader.readAsDataURL(fileImage);
                fileReader.onload = (readerEvent) => {
                  if (!!readerEvent.target) {
                    setObjectContent({
                      preview: readerEvent.target.result as string,
                      file: fileImage,
                    });
                  }
                };
              }}
            />
            <div className="mb-[10px] mt-[5px] flex items-center justify-end sm:justify-start">
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
              {!!objectContent && !!objectContent.preview && (
                <img
                  className="rounded-xl"
                  src={objectContent.preview}
                  alt="resource_img"
                />
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
