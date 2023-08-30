import { FC, useState } from 'react';
import { useRecoilValue } from 'recoil';
import 'moment/locale/ko';
import moment from 'moment';
import axios from 'axios';
import { useStringInput } from '../../hooks';
import { showError, useSWRDetailLecture, useSWRInfoMe } from '../../hooks/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import MediaQuery from 'react-responsive';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import stateToken from '../../recoil/state-object-token/stateToken';
import { INoticesInLecture } from '../../interfaces';

interface LectureNoticeProps {
  lecture_id: string;
  array_index: number;
  notice: INoticesInLecture;
}

const LectureNotice: FC<LectureNoticeProps> = ({
  lecture_id,
  array_index,
  notice,
}) => {
  const { id } = useParams<{ id: string }>();
  const { mutate: mutateDetailLecture } = useSWRDetailLecture(id);
  const token = useRecoilValue(stateToken);
  const { data: dataInfoMe } = useSWRInfoMe();
  const { id: idNotice, created_at, title, description } = notice;
  const [isShowDescription, setIsShowDescription] = useState<boolean>(false);
  const [isShowEdit, setIsShowEdit] = useState<boolean>(false);
  const { value: updateTitle, onChange: onChangeUpdateTitle } =
    useStringInput(title);
  const { value: updateDescription, onChange: onChangeUpdateDescription } =
    useStringInput(description);
  const [isLoadingClickDeleteNotice, setIsLoadingClickDeleteNotice] =
    useState<boolean>(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const handlerDeleteNotice = async (noticeId: string) => {
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
        await mutateDetailLecture();
        toast('성공적으로 공지사항이 삭제되었습니다', { type: 'success' });
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingClickDeleteNotice(false);
    }
  };
  const handlerUpdateNotice = async () => {
    try {
      setIsLoadingSubmit(true);
      const response = await axios.put(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/notice/modify/${lecture_id}?notice_id=${idNotice}`,
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
        await mutateDetailLecture();
        toast('성공적으로 공지사항이 업데이트되었습니다', { type: 'success' });
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
        handlerUpdateNotice();
      }}
    >
      <div
        className="flex min-h-[41px] bg-white"
        onClick={() => {
          setIsShowEdit(false);
          setIsShowDescription(!isShowDescription);
        }}
      >
        <div className="flex min-h-[41px] w-full items-center">
          <div className="flex min-w-[20px] max-w-[20px] flex-none items-center justify-center sm:min-w-[60px] sm:max-w-[60px]">
            <div className="text-[0.5rem] text-[#DCDEE2] sm:text-[0.875rem]">
              {array_index}
            </div>
          </div>
          {isShowEdit ? (
            <input
              className="my-[10px] ml-[8.5px] flex flex-1 items-center justify-start overflow-x-hidden rounded-[4px] border-[1px] px-[4px] text-[0.875rem] text-[#515A6E] disabled:opacity-50"
              value={updateTitle}
              onChange={onChangeUpdateTitle}
              onClick={(event) => {
                event.stopPropagation();
              }}
              disabled={isLoadingSubmit}
            />
          ) : (
            <div className="my-[10px] flex flex-1 items-stretch justify-start break-all py-[4px] pl-[8.5px] pr-[20px] text-[0.5rem] text-[#515A6E] sm:text-[0.875rem]">
              {title}
            </div>
          )}
          <div className="mr-[10px] flex min-w-[40px] max-w-[40px] flex-none items-center justify-end sm:mr-[20px] sm:min-w-[126px] sm:max-w-[126px]">
            <div
              className="text-[0.5rem] text-[#DCDEE2] sm:text-[0.875rem]"
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
          <div className="flex min-h-[41px] w-full items-center">
            <div className="flex min-w-[20px] max-w-[20px] flex-none items-center justify-center sm:min-w-[60px] sm:max-w-[60px]">
              <div className="text-[0.5rem] text-[#DCDEE2] sm:text-[0.875rem]">
                내용
              </div>
            </div>
            {isShowEdit ? (
              <textarea
                className="my-[10px] ml-[8.5px] mr-[10px] flex flex-1 items-stretch justify-start rounded-[4px] border-[1px] px-[4px] text-[0.875rem] text-[#515A6E] disabled:opacity-50 sm:mr-[20px]"
                value={updateDescription}
                onChange={onChangeUpdateDescription}
                disabled={isLoadingSubmit}
              />
            ) : (
              <div className="my-[10px] flex flex-1 items-stretch justify-start break-all py-[4px] pl-[8.5px] pr-[20px] text-[0.5rem] text-[#515A6E] sm:text-[0.875rem]">
                {description}
              </div>
            )}
            <div className="flex min-w-[40px] max-w-[40px] flex-none items-start justify-center sm:min-w-[126px] sm:max-w-[126px]">
              {!!token && !!dataInfoMe && dataInfoMe.role === 'admin' && (
                <>
                  {isShowEdit ? (
                    <div className="flex min-h-[41px] w-full items-center justify-center bg-white">
                      <button
                        type="submit"
                        className="max-h-[21px] min-h-[21px] min-w-[21px] max-w-[21px] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] p-[5px] font-normal text-[#808695] hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-50 sm:max-h-[unset] sm:min-h-[unset] sm:min-w-[unset] sm:max-w-max sm:px-[10px] sm:py-[4px] sm:text-[0.75rem]"
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
                        className="ml-[3px] mr-[10px] max-h-[21px] min-h-[21px] min-w-[21px] max-w-[21px] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] p-[5px] font-normal text-[#808695] hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-[10px] sm:mr-[18px] sm:max-h-[unset] sm:min-h-[unset] sm:min-w-[unset] sm:max-w-max sm:px-[10px] sm:py-[4px] sm:text-[0.75rem]"
                        onClick={() => {
                          setIsShowEdit(false);
                        }}
                        disabled={isLoadingSubmit}
                      >
                        <MediaQuery maxWidth={639.98}>
                          <FontAwesomeIcon
                            className="ml-[2px] block text-[0.6rem]"
                            icon={faXmark}
                          />
                        </MediaQuery>
                        <MediaQuery minWidth={640}>취소</MediaQuery>
                      </button>
                    </div>
                  ) : (
                    <div className="flex w-full items-center justify-center bg-white sm:min-h-[41px]">
                      <button
                        type="button"
                        className="max-h-[21px] min-h-[21px] min-w-[21px] max-w-[21px] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] p-[5px] font-normal text-[#808695] hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-50 sm:max-h-[unset] sm:min-h-[unset] sm:min-w-[unset] sm:max-w-max sm:px-[10px] sm:py-[4px] sm:text-[0.75rem]"
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
                        className="ml-[3px] mr-[10px] max-h-[21px] min-h-[21px] min-w-[21px] max-w-[21px] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] p-[5px] font-normal text-[#808695] hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-[10px] sm:mr-[18px] sm:max-h-[unset] sm:min-h-[unset] sm:min-w-[unset] sm:max-w-max sm:px-[10px] sm:py-[4px] sm:text-[0.75rem]"
                        onClick={() => {
                          handlerDeleteNotice(idNotice);
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
