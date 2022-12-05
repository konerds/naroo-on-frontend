import axios from 'axios';
import { isArray } from 'lodash';
import { FormEvent, useState } from 'react';
import { FC } from 'react';
import { toast } from 'react-toastify';
import { MutatorCallback } from 'swr/dist/types';
import { useInput } from '../../hooks';
import { ITags } from '../../interfaces';
import UpdateTag from './tag/UpdateTag';

interface TagEditProps {
  token: string | null;
  setToken: (
    value: string | ((val: string | null) => string | null) | null,
  ) => void;
  tagsData: ITags[] | undefined;
  tagsMutate: (
    data?: ITags[] | Promise<ITags[]> | MutatorCallback<ITags[]> | undefined,
    shouldRevalidate?: boolean | undefined,
  ) => Promise<ITags[] | undefined>;
}

const TagEdit: FC<TagEditProps> = ({
  token,
  setToken,
  tagsData,
  tagsMutate,
}) => {
  const [tagName, onChangeTagName, setTagName] = useInput('');
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const onSubmitAddHandler = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
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
        setTimeout(() => {
          tagsMutate();
          setTagName('');
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
      <form className="mt-[47px] w-full" onSubmit={onSubmitAddHandler}>
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
