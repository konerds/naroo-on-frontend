import * as React from 'react';
import 'moment/locale/ko';
import moment from 'moment';
import axios from 'axios';
import { ILectureDetail } from '../../interfaces';
import { useStringInput } from '../../hooks';
import { KeyedMutator } from 'swr';
import { showError } from '../../hooks/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import MediaQuery from 'react-responsive';
import { toast } from 'react-toastify';

interface LectureNoticeProps {
  token: string | null;
  userType?: string | null;
  mutate: KeyedMutator<ILectureDetail>;
  lecture_id: string;
  array_index: number;
  id: string;
  created_at: string;
  title: string;
  description: string;
}

const LectureNotice: React.FC<LectureNoticeProps> = ({
  token,
  userType,
  mutate,
  lecture_id,
  array_index,
  id,
  created_at,
  title,
  description,
}) => {
  const [isShowDescription, setIsShowDescription] =
    React.useState<boolean>(false);
  const [isShowEdit, setIsShowEdit] = React.useState<boolean>(false);
  const { value: updateTitle, onChange: onChangeUpdateTitle } =
    useStringInput(title);
  const { value: updateDescription, onChange: onChangeUpdateDescription } =
    useStringInput(description);
  const [isLoadingClickDeleteNotice, setIsLoadingClickDeleteNotice] =
    React.useState<boolean>(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = React.useState<boolean>(false);
  const onClickDeleteNoticeHandler = async (noticeId: string) => {
    try {
      setIsLoadingClickDeleteNotice(true);
      const response = await axios.delete(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/notice/${lecture_id}?notice_id=${noticeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        toast('성공적으로 공지사항이 삭제되었습니다', { type: 'success' });
        await mutate();
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingClickDeleteNotice(false);
    }
  };
  const onSubmitUpdateNoticeHandler = async () => {
    try {
      setIsLoadingSubmit(true);
      const response = await axios.put(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/notice/modify/${lecture_id}?notice_id=${id}`,
        {
          title: updateTitle,
          description: updateDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        toast('성공적으로 공지사항이 업데이트되었습니다', { type: 'success' });
        await mutate();
        setIsShowEdit(false);
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingSubmit(false);
    }
  };
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmitUpdateNoticeHandler();
      }}
    >
      <div
        className="min-h-[41px] bg-white flex"
        onClick={() => {
          setIsShowEdit(false);
          setIsShowDescription(!isShowDescription);
        }}
      >
        <div className="w-full flex items-center min-h-[41px]">
          <div className="flex-none min-w-[20px] max-w-[20px] sm:min-w-[60px] sm:max-w-[60px] flex justify-center items-center">
            <div className="text-[0.5rem] sm:text-[0.875rem] text-[#DCDEE2]">
              {array_index}
            </div>
          </div>
          {isShowEdit ? (
            <input
              className="flex-1 flex justify-start overflow-x-hidden items-center border-[1px] rounded-[4px] my-[10px] px-[4px] text-[0.875rem] text-[#515A6E] ml-[8.5px] disabled:opacity-50"
              value={updateTitle}
              onChange={onChangeUpdateTitle}
              onClick={(event) => {
                event.stopPropagation();
              }}
              disabled={isLoadingSubmit}
            />
          ) : (
            <div className="flex-1 flex break-all justify-start items-stretch my-[10px] py-[4px] pl-[8.5px] pr-[20px] text-[0.5rem] sm:text-[0.875rem] text-[#515A6E]">
              {title}
            </div>
          )}
          <div className="flex-none min-w-[40px] max-w-[40px] sm:min-w-[126px] sm:max-w-[126px] flex justify-end items-center mr-[10px] sm:mr-[20px]">
            <div
              className="text-[0.5rem] sm:text-[0.875rem] text-[#DCDEE2]"
              title={moment(created_at).format('YYYY년 MM월 DD일 HH시 mm분')}
            >
              <MediaQuery maxWidth={639.98}>
                {moment(created_at).format('YYMMDD')}
              </MediaQuery>
              <MediaQuery minWidth={640}>
                {moment(created_at).format('YYYY년 MM월 DD일')}
              </MediaQuery>
            </div>
          </div>
        </div>
      </div>
      {isShowDescription ? (
        <>
          <div className="w-full flex items-center min-h-[41px]">
            <div className="flex-none min-w-[20px] max-w-[20px] sm:min-w-[60px] sm:max-w-[60px] flex justify-center items-center">
              <div className="text-[0.5rem] sm:text-[0.875rem] text-[#DCDEE2]">
                내용
              </div>
            </div>
            {isShowEdit ? (
              <textarea
                className="flex-1 flex justify-start items-stretch border-[1px] rounded-[4px] my-[10px] px-[4px] text-[0.875rem] text-[#515A6E] ml-[8.5px] mr-[10px] sm:mr-[20px] disabled:opacity-50"
                value={updateDescription}
                onChange={onChangeUpdateDescription}
                disabled={isLoadingSubmit}
              />
            ) : (
              <div className="flex-1 flex break-all justify-start items-stretch my-[10px] py-[4px] pl-[8.5px] pr-[20px] text-[0.5rem] sm:text-[0.875rem] text-[#515A6E]">
                {description}
              </div>
            )}
            <div className="flex-none min-w-[40px] max-w-[40px] sm:min-w-[126px] sm:max-w-[126px] flex justify-center items-start">
              {token && userType === 'admin' && (
                <>
                  {isShowEdit ? (
                    <div className="w-full min-h-[41px] bg-white flex justify-center items-center">
                      <button
                        type="submit"
                        className="min-w-[21px] max-w-[21px] min-h-[21px] max-h-[21px] sm:min-w-[unset] sm:max-w-[unset] sm:min-h-[unset] sm:max-h-[unset] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] sm:max-w-max font-normal sm:text-[0.75rem] text-[#808695] p-[5px] sm:px-[10px] sm:py-[4px] disabled:opacity-50 disabled:opacity-50 hover:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoadingSubmit}
                      >
                        <MediaQuery maxWidth={639.98}>
                          <FontAwesomeIcon
                            className="block text-[0.6rem]"
                            icon={faCheck}
                          />
                        </MediaQuery>
                        <MediaQuery minWidth={640}>완료</MediaQuery>
                      </button>
                      <button
                        type="button"
                        className="min-w-[21px] max-w-[21px] min-h-[21px] max-h-[21px] sm:min-w-[unset] sm:max-w-[unset] sm:min-h-[unset] sm:max-h-[unset] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] sm:max-w-max font-normal sm:text-[0.75rem] text-[#808695] ml-[3px] mr-[10px] sm:ml-[10px] sm:mr-[18px] p-[5px] sm:px-[10px] sm:py-[4px] disabled:opacity-50 disabled:opacity-50 hover:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => {
                          setIsShowEdit(false);
                        }}
                        disabled={isLoadingSubmit}
                      >
                        <MediaQuery maxWidth={639.98}>
                          <FontAwesomeIcon
                            className="block text-[0.6rem] ml-[2px]"
                            icon={faXmark}
                          />
                        </MediaQuery>
                        <MediaQuery minWidth={640}>취소</MediaQuery>
                      </button>
                    </div>
                  ) : (
                    <div className="w-full sm:min-h-[41px] bg-white flex justify-center items-center">
                      <button
                        type="button"
                        className="min-w-[21px] max-w-[21px] min-h-[21px] max-h-[21px] sm:min-w-[unset] sm:max-w-[unset] sm:min-h-[unset] sm:max-h-[unset] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] sm:max-w-max font-normal sm:text-[0.75rem] text-[#808695] p-[5px] sm:px-[10px] sm:py-[4px] disabled:opacity-50 disabled:opacity-50 hover:opacity-50 disabled:cursor-not-allowed"
                        onClick={(event) => {
                          event.preventDefault();
                          setIsShowEdit(true);
                        }}
                        disabled={isLoadingClickDeleteNotice}
                      >
                        <MediaQuery maxWidth={639.98}>
                          <FontAwesomeIcon
                            className="block text-[0.6rem]"
                            icon={faEdit}
                          />
                        </MediaQuery>
                        <MediaQuery minWidth={640}>수정</MediaQuery>
                      </button>
                      <button
                        type="button"
                        className="min-w-[21px] max-w-[21px] min-h-[21px] max-h-[21px] sm:min-w-[unset] sm:max-w-[unset] sm:min-h-[unset] sm:max-h-[unset] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] sm:max-w-max font-normal sm:text-[0.75rem] text-[#808695] ml-[3px] mr-[10px] sm:ml-[10px] sm:mr-[18px] p-[5px] sm:px-[10px] sm:py-[4px] disabled:opacity-50 disabled:opacity-50 hover:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => {
                          onClickDeleteNoticeHandler(id);
                        }}
                        disabled={isLoadingClickDeleteNotice}
                      >
                        <MediaQuery maxWidth={639.98}>
                          <FontAwesomeIcon
                            className="block text-[0.6rem]"
                            icon={faTrash}
                          />
                        </MediaQuery>
                        <MediaQuery minWidth={640}>삭제</MediaQuery>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </form>
  );
};

export default LectureNotice;
