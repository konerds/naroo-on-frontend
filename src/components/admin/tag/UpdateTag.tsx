import * as React from 'react';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { KeyedMutator } from 'swr';
import { useInput } from '../../../hooks';
import { showError } from '../../../hooks/api';
import { ITags } from '../../../interfaces';
import Tag from '../../common/Tag';

interface UpdateTagProps {
  token: string | null;
  setToken: (v: string | null) => void;
  id: string;
  name: string;
  mutate: KeyedMutator<ITags[]>;
}

const UpdateTag: React.FC<UpdateTagProps> = ({
  token,
  setToken,
  id,
  name,
  mutate,
}) => {
  const [updateToggle, setUpdateToggle] = React.useState<boolean>(false);
  const [updateTagName, onChangeUpdateTagName, setUpdateTagName] = useInput('');
  const onClickUpdateToggle = () => {
    setUpdateToggle(!updateToggle);
    setUpdateTagName(name);
  };
  const [isLoadingSubmit, setIsLoadingSubmit] = React.useState<boolean>(false);
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
  const [isLoadingDeleteTag, setIsLoadingDeleteTag] =
    React.useState<boolean>(false);
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
          className="flex flex-wrap items-center py-[10px] mx-[20px]"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitUpdateTag();
          }}
        >
          <input
            className="h-[41px] border-[1px] box-border rounded-[4px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[14px] leading-[150%] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white px-[20px] disabled:opacity-50"
            type="text"
            value={updateTagName}
            onChange={onChangeUpdateTagName}
            disabled={isLoadingSubmit}
          />
          <button
            className="mx-[10px] lg:w-[4vw] w-[8vw] box-border rounded-[4px] border-[1px] border-[#4DBFF0] h-[41px] lg:text-[14px] text-[1vw] font-semibold leading-[150%] bg-[#4DBFF0] text-white disabled:opacity-50"
            type="submit"
            disabled={isLoadingSubmit}
          >
            수정
          </button>
          <button
            className="lg:w-[4vw] w-[8vw] box-border rounded-[4px] border-[1px] border-[#4DBFF0] h-[41px] lg:text-[14px] text-[1vw] font-semibold leading-[150%] bg-[#4DBFF0] text-white disabled:opacity-50"
            onClick={onClickUpdateToggle}
            disabled={isLoadingSubmit}
          >
            취소
          </button>
        </form>
      ) : (
        <div className="flex items-center py-[10px]">
          <div className="overflow-x-hidden">
            <Tag name={name} />
          </div>
          <FontAwesomeIcon
            className={`mx-[5px] ${
              isLoadingDeleteTag
                ? 'opacity-50 cursor-not-allowed pointer-events-none'
                : ''
            }`}
            icon={faEdit}
            onClick={onClickUpdateToggle}
          />
          <FontAwesomeIcon
            className={`mr-[20px] ${
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

export default UpdateTag;
