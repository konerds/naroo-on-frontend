import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import { axiosGetfetcher, showError } from '../hooks/api';
import useSWR from 'swr';
import Moment from 'react-moment';
import 'moment/locale/ko';
import axios from 'axios';
import { useInput } from '../hooks';
import { IInfoMe, ILectureDetail } from '../interfaces';
import Skeleton from 'react-loading-skeleton';
import LectureNotice from '../components/lecture/LectureNotice';
import ImgEdit from '../assets/images/Edit.svg';
import ImgClose from '../assets/images/Close.svg';
import LectureQuestion from '../components/lecture/LectureQuestion';
import TokenContext from '../store/TokenContext';

interface IPropsPageLectureDetail {}

export const CONST_LECTURE_DETAIL_MENU = {
  LECTURE_INTRODUCE: 'lecture_introduce',
  LECTURE_NOTICE: 'lecture_notice',
  LECTURE_QNA: 'lecture_qna',
} as const;

export type LECTURE_DETAIL_MENU =
  typeof CONST_LECTURE_DETAIL_MENU[keyof typeof CONST_LECTURE_DETAIL_MENU];

const PageLectureDetail: React.FC<IPropsPageLectureDetail> = ({}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tokenCtx = React.useContext(TokenContext);
  const { token } = tokenCtx;
  const [selectedMenu, setSelectedMenu] = React.useState<LECTURE_DETAIL_MENU>(
    CONST_LECTURE_DETAIL_MENU.LECTURE_INTRODUCE,
  );
  const [noticeTitle, onChangeNoticeTitle, setNoticeTitle] = useInput('');
  const [noticeDescription, onChangeNoticeDescription, setNoticeDescription] =
    useInput('');
  const [isShowAddNotice, setIsShowAddNotice] = React.useState<boolean>(false);
  const [isLoadingSubmitNotice, setIsLoadingSubmitNotice] =
    React.useState<boolean>(false);
  const [questionTitle, onChangeQuestionTitle, setQuestionTitle] = useInput('');
  const [
    questionDescription,
    onChangeQuestionDescription,
    setQuestionDescription,
  ] = useInput('');
  const [isShowAddQuestion, setIsShowAddQuestion] =
    React.useState<boolean>(false);
  const [isLoadingSubmitQuestion, setIsLoadingSubmitQuestion] =
    React.useState<boolean>(false);
  const { data: dataGetMe, error: errorGetMe } = useSWR<IInfoMe>(
    !!token ? `${process.env.REACT_APP_BACK_URL}/user/me` : null,
    () => axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/user/me`, token),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const {
    data: dataDetailLecture,
    mutate: mutateDetailLecture,
    error: errorDetailLecture,
  } = !!dataGetMe && !!!errorGetMe
    ? useSWR<ILectureDetail>(
        `${process.env.REACT_APP_BACK_URL}/lecture/${id}`,
        () =>
          axiosGetfetcher(
            `${process.env.REACT_APP_BACK_URL}/lecture/${id}`,
            token,
          ),
        { revalidateOnFocus: false, revalidateIfStale: false },
      )
    : useSWR<ILectureDetail>(
        `${process.env.REACT_APP_BACK_URL}/lecture/guest/${id}`,
        () =>
          axiosGetfetcher(
            `${process.env.REACT_APP_BACK_URL}/lecture/guest/${id}`,
          ),
        { revalidateOnFocus: false, revalidateIfStale: false },
      );
  const onPlayLectureHandler = async () => {
    if (!!dataDetailLecture) {
      if (dataDetailLecture.status === 'accept') {
        navigate(`/lecture-play/${id}`);
      } else if (!!!dataDetailLecture.status) {
        if (
          !!token &&
          !!dataGetMe &&
          !!!errorGetMe &&
          dataGetMe.role === 'student'
        ) {
          try {
            const response = await axios.put(
              `${process.env.REACT_APP_BACK_URL}/lecture/${id}`,
              null,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            if (response.status === 200) {
              await mutateDetailLecture();
            }
          } catch (error: any) {
            showError(error);
          }
        } else {
          navigate('/signin');
        }
      }
    }
  };
  const onSubmitNoticeHandler = async () => {
    try {
      setIsLoadingSubmitNotice(true);
      const response = await axios.put(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/notice/${id}`,
        {
          title: noticeTitle,
          description: noticeDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        await mutateDetailLecture();
        setNoticeTitle('');
        setNoticeDescription('');
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingSubmitNotice(false);
    }
  };
  const onSubmitQuestionHandler = async () => {
    try {
      setIsLoadingSubmitQuestion(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/lecture/question/${id}`,
        {
          title: questionTitle,
          description: questionDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 201) {
        await mutateDetailLecture();
        setQuestionTitle('');
        setQuestionDescription('');
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingSubmitQuestion(false);
    }
  };
  return (
    <>
      {!!dataDetailLecture && !!!errorDetailLecture && (
        <>
          <div className="w-full bg-gradient-to-br from-[#8DC556] to-[#00A0E9]">
            <div className="hidden lg:flex w-full xl:max-w-[1152px] lg:max-w-[864px] md:max-w-[680px] sm:max-w-[500px] xs:max-w-[400px] xl:min-h-[506px] xl:max-h-[506px] lg:min-h-[431.79px] lg:max-h-[431.79px] mx-auto items-center justify-center">
              <img
                className="xl:mr-[150px] lg:mr-[128px] xl:min-w-[346px] xl:max-w-[346px] xl:min-h-[346px] xl:max-h-[346px] lg:min-w-[295.25px] lg:max-w-[295.25px] lg:min-h-[295.25px] lg:max-h-[295.25px] object-fill rounded-[4px] lecture-detail-thumbnail-container"
                src={
                  !!dataDetailLecture.thumbnail
                    ? dataDetailLecture.thumbnail
                    : ''
                }
              />
              <div className="xl:min-w-[644px] xl:max-w-[644px] lg:min-w-[549.55px] lg:max-w-[549.55px] xl:min-h-[346px] xl:max-h-[346px] lg:min-h-[295.25px] lg:max-h-[295.25px] flex flex-col justify-between">
                <div className="w-full max-h-[96px] overflow-hidden text-white text-[32px] leading-[150%] font-semibold">
                  {!!dataDetailLecture.title && dataDetailLecture.title}
                </div>
                <div className="flex wrap items-center w-full min-h-[209.5px] max-h-[209.5px]">
                  <div className="block w-full">
                    <div className="mb-[30px] w-full flex justify-between items-center text-white text-[16px] leading-[150%] font-semibold">
                      <div>
                        {!!dataDetailLecture.teacher_nickname
                          ? dataDetailLecture.teacher_nickname
                          : ''}
                      </div>
                      <div className="text-[16px] text-white leading-[150%] font-semibold">
                        현재{' '}
                        {!!dataDetailLecture.users
                          ? dataDetailLecture.users
                          : 0}
                        명이 수강하고 있어요!
                      </div>
                    </div>
                    <div className="w-full max-h-[96px] overflow-hidden text-[16px] text-white leading-[24px] font-semibold">
                      {!!dataDetailLecture.description
                        ? dataDetailLecture.description
                        : ''}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full min-h-[41px] max-h-[41px]">
                  {((!!dataGetMe &&
                    !!!errorGetMe &&
                    dataGetMe.role === 'student') ||
                    !!!token) && (
                    <button
                      type="button"
                      onClick={onPlayLectureHandler}
                      className={`rounded-[4px] xl:min-w-[132px] xl:max-w-[132px] lg:min-w-[112.64px] lg:max-w-[112.64px] min-h-[41px] max-h-[41px] text-[#4DBFF0] text-[14px] font-semibold leading-[150%] bg-white ${
                        dataDetailLecture.status === 'apply' ||
                        dataDetailLecture.status === 'reject' ||
                        dataDetailLecture.status === 'expired'
                          ? 'disabled:opacity-50'
                          : ''
                      }`}
                      disabled={
                        dataDetailLecture.status === 'apply' ||
                        dataDetailLecture.status === 'reject' ||
                        dataDetailLecture.status === 'expired'
                          ? true
                          : false
                      }
                    >
                      {dataDetailLecture.status === 'expired' ? (
                        '수강 만료'
                      ) : (
                        <>
                          {!!token ? (
                            <>
                              {!!dataDetailLecture.status ? (
                                <>
                                  {{
                                    apply: '수강 신청',
                                    reject: '승인 거부',
                                    accept: '학습 하기',
                                  }}
                                  [dataDetailLecture.status]
                                </>
                              ) : (
                                <>
                                  {!!token &&
                                    !!!dataDetailLecture.status &&
                                    '수강 신청'}
                                </>
                              )}
                            </>
                          ) : (
                            <>{!!!dataDetailLecture.status && '로그인 필요'}</>
                          )}
                        </>
                      )}
                    </button>
                  )}
                  <div className="text-[14px] leading-[150%] text-white font-semibold">
                    {!!dataDetailLecture.expired && (
                      <>
                        {new Date(dataDetailLecture.expired).toISOString() >=
                        new Date().toISOString() ? (
                          <Moment
                            date={new Date(dataDetailLecture.expired)}
                            durationFromNow
                            filter={(date) => {
                              return date.replace('-', '');
                            }}
                            format="마감까지 DD일 HH시간 mm분 남았어요"
                          />
                        ) : (
                          '수강 기간이 만료된 강의입니다'
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full mx-auto md:max-w-[680px] sm:max-w-[500px] xs:max-w-[400px] lg:hidden bg-gradient-to-br from-[#8DC556] to-[#00A0E9] items-center justify-center pt-[2vh]">
              <img
                className="mx-auto rounded-[4px] lecture-detail-thumbnail-container object-fill"
                src={
                  dataDetailLecture.thumbnail ? dataDetailLecture.thumbnail : ''
                }
              />
              <div className="flex mx-auto justify-between items-center min-h-[96px] max-h-[96px] mt-[1vh]">
                <div className="flex-1 overflow-hidden max-w-max max-h-[75px] text-white text-[18px] leading-[150%] font-semibold">
                  {dataDetailLecture.title && dataDetailLecture.title}
                </div>
                {((!!token &&
                  !!dataGetMe &&
                  !!!errorGetMe &&
                  dataGetMe.role === 'student') ||
                  !!!token) && (
                  <button
                    type="button"
                    onClick={onPlayLectureHandler}
                    className={`flex-1 rounded-[4px] max-w-[176px] h-[54px] font-semibold leading-[150%] text-[#4DBFF0] text-[14px] bg-white ${
                      dataDetailLecture.status === 'apply' ||
                      dataDetailLecture.status === 'reject' ||
                      dataDetailLecture.status === 'expired'
                        ? 'disabled:opacity-50'
                        : ''
                    }`}
                    disabled={
                      dataDetailLecture.status === 'apply' ||
                      dataDetailLecture.status === 'reject' ||
                      dataDetailLecture.status === 'expired'
                        ? true
                        : false
                    }
                  >
                    {dataDetailLecture.status === 'expired' ? (
                      '수강 만료'
                    ) : (
                      <>
                        {!!token ? (
                          <>
                            {!!dataDetailLecture.status ? (
                              <>
                                {{
                                  apply: '수강 신청',
                                  reject: '승인 거부',
                                  accept: '학습 하기',
                                }}
                                [dataDetailLecture.status]
                              </>
                            ) : (
                              <>
                                {!!token &&
                                  !!!dataDetailLecture.status &&
                                  '수강 신청'}
                              </>
                            )}
                          </>
                        ) : (
                          <>{!!!dataDetailLecture.status && '로그인 필요'}</>
                        )}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="w-full mt-[40.25px] h-[44px] flex justify-center items-center">
            <div className="flex-1 h-[44px] border-b-[1px] border-[#8DC556]"></div>
            <button
              type="button"
              className={`flex-none w-[120px] h-[44px] text-[16px] leading-[22px] font-medium border-[#8DC556] ${
                selectedMenu === CONST_LECTURE_DETAIL_MENU.LECTURE_INTRODUCE
                  ? 'text-[#8DC556] border-t-[1px] border-l-[1px] border-r-[1px]'
                  : 'text-[#808695] border-b-[1px]'
              }`}
              onClick={() =>
                setSelectedMenu(CONST_LECTURE_DETAIL_MENU.LECTURE_INTRODUCE)
              }
            >
              강의 소개
            </button>
            <button
              type="button"
              className={`flex-none w-[120px] h-[44px] text-[16px] leading-[22px] font-medium border-[#8DC556] ${
                selectedMenu === CONST_LECTURE_DETAIL_MENU.LECTURE_NOTICE
                  ? 'text-[#8DC556] border-t-[1px] border-l-[1px] border-r-[1px]'
                  : 'text-[#808695] border-b-[1px]'
              }`}
              onClick={() =>
                setSelectedMenu(CONST_LECTURE_DETAIL_MENU.LECTURE_NOTICE)
              }
            >
              공지사항
            </button>
            <button
              type="button"
              className={`flex-none w-[120px] h-[44px] text-[16px] leading-[22px] font-medium border-[#8DC556] ${
                selectedMenu === CONST_LECTURE_DETAIL_MENU.LECTURE_QNA
                  ? 'text-[#8DC556] border-t-[1px] border-l-[1px] border-r-[1px]'
                  : 'text-[#808695] border-b-[1px]'
              }`}
              onClick={() =>
                setSelectedMenu(CONST_LECTURE_DETAIL_MENU.LECTURE_QNA)
              }
            >
              문의하기
            </button>
            <div className="flex-1 h-[44px] border-b-[1px] border-[#8DC556]"></div>
          </div>
          <div className="mx-auto xl:max-w-[1152px] lg:max-w-[864px] md:max-w-[680px] sm:max-w-[500px] xs:max-w-[400px]">
            {selectedMenu === CONST_LECTURE_DETAIL_MENU.LECTURE_INTRODUCE && (
              <div className="min-h-[300px] pt-[50px] pb-[60px] mx-auto flex flex-wrap justify-center">
                {!!dataDetailLecture.images &&
                  Array.isArray(dataDetailLecture.images) &&
                  dataDetailLecture.images.length > 0 &&
                  dataDetailLecture.images.map((url) => {
                    return (
                      <img
                        key={url}
                        className="mb-[20px] last:mb-0 xl:w-[800px] lg:w-[682.67px] md:w-[512px] sm:w-full xs:w-full"
                        src={url}
                      />
                    );
                  })}
              </div>
            )}
            {selectedMenu === CONST_LECTURE_DETAIL_MENU.LECTURE_NOTICE && (
              <div className="min-h-[478px] py-[80px] mx-auto">
                {token &&
                  !!dataGetMe &&
                  !!!errorGetMe &&
                  dataGetMe.role === 'admin' &&
                  !!dataDetailLecture &&
                  isShowAddNotice && (
                    <form
                      className="min-h-[491px] max-h-[491px] mb-[60px] xl:px-[98px] lg:px-[50px] md:px-[30px] sm:px-[14px] xs:px-[10px] py-[68px] box-border border-[1px] rounded-[8px] border-[#DCDEE2] w-full"
                      onSubmit={(event) => {
                        event.preventDefault();
                        onSubmitNoticeHandler();
                      }}
                    >
                      <div className="mb-[28px] text-[#17233D] font-semibold text-[20px] leading-[150%]">
                        공지사항 등록
                      </div>
                      <div className="my-0">
                        <input
                          className="w-full border-[1px] min-h-[41px] max-h-[41px] border-[#DCDEE2] pl-[10px] py-[10px] text-[14px] leading-[150%] placeholder-[#DCDEE2] focus:border-[#8DC556] focus:outline-none disabled:opacity-50"
                          type="text"
                          value={noticeTitle}
                          onChange={onChangeNoticeTitle}
                          placeholder="제목을 입력하세요!"
                          disabled={isLoadingSubmitNotice}
                        />
                      </div>
                      <div className="mt-0 mb-[20px]">
                        <textarea
                          className="w-full min-h-[204px] max-h-[204px] border-[1px] border-[#DCDEE2] pl-[10px] py-[10px] text-[14px] leading-[150%] placeholder-[#DCDEE2] focus:border-[#8DC556] focus:outline-none disabled:opacity-50"
                          value={noticeDescription}
                          onChange={onChangeNoticeDescription}
                          placeholder="내용을 입력하세요!"
                          disabled={isLoadingSubmitNotice}
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full min-h-[41px] max-h-[41px] text-[14px] leading-[150%] font-semibold bg-[#8DC556] box-border border-[1px] border-[#8DC556] rounded-[4px] text-white my-0 disabled:opacity-50"
                        disabled={isLoadingSubmitNotice}
                      >
                        공지사항 등록
                      </button>
                    </form>
                  )}
                <div>
                  <div className="box-border rounded-[8px] border-[1px] border-[#DCDEE2] xl:px-[98px] lg:px-[50px] md:px-[30px] sm:px-[14px] xs:px-[10px] py-[60px] w-full">
                    <div className="w-full flex justify-between items-center mb-[20px]">
                      <div className="text-[#17233D] font-semibold text-[20px] leading-[150%]">
                        공지사항
                      </div>
                      {!!token &&
                      !!dataGetMe &&
                      !!!errorGetMe &&
                      dataGetMe.role === 'admin' &&
                      !!dataDetailLecture ? (
                        <button
                          type="button"
                          className="flex px-[10px] py-[4px] border-[1px] border-[#EBEEEF] rounded-[4px] bg-[#F9F9FA] disabled:opacity-50"
                          onClick={(event) => {
                            setIsShowAddNotice(!isShowAddNotice);
                          }}
                          disabled={isLoadingSubmitNotice}
                        >
                          {isShowAddNotice ? (
                            <>
                              <span className="m-auto mr-[4px] h-[18px] text-[12px] leading-[150%] font-medium text-[#808695]">
                                공지사항 등록
                              </span>
                              <img
                                className="w-[16px] h-[16px] m-auto object-fit"
                                src={ImgClose}
                              />
                            </>
                          ) : (
                            <>
                              <span className="m-auto mr-[4px] h-[18px] text-[12px] leading-[150%] font-medium text-[#808695]">
                                공지사항 등록
                              </span>
                              <img
                                className="w-[16px] h-[16px] m-auto object-fit"
                                src={ImgEdit}
                              />
                            </>
                          )}
                        </button>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="w-full rounded-[4px] border-[1px] border-[#EBEEEF]">
                      <div className="w-full h-[41px] bg-[#F9F9FA] flex">
                        <div className="flex-none min-w-[60px] max-w-[60px] flex justify-center items-center">
                          <div className="text-[14px] leading-[150%] font-semibold text-[#515A6E]">
                            No
                          </div>
                        </div>
                        <div className="flex items-center justify-center flex-1">
                          <div className="text-[14px] leading-[150%] font-semibold text-[#515A6E]">
                            제목
                          </div>
                        </div>
                        <div className="flex-none min-w-[126px] max-w-[126px] flex justify-end items-center mr-[20px]">
                          <div className="text-[14px] leading-[150%] font-semibold text-[#515A6E]">
                            작성일시
                          </div>
                        </div>
                      </div>
                      {!!dataDetailLecture &&
                      !!dataDetailLecture.notices &&
                      dataDetailLecture.notices.length > 0 ? (
                        !!dataDetailLecture.notices
                          .sort((a: any, b: any) => {
                            return (
                              new Date(b.created_at).getTime() -
                              new Date(a.created_at).getTime()
                            );
                          })
                          .map((notice, index) => {
                            return (
                              <LectureNotice
                                key={notice.id}
                                token={token}
                                userType={dataGetMe?.role}
                                mutate={mutateDetailLecture}
                                lecture_id={dataDetailLecture.id}
                                array_index={
                                  dataDetailLecture.notices.length - index
                                }
                                id={notice.id}
                                created_at={notice.created_at}
                                title={notice.title}
                                description={notice.description}
                              />
                            );
                          })
                      ) : (
                        <div className="flex items-center justify-center min-h-[41px] text-[14px] leading-[150%] font-medium text-[#515A6E]">
                          {!!!dataDetailLecture.notices ||
                          dataDetailLecture.notices.length === 0
                            ? '공지사항이 존재하지 않습니다'
                            : '잘못된 접근입니다'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {selectedMenu === CONST_LECTURE_DETAIL_MENU.LECTURE_QNA && (
              <div className="min-h-[478px] py-[80px] mx-auto">
                {!!token &&
                  !!dataGetMe &&
                  !!!errorGetMe &&
                  dataGetMe.role === 'student' &&
                  !!dataDetailLecture &&
                  isShowAddQuestion && (
                    <form
                      className="min-h-[491px] max-h-[491px] mb-[60px] xl:px-[98px] lg:px-[50px] md:px-[30px] sm:px-[14px] xs:px-[10px] py-[68px] box-border border-[1px] rounded-[8px] border-[#DCDEE2] w-full"
                      onSubmit={(event) => {
                        event.preventDefault();
                        onSubmitQuestionHandler();
                      }}
                    >
                      <div className="mb-[28px] text-[#17233D] font-semibold text-[20px] leading-[150%]">
                        문의사항 등록
                      </div>
                      <div className="my-0">
                        <input
                          className="w-full border-[1px] min-h-[41px] max-h-[41px] border-[#DCDEE2] pl-[10px] py-[10px] text-[14px] leading-[150%] placeholder-[#DCDEE2] focus:border-[#8DC556] focus:outline-none disabled:opacity-50"
                          type="text"
                          value={questionTitle}
                          onChange={onChangeQuestionTitle}
                          placeholder="제목을 입력하세요!"
                          disabled={isLoadingSubmitQuestion}
                        />
                      </div>
                      <div className="mt-0 mb-[20px]">
                        <textarea
                          className="w-full min-h-[204px] max-h-[204px] border-[1px] border-[#DCDEE2] pl-[10px] py-[10px] text-[14px] leading-[150%] placeholder-[#DCDEE2] focus:border-[#8DC556] focus:outline-none disabled:opacity-50"
                          value={questionDescription}
                          onChange={onChangeQuestionDescription}
                          placeholder="내용을 입력하세요!"
                          disabled={isLoadingSubmitQuestion}
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full min-h-[41px] max-h-[41px] text-[14px] leading-[150%] font-semibold bg-[#8DC556] box-border border-[1px] border-[#8DC556] rounded-[4px] text-white my-0 disabled:opacity-50"
                        disabled={isLoadingSubmitQuestion}
                      >
                        문의사항 등록
                      </button>
                    </form>
                  )}
                <div>
                  <div className="box-border rounded-[8px] border-[1px] border-[#DCDEE2] xl:px-[98px] lg:px-[50px] md:px-[30px] sm:px-[14px] xs:px-[10px] py-[60px] w-full">
                    <div className="w-full flex justify-between items-center mb-[20px]">
                      <div className="text-[#17233D] font-semibold text-[20px] leading-[150%]">
                        문의사항
                      </div>
                      {!!token &&
                      !!dataGetMe &&
                      !!!errorGetMe &&
                      dataGetMe.role === 'student' ? (
                        <button
                          type="button"
                          className="flex px-[10px] py-[4px] border-[1px] border-[#EBEEEF] rounded-[4px] bg-[#F9F9FA] disabled:opacity-50"
                          onClick={() => {
                            setIsShowAddQuestion(!isShowAddQuestion);
                          }}
                          disabled={isLoadingSubmitQuestion}
                        >
                          {isShowAddNotice ? (
                            <>
                              <span className="m-auto mr-[4px] h-[18px] text-[12px] leading-[150%] font-medium text-[#808695]">
                                문의사항 등록
                              </span>
                              <img
                                className="w-[16px] h-[16px] m-auto object-fit"
                                src={ImgClose}
                              />
                            </>
                          ) : (
                            <>
                              <span className="m-auto mr-[4px] h-[18px] text-[12px] leading-[150%] font-medium text-[#808695]">
                                문의사항 등록
                              </span>
                              <img
                                className="w-[16px] h-[16px] m-auto object-fit"
                                src={ImgEdit}
                              />
                            </>
                          )}
                        </button>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="w-full rounded-[4px] border-[1px] border-[#EBEEEF]">
                      <div className="w-full h-[41px] bg-[#F9F9FA] flex">
                        <div className="flex-none min-w-[60px] max-w-[60px] flex justify-center items-center">
                          <div className="text-[14px] leading-[150%] font-semibold text-[#515A6E]">
                            No
                          </div>
                        </div>
                        <div className="flex items-center justify-center flex-1">
                          <div className="text-[14px] leading-[150%] font-semibold text-[#515A6E]">
                            제목
                          </div>
                        </div>
                        <div className="flex-none min-w-[126px] max-w-[126px] flex justify-end items-center mr-[20px]">
                          <div className="text-[14px] leading-[150%] font-semibold text-[#515A6E]">
                            작성일시
                          </div>
                        </div>
                      </div>
                      {!!dataDetailLecture.qnas &&
                      dataDetailLecture.qnas.length > 0 ? (
                        dataDetailLecture.qnas
                          .sort((a: any, b: any) => {
                            return (
                              new Date(b.question_created_at).getTime() -
                              new Date(a.question_created_at).getTime()
                            );
                          })
                          .map((qna, index) => {
                            return dataDetailLecture ? (
                              <LectureQuestion
                                key={qna.question_id}
                                token={token}
                                userType={dataGetMe?.role}
                                mutate={mutateDetailLecture}
                                lecture_id={dataDetailLecture.id}
                                array_index={
                                  dataDetailLecture.qnas.length - index
                                }
                                question_id={qna.question_id}
                                question_created_at={qna.question_created_at}
                                question_title={qna.question_title}
                                question_description={qna.question_description}
                                answer_id={qna.answer_id}
                                answer_created_at={qna.answer_created_at}
                                answer_title={qna.answer_title}
                                answer_description={qna.answer_description}
                                userNickname={dataGetMe?.nickname}
                                creator_nickname={qna.creator_nickname}
                              />
                            ) : (
                              <></>
                            );
                          })
                      ) : (
                        <div className="flex items-center justify-center min-h-[41px] text-[14px] leading-[150%] font-medium text-[#515A6E]">
                          {!token
                            ? '문의사항은 로그인 후 조회할 수 있습니다!'
                            : !!!dataDetailLecture.qnas ||
                              dataDetailLecture.qnas.length === 0
                            ? '문의사항이 존재하지 않습니다'
                            : '잘못된 접근입니다'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {!(!!dataDetailLecture && !!!errorDetailLecture) && (
        <Skeleton className="w-full h-screen" />
      )}
    </>
  );
};

export default PageLectureDetail;
