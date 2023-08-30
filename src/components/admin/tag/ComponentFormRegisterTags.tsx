import { FC, useState, useMemo, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';
import { ITags } from '../../../interfaces';
import ComponentFormUnregisterTag from './ComponentFormUnregisterTag';
import {
  showError,
  useSWRListLectureAll,
  useSWRListTagAll,
} from '../../../hooks/api';
import { toast } from 'react-toastify';
import stateToken from '../../../recoil/state-object-token/stateToken';

interface IPropsComponentFormRegisterTags {
  lectureId: string;
  tags: ITags[] | [];
}

const ComponentFormRegisterTags: FC<IPropsComponentFormRegisterTags> = ({
  lectureId,
  tags,
}) => {
  const token = useRecoilValue(stateToken);
  const { data: dataListTagAll } = useSWRListTagAll();
  const { mutate: mutateLectureAll } = useSWRListLectureAll();
  const [updateToggle, setUpdateToggle] = useState<boolean>(false);
  const [registerTags, setRegisterTags] = useState<ITags[]>(tags);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const tagsOptions = useMemo(() => {
    const filteredTags = [];
    if (dataListTagAll) {
      for (const tag of dataListTagAll) {
        filteredTags.push({ value: tag.id, label: tag.name });
      }
    }
    return filteredTags;
  }, [dataListTagAll]);
  const onHandleTagsChange = useCallback(
    (changedOption: any) => {
      const filteredTags = [];
      if (changedOption && changedOption.length > 0) {
        for (const tagOption of changedOption) {
          filteredTags.push({ id: tagOption.value, name: tagOption.label });
        }
      }
      setRegisterTags(filteredTags);
    },
    [tagsOptions],
  );
  const onClickUpdateToggle = () => {
    setUpdateToggle(!updateToggle);
    setRegisterTags(tags);
  };
  const onSubmitRegisterTag = async () => {
    try {
      setIsLoadingSubmit(true);
      const ids = [];
      for (const tag of registerTags) {
        ids.push(tag.id);
      }
      const response = await axios.put(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/tag/register/${lectureId}`,
        {
          ids,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        await mutateLectureAll();
        toast('성공적으로 강의에 태그가 설정되었습니다', { type: 'success' });
        setUpdateToggle(!updateToggle);
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingSubmit(false);
    }
  };
  return (
    <>
      {updateToggle ? (
        <form
          className="mt-[10px] block sm:flex sm:items-center"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitRegisterTag();
          }}
        >
          <Select
            isMulti
            isClearable
            className="w-full bg-harp text-xs text-gray-200 disabled:opacity-50"
            value={tagsOptions.map((tagOption) => {
              for (const tag of registerTags) {
                if (tagOption.value === tag.id) {
                  return tagOption;
                }
              }
            })}
            options={tagsOptions}
            onChange={onHandleTagsChange}
            placeholder="태그를 추가하세요"
            isDisabled={isLoadingSubmit}
          />
          <div className="my-[10px] flex items-center justify-end sm:justify-start">
            <input
              className="button-modify-cancel-admin mx-[10px] h-[32px] w-[65px]"
              type="submit"
              value="수정"
              disabled={isLoadingSubmit}
            />
            <button
              className="button-modify-cancel-admin h-[32px] w-[65px]"
              onClick={onClickUpdateToggle}
              disabled={isLoadingSubmit}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-[10px] flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[5px]">
            <>
              {tags &&
                tags.length > 0 &&
                tags.map((tag, index) => {
                  return (
                    <ComponentFormUnregisterTag
                      key={index}
                      lectureId={lectureId}
                      tag={tag}
                    />
                  );
                })}
            </>
          </div>
          <FontAwesomeIcon
            className="button-fa-icon-admin"
            icon={faEdit}
            onClick={onClickUpdateToggle}
          />
        </div>
      )}
    </>
  );
};

export default ComponentFormRegisterTags;
