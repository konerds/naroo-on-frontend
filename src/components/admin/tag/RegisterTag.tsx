import * as React from 'react';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Select from 'react-select';
import { KeyedMutator } from 'swr';
import { ILectureInList, ITags } from '../../../interfaces';
import UnregisterTagElement from './UnregisterTagElement';
import { showError } from '../../../hooks/api';

interface RegisterTagProps {
  token: string | null;
  setToken: (v: string | null) => void;
  lectureId: string;
  allTags: ITags[] | undefined;
  tags: ITags[] | [];
  mutate: KeyedMutator<ILectureInList[]>;
}

const RegisterTag: React.FC<RegisterTagProps> = ({
  token,
  setToken,
  lectureId,
  allTags,
  tags,
  mutate,
}) => {
  const [updateToggle, setUpdateToggle] = React.useState<boolean>(false);
  const [registerTags, setRegisterTags] = React.useState<ITags[]>(tags);
  const tagsOptions = React.useMemo(() => {
    const filteredTags = [];
    if (!!allTags) {
      for (const tag of allTags) {
        filteredTags.push({ value: tag.id, label: tag.name });
      }
    }
    return filteredTags;
  }, [allTags]);
  const onHandleTagsChange = React.useCallback(
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
  const [isLoadingSubmit, setIsLoadingSubmit] = React.useState<boolean>(false);
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
        await mutate();
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
          className="flex items-center py-[10px]"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitRegisterTag();
          }}
        >
          <label htmlFor="tag" className="min-w-max mr-[10px]">
            태그
          </label>
          <div className="w-full">
            <Select
              isMulti
              isClearable
              className="rounded-full w-full pl-[14px] pr-[14px] py-1 text-xs text-gray-200 bg-harp mr-1 disabled:opacity-50"
              value={tagsOptions.map((tagOption) => {
                for (const tag of registerTags) {
                  if (tagOption.value === tag.id) {
                    return tagOption;
                  }
                }
              })}
              options={tagsOptions}
              onChange={onHandleTagsChange}
              placeholder="태그를 추가하세요!"
              isDisabled={isLoadingSubmit}
            />
          </div>
          <input
            className="rounded-[4px] min-w-max mx-[10px] disabled:opacity-50"
            type="submit"
            value="수정"
            disabled={isLoadingSubmit}
          />
          <button
            className="rounded-[4px] min-w-max disabled:opacity-50"
            onClick={onClickUpdateToggle}
            disabled={isLoadingSubmit}
          >
            취소
          </button>
        </form>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center py-[10px] mt-5">
            <>
              {tags &&
                tags.length > 0 &&
                tags.map((tag, index) => {
                  return (
                    <UnregisterTagElement
                      key={index}
                      token={token}
                      lectureId={lectureId}
                      tag={tag}
                      mutate={mutate}
                    />
                  );
                })}
            </>
          </div>
          <FontAwesomeIcon icon={faEdit} onClick={onClickUpdateToggle} />
        </div>
      )}
    </>
  );
};

export default RegisterTag;
