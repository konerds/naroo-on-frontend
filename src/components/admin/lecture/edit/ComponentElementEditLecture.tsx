import { FC, useState } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import { ILectureInList } from '../../../../interfaces';
import ComponentFormRegisterTags from '../../tag/ComponentFormRegisterTags';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useStringInput } from '../../../../hooks';
import ComponentFormUpdateImage from './form/ComponentFormUpdateImage';
import moment from 'moment';
import { showError, useSWRListLectureAll } from '../../../../hooks/api';
import ComponentFormUpdateLecture from './form/ComponentFormUpdateLecture';
import { toast } from 'react-toastify';
import stateToken from '../../../../recoil/state-object-token/stateToken';

interface IPropsComponentElementEditLecture {
  lecture: ILectureInList;
}

const ComponentElementEditLecture: FC<IPropsComponentElementEditLecture> = ({
  lecture,
}) => {
  const { mutate: mutateLectureAll } = useSWRListLectureAll();
  const {
    id,
    title,
    images,
    description,
    thumbnail,
    teacher_nickname,
    expired,
    tags,
    video_title,
    video_url,
  } = lecture;
  const token = useRecoilValue(stateToken);
  const [isLoadingClickDeleteLecture, setIsLoadingClickDeleteLecture] =
    useState<boolean>(false);
  const [updateExpiredToggle, setUpdateExpiredToggle] =
    useState<boolean>(false);
  const [expiredAt, setExpiredAt] = useState<Date | null>(
    !!expired ? new Date(expired) : null,
  );
  const [isLoadingSubmitUpdateExpired, setIsLoadingSubmitUpdateExpired] =
    useState<boolean>(false);
  const [updateTeacherToggle, setUpdateTeacherToggle] =
    useState<boolean>(false);
  const {
    value: updateTeacherName,
    setValue: setUpdateTeacherName,
    onChange: onChangeUpdateTeacherName,
  } = useStringInput(teacher_nickname);
  const [isLoadingSubmitUpdateTeacher, setIsLoadingSubmitUpdateTeacher] =
    useState<boolean>(false);
  const handlerDeleteLecture = async () => {
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
        await mutateLectureAll();
        toast('성공적으로 강의가 삭제되었습니다', { type: 'success' });
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingClickDeleteLecture(false);
    }
  };
  const handlerUpdateExpired = async () => {
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
        await mutateLectureAll();
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
  const handlerUpdateTeacher = async () => {
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
        await mutateLectureAll();
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
        onClick={handlerDeleteLecture}
      >
        <div>강의 삭제하기</div>
        <FontAwesomeIcon className="ml-[20px]" icon={faTrash} />
      </button>
      <div className="bg-white text-xs text-shuttle-gray">
        <ComponentFormUpdateImage
          fieldType="thumbnail"
          lectureId={id}
          userField={thumbnail}
          imageIndex={null}
        />
      </div>
      <div className="bg-white text-xs text-shuttle-gray">
        {updateExpiredToggle ? (
          <form
            className="mt-[10px] block sm:flex sm:items-center"
            onSubmit={(event) => {
              event.preventDefault();
              handlerUpdateExpired();
            }}
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDateTimePicker
                className="h-[32px] w-full"
                format="yyyy년 MM월 dd일 hh시 mm분 ss초"
                value={expiredAt}
                margin="none"
                onChange={(date: Date | null) => {
                  setExpiredAt(date);
                }}
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
                onClick={(e) => {
                  setUpdateExpiredToggle(!updateExpiredToggle);
                  setExpiredAt(!!expired ? new Date(expired) : null);
                }}
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
              onClick={(e) => {
                setUpdateExpiredToggle(!updateExpiredToggle);
                setExpiredAt(!!expired ? new Date(expired) : null);
              }}
            />
          </div>
        )}
      </div>
      <ComponentFormUpdateLecture
        fieldType="title"
        lectureId={id}
        userField={title}
      />
      {updateTeacherToggle ? (
        <form
          className="mt-[10px] block sm:flex sm:items-center"
          onSubmit={(event) => {
            event.preventDefault();
            handlerUpdateTeacher();
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
              onClick={(e) => {
                setUpdateTeacherToggle(!updateTeacherToggle);
                setUpdateTeacherName(teacher_nickname);
              }}
              disabled={isLoadingSubmitUpdateTeacher}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-[10px] flex items-center">
          <div className="flex w-full items-center rounded-[10px] bg-harp p-[10px] text-xs text-gray-200">
            {'강사 이름 : ' + teacher_nickname}
          </div>
          <FontAwesomeIcon
            className="button-fa-icon-admin ml-[10px]"
            icon={faEdit}
            onClick={(e) => {
              setUpdateTeacherToggle(!updateTeacherToggle);
              setUpdateTeacherName(teacher_nickname);
            }}
          />
        </div>
      )}
      <ComponentFormUpdateLecture
        fieldType="description"
        lectureId={id}
        userField={description}
      />
      <div className="bg-white text-xs text-shuttle-gray">
        {!!images &&
          images.length > 0 &&
          images.map((image, index) => {
            return (
              <ComponentFormUpdateImage
                key={index}
                fieldType="img_description"
                lectureId={id}
                userField={image}
                imageIndex={index + 1}
              />
            );
          })}
      </div>
      <ComponentFormUpdateLecture
        fieldType="video_title"
        lectureId={id}
        userField={video_title}
      />
      <ComponentFormUpdateLecture
        fieldType="video_url"
        lectureId={id}
        userField={video_url}
      />
      <ComponentFormRegisterTags
        lectureId={id}
        tags={tags && tags.length > 0 ? tags : []}
      />
    </div>
  );
};

export default ComponentElementEditLecture;
