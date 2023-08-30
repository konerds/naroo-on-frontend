import { FC, useState } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ITags } from '../../../interfaces';
import ComponentElementTag from '../../common/ComponentElementTag';
import { showError, useSWRListLectureAll } from '../../../hooks/api';
import { toast } from 'react-toastify';
import stateToken from '../../../recoil/state-object-token/stateToken';

interface IPropsComponentFormUnregisterTag {
  lectureId: string;
  tag: ITags;
}

const ComponentFormUnregisterTag: FC<IPropsComponentFormUnregisterTag> = ({
  lectureId,
  tag,
}) => {
  const token = useRecoilValue(stateToken);
  const { mutate: mutateLectureAll } = useSWRListLectureAll();
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
        toast('성공적으로 강의에 설정된 태그가 해제되었습니다', {
          type: 'success',
        });
        await mutateLectureAll();
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingClickUnregisterTag(false);
    }
  };
  return (
    <div className="flex items-center">
      <ComponentElementTag name={tag.name} />
      <FontAwesomeIcon
        className={`button-fa-icon-admin ${
          isLoadingClickUnregisterTag
            ? 'pointer-events-none cursor-not-allowed opacity-50'
            : ''
        }`}
        icon={faTrash}
        onClick={() => onClickUnregisterTag(tag.id)}
      />
    </div>
  );
};

export default ComponentFormUnregisterTag;
