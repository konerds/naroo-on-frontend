import * as React from 'react';
import axios from 'axios';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { KeyedMutator } from 'swr';
import { useStringInput } from '../../../hooks';
import { showError } from '../../../hooks/api';
import { ITags } from '../../../interfaces';
import ComponentElementTag from '../../common/ComponentElementTag';

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
            className="w-[100px] h-[24px] border-[1px] box-border rounded-[10px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[0.875rem] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white pl-[10px] disabled:opacity-50"
            type="text"
            value={updateTagName}
            onChange={onChangeUpdateTagName}
            disabled={isLoadingSubmit}
          />
          <div className="flex justify-end sm:justify-start items-center mt-[5px] mb-[10px]">
            <button
              className="w-[40px] h-[24px] mx-[5px] box-border rounded-[10px] border-[1px] border-[#4DBFF0] lg:text-[0.8rem] text-[0.5rem] font-semibold bg-[#4DBFF0] text-white disabled:opacity-50 hover:opacity-50 disabled:cursor-not-allowed;"
              type="submit"
              disabled={isLoadingSubmit}
            >
              수정
            </button>
            <button
              className="mr-[10px] w-[40px] h-[24px] box-border rounded-[10px] border-[1px] border-[#4DBFF0] lg:text-[0.8rem] text-[0.5rem] font-semibold bg-[#4DBFF0] text-white disabled:opacity-50 hover:opacity-50 disabled:cursor-not-allowed;"
              onClick={onClickUpdateToggle}
              disabled={isLoadingSubmit}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center h-[30px] py-[20px]">
          <div className="overflow-x-hidden">
            <ComponentElementTag name={name} />
          </div>
          <FontAwesomeIcon
            className={`mx-[5px] button-fa-icon-admin ${
              isLoadingDeleteTag
                ? 'opacity-50 cursor-not-allowed pointer-events-none'
                : ''
            }`}
            icon={faEdit}
            onClick={onClickUpdateToggle}
          />
          <FontAwesomeIcon
            className={`mr-[20px] button-fa-icon-admin ${
              isLoadingDeleteTag
                ? 'opacity-50 cursor-not-allowed pointer-events-none'
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
