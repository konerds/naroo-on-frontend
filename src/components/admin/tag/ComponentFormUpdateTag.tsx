import * as React from 'react';
import axios from 'axios';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { KeyedMutator } from 'swr';
import { useStringInput } from '../../../hooks';
import { showError } from '../../../hooks/api';
import { ITags } from '../../../interfaces';
import ComponentElementTag from '../../common/ComponentElementTag';
import { toast } from 'react-toastify';

interface IPropsComponentFormUpdateTag {
  token: string | null;
  id: string;
  name: string;
  mutate: KeyedMutator<ITags[]>;
}

const ComponentFormUpdateTag: React.FC<IPropsComponentFormUpdateTag> = ({
  token,
  id,
  name,
  mutate,
}) => {
  const [updateToggle, setUpdateToggle] = React.useState<boolean>(false);
  const {
    value: updateTagName,
    setValue: setUpdateTagName,
    onChange: onChangeUpdateTagName,
  } = useStringInput('');
  const [isLoadingSubmit, setIsLoadingSubmit] = React.useState<boolean>(false);
  const [isLoadingDeleteTag, setIsLoadingDeleteTag] =
    React.useState<boolean>(false);
  const onClickUpdateToggle = () => {
    setUpdateToggle(!updateToggle);
    setUpdateTagName(name);
  };
  const onSubmitUpdateTag = async () => {
    try {
      setIsLoadingSubmit(true);
      if (!updateTagName || updateTagName === name) {
        setUpdateToggle(!updateToggle);
        setUpdateTagName(name);
        return;
      }
      const response = await axios.put(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/tag/${id}`,
        {
          name: updateTagName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        await mutate();
        toast('성공적으로 태그가 업데이트되었습니다', { type: 'success' });
        setUpdateToggle(!updateToggle);
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingSubmit(false);
    }
  };
  const onClickDeleteTag = async () => {
    try {
      setIsLoadingDeleteTag(true);
      const response = await axios.delete(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/tag/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        toast('성공적으로 태그가 삭제되었습니다', { type: 'success' });
        await mutate();
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingDeleteTag(false);
    }
  };
  return (
    <>
      {updateToggle ? (
        <form
          className="block sm:flex sm:flex-wrap sm:items-center"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitUpdateTag();
          }}
        >
          <input
            className="box-border h-[24px] w-[100px] rounded-[10px] border-[1px] border-[#DCDEE2] bg-[#F3FBFE] py-[10px] pl-[10px] text-[0.875rem] font-medium placeholder-[#DCDEE2] focus:border-[#00A0E9] focus:bg-white focus:outline-none disabled:opacity-50"
            type="text"
            value={updateTagName}
            onChange={onChangeUpdateTagName}
            disabled={isLoadingSubmit}
          />
          <div className="mt-[5px] mb-[10px] flex items-center justify-end sm:justify-start">
            <button
              className="disabled:cursor-not-allowed; mx-[5px] box-border h-[24px] w-[40px] rounded-[10px] border-[1px] border-[#4DBFF0] bg-[#4DBFF0] text-[0.5rem] font-semibold text-white hover:opacity-50 disabled:opacity-50 lg:text-[0.8rem]"
              type="submit"
              disabled={isLoadingSubmit}
            >
              수정
            </button>
            <button
              className="disabled:cursor-not-allowed; mr-[10px] box-border h-[24px] w-[40px] rounded-[10px] border-[1px] border-[#4DBFF0] bg-[#4DBFF0] text-[0.5rem] font-semibold text-white hover:opacity-50 disabled:opacity-50 lg:text-[0.8rem]"
              onClick={onClickUpdateToggle}
              disabled={isLoadingSubmit}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="flex h-[30px] items-center py-[20px]">
          <div className="overflow-x-hidden">
            <ComponentElementTag name={name} />
          </div>
          <FontAwesomeIcon
            className={`button-fa-icon-admin mx-[5px] ${
              isLoadingDeleteTag
                ? 'pointer-events-none cursor-not-allowed opacity-50'
                : ''
            }`}
            icon={faEdit}
            onClick={onClickUpdateToggle}
          />
          <FontAwesomeIcon
            className={`button-fa-icon-admin mr-[20px] ${
              isLoadingDeleteTag
                ? 'pointer-events-none cursor-not-allowed opacity-50'
                : ''
            }`}
            icon={faTrash}
            onClick={onClickDeleteTag}
          />
        </div>
      )}
    </>
  );
};

export default ComponentFormUpdateTag;
