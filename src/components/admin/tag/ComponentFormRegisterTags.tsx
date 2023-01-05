import * as React from 'react';
import axios from 'axios';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';
import { KeyedMutator } from 'swr';
import { ILectureInList, ITags } from '../../../interfaces';
import ComponentFormUnregisterTag from './ComponentFormUnregisterTag';
import { showError } from '../../../hooks/api';

interface IPropsComponentFormRegisterTags {
  token: string | null;
  lectureId: string;
  allTags: ITags[] | undefined;
  tags: ITags[] | [];
  mutate: KeyedMutator<ILectureInList[]>;
}

const ComponentFormRegisterTags: React.FC<IPropsComponentFormRegisterTags> = ({
  token,
  lectureId,
  allTags,
  tags,
  mutate,
}) => {
  const [updateToggle, setUpdateToggle] = React.useState<boolean>(false);
  const [registerTags, setRegisterTags] = React.useState<ITags[]>(tags);
  const [isLoadingSubmit, setIsLoadingSubmit] = React.useState<boolean>(false);
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
          className="mt-[10px] flex items-center"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitRegisterTag();
          }}
        >
          <Select
            isMulti
            isClearable
            className="w-full text-xs text-gray-200 bg-harp disabled:opacity-50"
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
          <input
            className="w-[65px] h-[32px] mx-[10px] button-modify-cancel-admin"
            type="submit"
            value="수정"
            disabled={isLoadingSubmit}
          />
          <button
            className="w-[65px] h-[32px] button-modify-cancel-admin"
            onClick={onClickUpdateToggle}
            disabled={isLoadingSubmit}
          >
            취소
          </button>
        </form>
      ) : (
        <div className="mt-[10px] flex items-center justify-between">
          <div className="flex flex-wrap items-center">
            <>
              {tags &&
                tags.length > 0 &&
                tags.map((tag, index) => {
                  return (
                    <ComponentFormUnregisterTag
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
