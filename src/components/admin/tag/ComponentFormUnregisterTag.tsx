import * as React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ILectureInList, ITags } from '../../../interfaces';
import ComponentElementTag from '../../common/ComponentElementTag';
import { KeyedMutator } from 'swr';
import { showError } from '../../../hooks/api';

interface IPropsComponentFormUnregisterTag {
  token: string | null;
  lectureId: string;
  tag: ITags;
  mutate: KeyedMutator<ILectureInList[]>;
}

const ComponentFormUnregisterTag: React.FC<
  IPropsComponentFormUnregisterTag
> = ({ token, lectureId, tag, mutate }) => {
  const [isLoadingClickUnregisterTag, setIsLoadingClickUnregisterTag] =
    React.useState<boolean>(false);
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
        await mutate();
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingClickUnregisterTag(false);
    }
  };
  return (
    <div key={tag.id} className="flex items-center">
      <ComponentElementTag name={tag.name} />
      <FontAwesomeIcon
        className={`button-fa-icon-admin ${
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

export default ComponentFormUnregisterTag;
