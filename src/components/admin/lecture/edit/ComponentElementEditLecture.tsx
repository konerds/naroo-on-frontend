import * as React from 'react';
import axios from 'axios';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import { ILectureInList, ITags } from '../../../../interfaces';
import ComponentFormRegisterTags from '../../tag/ComponentFormRegisterTags';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useStringInput } from '../../../../hooks';
import ComponentFormUpdateImage from './form/ComponentFormUpdateImage';
import moment from 'moment';
import { KeyedMutator } from 'swr';
import { showError } from '../../../../hooks/api';
import ComponentFormUpdateLecture from './form/ComponentFormUpdateLecture';

interface IPropsComponentElementEditLecture {
  id: string;
  title: string;
  images: string[];
  description: string;
  thumbnail: string;
  teacherNickname: string;
  expired: string | null;
  tags: ITags[] | [] | null;
  videoTitle: string;
  videoUrl: string;
  token: string | null;
  setToken: (v: string | null) => void;
  allTags: ITags[] | [];
  mutate: KeyedMutator<ILectureInList[]>;
}

const ComponentElementEditLecture: React.FC<
  IPropsComponentElementEditLecture
> = ({
  id,
  title,
  images,
  description,
  thumbnail,
  teacherNickname,
  expired,
  tags,
  videoTitle,
  videoUrl,
  token,
  setToken,
  allTags,
  mutate,
}) => {
  const [isLoadingClickDeleteLecture, setIsLoadingClickDeleteLecture] =
    React.useState<boolean>(false);
  const [updateExpiredToggle, setUpdateExpiredToggle] =
    React.useState<boolean>(false);
  const [expiredAt, setExpiredAt] = React.useState<Date | null>(
    !!expired ? new Date(expired) : null,
  );
  const [isLoadingSubmitUpdateExpired, setIsLoadingSubmitUpdateExpired] =
    React.useState<boolean>(false);
  const [updateTeacherToggle, setUpdateTeacherToggle] =
    React.useState<boolean>(false);
  const {
    value: updateTeacherName,
    setValue: setUpdateTeacherName,
    onChange: onChangeUpdateTeacherName,
  } = useStringInput(teacherNickname);
  const [isLoadingSubmitUpdateTeacher, setIsLoadingSubmitUpdateTeacher] =
    React.useState<boolean>(false);
  const onClickUpdateTeacherToggle = () => {
    setUpdateTeacherToggle(!updateTeacherToggle);
    setUpdateTeacherName(teacherNickname);
  };
  const onClickUpdateExpiredToggle = () => {
    setUpdateExpiredToggle(!updateExpiredToggle);
    setExpiredAt(!!expired ? new Date(expired) : null);
  };
  const onHandleExpiredAt = (date: Date | null) => {
    setExpiredAt(date);
  };
  const onClickDeleteLecture = async () => {
    try {
      setIsLoadingClickDeleteLecture(true);
      const response = await axios.delete(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/${id}`,
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
      setIsLoadingClickDeleteLecture(false);
    }
  };
  const onSubmitUpdateExpired = async () => {
    try {
      setIsLoadingSubmitUpdateExpired(true);
      const response = await axios.put(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/${id}`,
        {
          expired: expiredAt,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        await mutate();
        setUpdateExpiredToggle(!updateExpiredToggle);
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingSubmitUpdateExpired(false);
    }
  };
  const onSubmitUpdateTeacher = async () => {
    try {
      setIsLoadingSubmitUpdateTeacher(true);
      const response = await axios.put(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/${id}`,
        {
          teacherName: updateTeacherName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        await mutate();
        setUpdateTeacherToggle(!updateTeacherToggle);
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingSubmitUpdateTeacher(false);
    }
  };
  return (
    <div className="w-[560px] xs:w-[380px] justify-self-center">
      <button
        className="px-[15px] py-[5px] mx-auto my-[5px] border-[1px] border-black rounded-2xl w-max flex justify-center items-center hover:bg-black hover:text-white disabled:opacity-50"
        disabled={isLoadingClickDeleteLecture}
        onClick={onClickDeleteLecture}
      >
        <div>강의 삭제하기</div>
        <FontAwesomeIcon className="ml-[20px]" icon={faTrash} />
      </button>
      <div className="mb-1 text-xs bg-white text-shuttle-gray mt-[10px]">
        <ComponentFormUpdateImage
          token={token}
          fieldType="thumbnail"
          lectureId={id}
          userField={thumbnail}
          mutate={mutate}
          imageIndex={null}
        />
      </div>
      <div className="mt-3 text-xs bg-white text-shuttle-gray">
        {updateExpiredToggle ? (
          <form
            className="flex items-center py-[10px]"
            onSubmit={onSubmitUpdateExpired}
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDateTimePicker
                format="yyyy년 MM월 dd일 hh시 mm분 ss초"
                value={expiredAt}
                margin="normal"
                onChange={onHandleExpiredAt}
                className="w-full"
                disabled={isLoadingSubmitUpdateExpired}
              />
            </MuiPickersUtilsProvider>
            <button
              className="mx-[10px] lg:w-[4vw] w-[8vw] box-border rounded-[4px] border-[1px] border-[#4DBFF0] h-[41px] lg:text-[14px] text-[1vw] font-semibold leading-[150%] bg-[#4DBFF0] text-white disabled:opacity-50"
              disabled={isLoadingSubmitUpdateExpired}
              type="submit"
            >
              수정
            </button>
            <button
              className="lg:w-[4vw] w-[8vw] box-border rounded-[4px] border-[1px] border-[#4DBFF0] h-[41px] lg:text-[14px] text-[1vw] font-semibold leading-[150%] bg-[#4DBFF0] text-white disabled:opacity-50"
              disabled={isLoadingSubmitUpdateExpired}
              onClick={onClickUpdateExpiredToggle}
            >
              취소
            </button>
          </form>
        ) : (
          <div className="flex items-center py-[10px]">
            <div className="flex rounded-full text-gray-200 bg-harp w-full items-center p-[10px] text-xs mr-[10px]">
              {!expired && <div>강의 만료 일시가 설정되어 있지 않습니다</div>}
              {expired && moment(expired).format('YYYY-MM-DD HH:mm:ss')}
            </div>
            <FontAwesomeIcon
              className="mx-[10px]"
              icon={faEdit}
              onClick={onClickUpdateExpiredToggle}
            />
          </div>
        )}
      </div>
      <div className="mb-1 text-xs bg-white text-shuttle-gray mt-[10px]">
        <ComponentFormUpdateLecture
          token={token}
          fieldType="title"
          lectureId={id}
          userField={title}
          mutate={mutate}
        />
      </div>
      {updateTeacherToggle ? (
        <form
          className="flex items-center py-[10px]"
          onSubmit={onSubmitUpdateTeacher}
        >
          <label htmlFor="teacher" className="min-w-max mr-[10px]">
            강사
          </label>
          <input
            className="w-full h-[41px] border-[1px] box-border rounded-[4px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[14px] leading-[150%] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white px-[20px] disabled:opacity-50"
            type="text"
            value={updateTeacherName}
            onChange={onChangeUpdateTeacherName}
            disabled={isLoadingSubmitUpdateTeacher}
          />
          <button
            className="mx-[10px] lg:w-[4vw] w-[8vw] box-border rounded-[4px] border-[1px] border-[#4DBFF0] h-[41px] lg:text-[14px] text-[1vw] font-semibold leading-[150%] bg-[#4DBFF0] text-white disabled:opacity-50"
            type="submit"
            disabled={isLoadingSubmitUpdateTeacher}
          >
            수정
          </button>
          <button
            className="lg:w-[4vw] w-[8vw] box-border rounded-[4px] border-[1px] border-[#4DBFF0] h-[41px] lg:text-[14px] text-[1vw] font-semibold leading-[150%] bg-[#4DBFF0] text-white disabled:opacity-50"
            onClick={onClickUpdateTeacherToggle}
            disabled={isLoadingSubmitUpdateTeacher}
          >
            취소
          </button>
        </form>
      ) : (
        <div className="flex items-center py-[10px]">
          <div className="flex rounded-full text-gray-200 bg-harp w-full items-center p-[10px] text-xs mr-[10px]">
            {teacherNickname}
          </div>
          <FontAwesomeIcon
            className="mx-[10px]"
            icon={faEdit}
            onClick={onClickUpdateTeacherToggle}
          />
        </div>
      )}
      <div className="mb-1 text-xs bg-white text-shuttle-gray mt-[10px]">
        <ComponentFormUpdateLecture
          token={token}
          fieldType="description"
          lectureId={id}
          userField={description}
          mutate={mutate}
        />
      </div>
      <div className="mb-1 text-xs bg-white text-shuttle-gray mt-[10px]">
        {images &&
          images.length > 0 &&
          images.map((image, index) => {
            return (
              <ComponentFormUpdateImage
                key={index}
                token={token}
                fieldType="img_description"
                lectureId={id}
                userField={image}
                mutate={mutate}
                imageIndex={index + 1}
              />
            );
          })}
      </div>
      <div className="mb-1 text-xs bg-white text-shuttle-gray mt-[10px]">
        <ComponentFormUpdateLecture
          token={token}
          fieldType="video_title"
          lectureId={id}
          userField={videoTitle}
          mutate={mutate}
        />
      </div>
      <div className="mb-1 text-xs bg-white text-shuttle-gray mt-[10px]">
        <ComponentFormUpdateLecture
          token={token}
          fieldType="video_url"
          lectureId={id}
          userField={videoUrl}
          mutate={mutate}
        />
      </div>
      <ComponentFormRegisterTags
        token={token}
        lectureId={id}
        allTags={allTags}
        tags={tags ? (tags.length > 0 ? tags : []) : []}
        mutate={mutate}
      />
    </div>
  );
};

export default ComponentElementEditLecture;
