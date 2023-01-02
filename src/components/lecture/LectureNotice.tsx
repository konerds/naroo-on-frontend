import * as React from 'react';
import 'moment/locale/ko';
import moment from 'moment';
import axios from 'axios';
import { ILectureDetail } from '../../interfaces';
import { useInput } from '../../hooks';
import { KeyedMutator } from 'swr';
import { showError } from '../../hooks/api';

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
  const [updateTitle, onChangeUpdateTitle, setUpdateTitle] = useInput(title);
  const [updateDescription, onChangeUpdateDescription, setUpdateDescription] =
    useInput(description);
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
        className="min-h-[41px] max-h-[41px] bg-white flex"
        onClick={() => {
          setIsShowEdit(false);
          setIsShowDescription(!isShowDescription);
        }}
      >
        <div className="w-full flex items-center min-h-[41px] max-h-[41px]">
          <div className="flex-none min-w-[60px] max-w-[60px] flex justify-center items-center">
            <div className="text-[14px] leading-[150%] text-[#DCDEE2]">
              {array_index}
            </div>
          </div>
          {isShowEdit ? (
            <input
              className="flex-1 flex justify-start overflow-x-hidden items-center border-[1px] rounded-[4px] my-[10px] px-[4px] text-[14px] leading-[150%] text-[#515A6E] ml-[8.5px] disabled:opacity-50"
              value={updateTitle}
              onChange={onChangeUpdateTitle}
              onClick={(event) => {
                event.stopPropagation();
              }}
              disabled={isLoadingSubmit}
            />
          ) : (
            <div className="flex-1 flex overflow-x-hidden justify-start items-stretch my-[10px] py-[4px]">
              <div className="pl-[8.5px] text-[14px] leading-[150%] text-[#515A6E]">
                {title}
              </div>
            </div>
          )}
          <div className="flex-none min-w-[126px] max-w-[126px] flex justify-end items-center mr-[20px]">
            <div
              className="text-[14px] leading-[150%] text-[#DCDEE2]"
              title={moment(created_at).format('YYYY년 MM월 DD일 HH시 mm분')}
            >
              {moment(created_at).format('YYYY년 MM월 DD일')}
            </div>
          </div>
        </div>
      </div>
      {isShowDescription ? (
        <>
          <div className="w-full flex items-center min-h-[41px]">
            <div className="flex-none min-w-[60px] max-w-[60px] flex justify-center items-center">
              <div className="text-[14px] leading-[150%] text-[#DCDEE2]">
                내용
              </div>
            </div>
            {isShowEdit ? (
              <textarea
                className="flex-1 flex justify-start items-stretch border-[1px] rounded-[4px] my-[10px] px-[4px] text-[14px] leading-[150%] text-[#515A6E] ml-[8.5px] mr-[20px] disabled:opacity-50"
                value={updateDescription}
                onChange={onChangeUpdateDescription}
                disabled={isLoadingSubmit}
              />
            ) : (
              <div className="flex-1 flex break-all justify-start items-stretch my-[10px] py-[4px]">
                <div className="pl-[8.5px] pr-[20px] text-[14px] leading-[150%] text-[#515A6E]">
                  {description}
                </div>
              </div>
            )}
            <div className="flex-none min-w-[126px] max-w-[126px] flex justify-center items-start">
              {token && userType === 'admin' && (
                <>
                  {isShowEdit ? (
                    <div className="w-full min-h-[41px] bg-white flex justify-center items-center">
                      <button
                        type="submit"
                        className="flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] max-w-max font-normal text-[12px] leading-[150%] text-[#808695] px-[10px] py-[4px] disabled:opacity-50"
                        disabled={isLoadingSubmit}
                      >
                        완료
                      </button>
                      <button
                        type="button"
                        className="flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] max-w-max font-normal text-[12px] leading-[150%] text-[#808695] ml-[10px] mr-[18px] px-[10px] py-[4px] disabled:opacity-50"
                        onClick={() => {
                          setIsShowEdit(false);
                        }}
                        disabled={isLoadingSubmit}
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <div className="w-full min-h-[41px] bg-white flex justify-center items-center">
                      <button
                        type="button"
                        className="flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] max-w-max font-normal text-[12px] leading-[150%] text-[#808695] px-[10px] py-[4px] disabled:opacity-50"
                        onClick={(event) => {
                          event.preventDefault();
                          setIsShowEdit(true);
                        }}
                        disabled={isLoadingClickDeleteNotice}
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        className="flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] max-w-max font-normal text-[12px] leading-[150%] text-[#808695] ml-[10px] mr-[18px] px-[10px] py-[4px] disabled:opacity-50"
                        onClick={() => {
                          onClickDeleteNoticeHandler(id);
                        }}
                        disabled={isLoadingClickDeleteNotice}
                      >
                        삭제
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
