import { FC, useState } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { isArray } from 'lodash';
import { useStringInput } from '../../hooks';
import { showError, useSWRListTagAll } from '../../hooks/api';
import ComponentFormUpdateTag from './tag/ComponentFormUpdateTag';
import { toast } from 'react-toastify';
import stateToken from '../../recoil/state-object-token/stateToken';

interface IPropsComponentFormEditTag {}

const ComponentFormEditTag: FC<IPropsComponentFormEditTag> = ({}) => {
  const token = useRecoilValue(stateToken);
  const { data: dataListTagAll, mutate: mutateListTagAll } = useSWRListTagAll();
  const {
    value: tagName,
    setValue: setTagName,
    onChange: onChangeTagName,
  } = useStringInput('');
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
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
        await mutateListTagAll();
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
        <div className="mb-[10px] flex">
          <input
            className="h-[30px] w-full border-[1px] border-[#C4C4C4]"
            type="text"
            value={tagName}
            onChange={onChangeTagName}
          />
          <button
            type="submit"
            disabled={isLoadingSubmit}
            className="mb-[12px] ml-[10px] mr-0 h-[30px] w-[100px] rounded-3xl bg-[#4DBFF0] text-xs font-semibold text-white hover:opacity-50 disabled:opacity-50 sm:text-[1rem]"
          >
            태그 추가
          </button>
        </div>
      </form>
      <div className="mt-[10px] flex flex-wrap items-center border-[1px] p-[10px]">
        {dataListTagAll &&
          isArray(dataListTagAll) &&
          dataListTagAll.length > 0 &&
          dataListTagAll.map((tag, index) => {
            return <ComponentFormUpdateTag key={index} tag={tag} />;
          })}
      </div>
    </>
  );
};

export default ComponentFormEditTag;
