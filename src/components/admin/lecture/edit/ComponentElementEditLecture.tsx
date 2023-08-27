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
import { toast } from 'react-toastify';

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
        toast('성공적으로 강의가 삭제되었습니다', { type: 'success' });
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
        toast('성공적으로 강의 만료 일시가 업데이트되었습니다', {
          type: 'success',
        });
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
        toast('성공적으로 강사 정보가 업데이트되었습니다', { type: 'success' });
        setUpdateTeacherToggle(!updateTeacherToggle);
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingSubmitUpdateTeacher(false);
    }
  };
  return (
    <div className="w-[90vw] justify-self-center border-[1px] p-[15px] sm:w-[560px]">
      <button
        className="mx-auto flex w-max items-center justify-center rounded-2xl border-[1px] border-black px-[15px] py-[5px] hover:bg-black hover:text-white disabled:opacity-50"
        disabled={isLoadingClickDeleteLecture}
        onClick={onClickDeleteLecture}
      >
        <div>강의 삭제하기</div>
        <FontAwesomeIcon className="ml-[20px]" icon={faTrash} />
      </button>
      <div className="bg-white text-xs text-shuttle-gray">
        <ComponentFormUpdateImage
          token={token}
          fieldType="thumbnail"
          lectureId={id}
          userField={thumbnail}
          mutate={mutate}
          imageIndex={null}
        />
      </div>
      <div className="bg-white text-xs text-shuttle-gray">
        {updateExpiredToggle ? (
          <form
            className="mt-[10px] block sm:flex sm:items-center"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmitUpdateExpired();
            }}
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDateTimePicker
                className="h-[32px] w-full"
                format="yyyy년 MM월 dd일 hh시 mm분 ss초"
                value={expiredAt}
                margin="none"
                onChange={onHandleExpiredAt}
                disabled={isLoadingSubmitUpdateExpired}
              />
            </MuiPickersUtilsProvider>
            <div className="mb-[10px] mt-[5px] flex items-center justify-end sm:justify-start">
              <button
                className="button-modify-cancel-admin mx-[10px] h-[32px] w-[65px]"
                disabled={isLoadingSubmitUpdateExpired}
                type="submit"
              >
                수정
              </button>
              <button
                className="button-modify-cancel-admin h-[32px] w-[65px]"
                disabled={isLoadingSubmitUpdateExpired}
                onClick={onClickUpdateExpiredToggle}
              >
                취소
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-[10px] flex items-center">
            <div className="flex w-full items-center rounded-[10px] bg-harp p-[10px] text-xs text-gray-200">
              {!!!expired && <div>강의 만료 일시가 설정되어 있지 않습니다</div>}
              {!!expired && moment(expired).format('YYYY-MM-DD HH:mm:ss')}
            </div>
            <FontAwesomeIcon
              className="button-fa-icon-admin ml-[10px]"
              icon={faEdit}
              onClick={onClickUpdateExpiredToggle}
            />
          </div>
        )}
      </div>
      <ComponentFormUpdateLecture
        token={token}
        fieldType="title"
        lectureId={id}
        userField={title}
        mutate={mutate}
      />
      {updateTeacherToggle ? (
        <form
          className="mt-[10px] block sm:flex sm:items-center"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitUpdateTeacher();
          }}
        >
          <input
            className="box-border h-[32px] w-full rounded-[10px] border-[1px] border-[#DCDEE2] bg-[#F3FBFE] px-[20px] py-[10px] text-[0.875rem] font-medium placeholder-[#DCDEE2] focus:border-[#00A0E9] focus:bg-white focus:outline-none disabled:opacity-50"
            type="text"
            value={updateTeacherName}
            onChange={onChangeUpdateTeacherName}
            disabled={isLoadingSubmitUpdateTeacher}
          />
          <div className="mb-[10px] mt-[5px] flex items-center justify-end sm:justify-start">
            <button
              className="button-modify-cancel-admin mx-[10px] h-[32px] w-[65px]"
              type="submit"
              disabled={isLoadingSubmitUpdateTeacher}
            >
              수정
            </button>
            <button
              className="button-modify-cancel-admin h-[32px] w-[65px]"
              onClick={onClickUpdateTeacherToggle}
              disabled={isLoadingSubmitUpdateTeacher}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-[10px] flex items-center">
          <div className="flex w-full items-center rounded-[10px] bg-harp p-[10px] text-xs text-gray-200">
            {'강사 이름 : ' + teacherNickname}
          </div>
          <FontAwesomeIcon
            className="button-fa-icon-admin ml-[10px]"
            icon={faEdit}
            onClick={onClickUpdateTeacherToggle}
          />
        </div>
      )}
      <ComponentFormUpdateLecture
        token={token}
        fieldType="description"
        lectureId={id}
        userField={description}
        mutate={mutate}
      />
      <div className="bg-white text-xs text-shuttle-gray">
        {!!images &&
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
      <ComponentFormUpdateLecture
        token={token}
        fieldType="video_title"
        lectureId={id}
        userField={videoTitle}
        mutate={mutate}
      />
      <ComponentFormUpdateLecture
        token={token}
        fieldType="video_url"
        lectureId={id}
        userField={videoUrl}
        mutate={mutate}
      />
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
