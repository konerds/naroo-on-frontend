import { FC, FormEvent, useCallback, useMemo, useState } from 'react';
import { MutatorCallback } from 'swr/dist/types';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import { ILectureInList, ITags } from '../../../interfaces';
import RegisterTag from '../tag/RegisterTag';
import UpdateLectureField from './UpdateLectureField';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useInput } from '../../../hooks';
import UpdateImageField from './UpdateImageField';
import moment from 'moment';

interface LectureEditCardProps {
  id: string;
  title: string;
  images: string[];
  description: string;
  thumbnail: string;
  teacherNickname: string;
  status: string | null;
  expired: string | null;
  tags: ITags[] | [] | null;
  videoTitle: string;
  videoUrl: string;
  token: string | null;
  setToken: (
    value: string | ((val: string | null) => string | null) | null,
  ) => void;
  allTags: ITags[] | [];
  mutate: (
    data?:
      | ILectureInList[]
      | Promise<ILectureInList[]>
      | MutatorCallback<ILectureInList[]>
      | undefined,
    shouldRevalidate?: boolean | undefined,
  ) => Promise<ILectureInList[] | undefined>;
}

const LectureEditCard: FC<LectureEditCardProps> = ({
  id,
  title,
  images,
  description,
  thumbnail,
  teacherNickname,
  status,
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
    useState<boolean>(false);
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
        setIsLoadingClickDeleteLecture(false);
      }, 500);
    }
  };
  const [updateExpiredToggle, setUpdateExpiredToggle] =
    useState<boolean>(false);
  const onClickUpdateExpiredToggle = () => {
    setUpdateExpiredToggle(!updateExpiredToggle);
    setExpiredAt(expired ? new Date(expired) : null);
  };
  const [expiredAt, setExpiredAt] = useState<Date | null>(
    expired ? new Date(expired) : null,
  );
  const onHandleExpiredAt = (date: Date | null) => {
    setExpiredAt(date);
  };
  const [isLoadingSubmitUpdateExpired, setIsLoadingSubmitUpdateExpired] =
    useState<boolean>(false);
  const onSubmitUpdateExpired = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
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
        setTimeout(() => {
          mutate();
          setUpdateExpiredToggle(!updateExpiredToggle);
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
        setIsLoadingSubmitUpdateExpired(false);
      }, 500);
    }
  };
  const [updateTeacherToggle, setUpdateTeacherToggle] =
    useState<boolean>(false);
  const onClickUpdateTeacherToggle = () => {
    setUpdateTeacherToggle(!updateTeacherToggle);
    setUpdateTeacherName(teacherNickname);
  };
  const [updateTeacherName, onChangeUpdateTeacherName, setUpdateTeacherName] =
    useInput(teacherNickname);
  const [isLoadingSubmitUpdateTeacher, setIsLoadingSubmitUpdateTeacher] =
    useState<boolean>(false);
  const onSubmitUpdateTeacher = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
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
        setTimeout(() => {
          mutate();
          setUpdateTeacherToggle(!updateTeacherToggle);
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
        setIsLoadingSubmitUpdateTeacher(false);
      }, 500);
    }
  };
  return (
    <div className="w-[560px] xs:w-[380px] justify-self-center">
      <button
        className="my-[5px] w-full flex justify-center items-center disabled:opacity-50"
        disabled={isLoadingClickDeleteLecture}
        onClick={onClickDeleteLecture}
      >
        <div>강의 삭제하기</div>
        <FontAwesomeIcon className="ml-[20px]" icon={faTrash} />
      </button>
      <div className="mb-1 text-xs bg-white text-shuttle-gray mt-[10px]">
        <UpdateImageField
          token={token}
          setToken={setToken}
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
              {!expired && <div>강의 만료 일시가 설정되어 있지 않습니다!</div>}
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
        <UpdateLectureField
          token={token}
          setToken={setToken}
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
        <UpdateLectureField
          token={token}
          setToken={setToken}
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
              <UpdateImageField
                token={token}
                setToken={setToken}
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
        <UpdateLectureField
          token={token}
          setToken={setToken}
          fieldType="video_title"
          lectureId={id}
          userField={videoTitle}
          mutate={mutate}
        />
      </div>
      <div className="mb-1 text-xs bg-white text-shuttle-gray mt-[10px]">
        <UpdateLectureField
          token={token}
          setToken={setToken}
          fieldType="video_url"
          lectureId={id}
          userField={videoUrl}
          mutate={mutate}
        />
      </div>
      <RegisterTag
        token={token}
        setToken={setToken}
        lectureId={id}
        allTags={allTags}
        tags={tags ? (tags.length > 0 ? tags : []) : []}
        mutate={mutate}
      />
    </div>
  );
};

export default LectureEditCard;
