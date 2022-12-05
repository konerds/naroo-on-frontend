import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FC, useState } from 'react';
import { ILectureInList, ITags } from '../../../interfaces';
import Tag from '../../common/Tag';
import axios from 'axios';
import { MutatorCallback } from 'swr/dist/types';
import { toast } from 'react-toastify';

interface UnregisterTagElementProps {
  token: string | null;
  lectureId: string;
  tag: ITags;
  mutate: (
    data?:
      | ILectureInList[]
      | Promise<ILectureInList[]>
      | MutatorCallback<ILectureInList[]>
      | undefined,
    shouldRevalidate?: boolean | undefined,
  ) => Promise<ILectureInList[] | undefined>;
}

const UnregisterTagElement: FC<UnregisterTagElementProps> = ({
  token,
  lectureId,
  tag,
  mutate,
}) => {
  const [isLoadingClickUnregisterTag, setIsLoadingClickUnregisterTag] =
    useState<boolean>(false);
  const onClickUnregisterTag = async (tagId: string) => {
    try {
      setIsLoadingClickUnregisterTag(true);
      const response = await axios.delete(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/tag/unregister/${lectureId}?tag_id=${tagId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        setTimeout(() => {
          mutate();
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
        setIsLoadingClickUnregisterTag(false);
      }, 500);
    }
  };
  return (
    <div key={tag.id} className="flex items-center py-[5px] pr-[20px]">
      <Tag name={tag.name} />
      <FontAwesomeIcon
        className={`ml-[5px] ${
          isLoadingClickUnregisterTag
            ? 'opacity-50 cursor-not-allowed pointer-events-none'
            : ''
        }`}
        icon={faTrash}
        onClick={() => onClickUnregisterTag(tag.id)}
      />
    </div>
  );
};

export default UnregisterTagElement;
