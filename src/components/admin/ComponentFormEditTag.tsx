import * as React from 'react';
import axios from 'axios';
import { isArray } from 'lodash';
import { KeyedMutator } from 'swr';
import { useStringInput } from '../../hooks';
import { showError } from '../../hooks/api';
import { ITags } from '../../interfaces';
import ComponentFormUpdateTag from './tag/ComponentFormUpdateTag';
import { toast } from 'react-toastify';

interface IPropsComponentFormEditTag {
  token: string | null;
  tagsData: ITags[] | undefined;
  tagsMutate: KeyedMutator<ITags[]>;
}

const ComponentFormEditTag: React.FC<IPropsComponentFormEditTag> = ({
  token,
  tagsData,
  tagsMutate,
}) => {
  const {
    value: tagName,
    setValue: setTagName,
    onChange: onChangeTagName,
  } = useStringInput('');
  const [isLoadingSubmit, setIsLoadingSubmit] = React.useState<boolean>(false);
  const onSubmitAddHandler = async () => {
    try {
      setIsLoadingSubmit(true);
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
        toast('성공적으로 태그가 등록되었습니다', { type: 'success' });
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
        className="w-full"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmitAddHandler();
        }}
      >
        <div className="flex mb-[10px]">
          <input
            className="w-full h-[30px] border-[1px] border-[#C4C4C4]"
            type="text"
            value={tagName}
            onChange={onChangeTagName}
          />
          <button
            type="submit"
            disabled={isLoadingSubmit}
            className="ml-[10px] mr-0 w-[100px] h-[30px] rounded-3xl text-xs sm:text-[1rem] font-semibold bg-[#4DBFF0] text-white mb-[12px] disabled:opacity-50 hover:opacity-50"
          >
            태그 추가
          </button>
        </div>
      </form>
      <div className="mt-[10px] border-[1px] p-[10px] flex flex-wrap items-center">
        {!!tagsData &&
          isArray(tagsData) &&
          tagsData.length > 0 &&
          tagsData.map((tag) => {
            return (
              <ComponentFormUpdateTag
                key={tag.id}
                token={token}
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

export default ComponentFormEditTag;
