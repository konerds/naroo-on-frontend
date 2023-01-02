import axios from 'axios';
import { isArray } from 'lodash';
import * as React from 'react';
import { FC } from 'react';
import { toast } from 'react-toastify';
import { KeyedMutator } from 'swr';
import { useInput } from '../../hooks';
import { showError } from '../../hooks/api';
import { ITags } from '../../interfaces';
import UpdateTag from './tag/UpdateTag';

interface TagEditProps {
  token: string | null;
  setToken: (v: string | null) => void;
  tagsData: ITags[] | undefined;
  tagsMutate: KeyedMutator<ITags[]>;
}

const TagEdit: FC<TagEditProps> = ({
  token,
  setToken,
  tagsData,
  tagsMutate,
}) => {
  const [tagName, onChangeTagName, setTagName] = useInput('');
  const [isLoadingSubmit, setIsLoadingSubmit] = React.useState<boolean>(false);
  const onSubmitAddHandler = async () => {
    try {
      setIsLoadingSubmit(true);
      if (!tagName) {
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/tag/create`,
        {
          name: tagName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 201) {
        await tagsMutate();
        setTagName('');
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingSubmit(false);
    }
  };
  return (
    <>
      <form
        className="mt-[47px] w-full"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmitAddHandler();
        }}
      >
        <div className="mt-[67px] mb-[29px]">
          <div>
            <label className="text-[16px] leading-[22px]" htmlFor="email">
              태그 이름
            </label>
          </div>
          <input
            className="w-full h-[51px] border-[1px] border-[#C4C4C4]"
            type="text"
            value={tagName}
            onChange={onChangeTagName}
          />
        </div>
        <button
          type="submit"
          disabled={isLoadingSubmit}
          className="w-full h-[51px] text-[24px] font-semibold leading-[33px] bg-[#4DBFF0] text-white mb-[12px] disabled:opacity-50"
        >
          태그 추가
        </button>
      </form>
      <div className="flex flex-wrap items-center">
        {tagsData &&
          isArray(tagsData) &&
          tagsData.length > 0 &&
          tagsData.map((tag) => {
            return (
              <UpdateTag
                key={tag.id}
                token={token}
                setToken={setToken}
                id={tag.id}
                name={tag.name}
                mutate={tagsMutate}
              />
            );
          })}
      </div>
    </>
  );
};

export default TagEdit;
