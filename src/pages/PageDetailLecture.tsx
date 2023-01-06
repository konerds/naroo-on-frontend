import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import { axiosGetfetcher, showError } from '../hooks/api';
import useSWR from 'swr';
import Moment from 'react-moment';
import 'moment/locale/ko';
import axios from 'axios';
import { useStringInput } from '../hooks';
import { IInfoMe, ILectureDetail, ILectureInList } from '../interfaces';
import ComponentFormNoticeLecture from '../components/lecture/ComponentFormNoticeLecture';
import ImgEdit from '../assets/images/Edit.svg';
import ImgClose from '../assets/images/Close.svg';
import ComponentFormQnaLecture from '../components/lecture/ComponentFormQnaLecture';
import ContextToken from '../store/ContextToken';
import ComponentViewImageExpand from '../components/common/ui/ComponentViewImageExpand';
import ComponentSkeletonCustom from '../components/common/ui/ComponentSkeletonCustom';
import MediaQuery from 'react-responsive';
import { toast } from 'react-toastify';

export const CONST_LECTURE_DETAIL_MENU = {
  LECTURE_INTRODUCE: 'lecture_introduce',
  LECTURE_NOTICE: 'lecture_notice',
  LECTURE_QNA: 'lecture_qna',
} as const;

export type LECTURE_DETAIL_MENU =
  typeof CONST_LECTURE_DETAIL_MENU[keyof typeof CONST_LECTURE_DETAIL_MENU];

const PageDetailLecture: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tokenCtx = React.useContext(ContextToken);
  const { token } = tokenCtx;
  const [isShowImgThumbnail, setIsShowImgThumbnail] =
    React.useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = React.useState<LECTURE_DETAIL_MENU>(
    CONST_LECTURE_DETAIL_MENU.LECTURE_INTRODUCE,
  );
  const {
    value: noticeTitle,
    setValue: setNoticeTitle,
    onChange: onChangeNoticeTitle,
  } = useStringInput('');
  const {
    value: noticeDescription,
    setValue: setNoticeDescription,
    onChange: onChangeNoticeDescription,
  } = useStringInput('');
  const [isShowAddNotice, setIsShowAddNotice] = React.useState<boolean>(false);
  const [isLoadingSubmitNotice, setIsLoadingSubmitNotice] =
    React.useState<boolean>(false);
  const {
    value: questionTitle,
    setValue: setQuestionTitle,
    onChange: onChangeQuestionTitle,
  } = useStringInput('');
  const {
    value: questionDescription,
    setValue: setQuestionDescription,
    onChange: onChangeQuestionDescription,
  } = useStringInput('');
  const [isShowAddQuestion, setIsShowAddQuestion] =
    React.useState<boolean>(false);
  const [isLoadingSubmitQuestion, setIsLoadingSubmitQuestion] =
    React.useState<boolean>(false);
  const { data: dataGetMe, error: errorGetMe } = useSWR<IInfoMe>(
    !!token ? `${process.env.REACT_APP_BACK_URL}/user/me` : null,
    () => axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/user/me`, token),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const { mutate: mutateUserLectures } = useSWR<ILectureInList[]>(
    !!token && !!dataGetMe && !!!errorGetMe
      ? `${process.env.REACT_APP_BACK_URL}/lecture`
      : null,
    () => axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/lecture`, token),
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
              await mutateUserLectures();
              await mutateDetailLecture();
              toast('성공적으로 수강 신청이 완료되었습니다', {
                type: 'success',
              });
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
        toast('성공적으로 공지사항이 등록되었습니다', { type: 'success' });
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
        toast('성공적으로 문의가 등록되었습니다', { type: 'success' });
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
    <div className="w-full max-w-[100vw]">
      {!!dataDetailLecture && !!!errorDetailLecture && (
        <>
          <div className="w-full bg-gradient-to-br from-[#8DC556] to-[#00A0E9]">
            <MediaQuery maxWidth={1023.98}>
              <div className="p-[20px] w-full mx-auto max-w-[90vw] sm:max-w-[500px] md:max-w-[680px] lg:hidden">
                <img
                  onClick={() => {
                    setIsShowImgThumbnail(true);
                  }}
                  className="cursor-pointer mx-auto rounded-[4px] lecture-detail-thumbnail-container object-cover"
                  src={
                    dataDetailLecture.thumbnail
                      ? dataDetailLecture.thumbnail
                      : ''
                  }
                />
                <div className="flex mx-auto justify-between items-center leading-[1.5rem] min-h-[4.6875rem] max-h-[4.6875rem] mt-[10px]">
                  <div className="flex-1 break-all overflow-y-hidden max-h-[4.6875rem] text-white text-[1.125rem] font-semibold mr-[10px]">
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
                      className={`w-max px-[10px] rounded-[4px] max-w-[176px] h-[54px] font-semibold text-[#4DBFF0] text-[0.875rem] bg-white ${
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
                                  {
                                    {
                                      apply: '승인 대기',
                                      reject: '승인 거부',
                                      accept: '학습 하기',
                                    }[dataDetailLecture.status]
                                  }
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
            </MediaQuery>
            <MediaQuery minWidth={1024}>
              <div className="hidden lg:flex lg:justify-center lg:items-center lg:w-full lg:mx-auto lg:max-w-[864px] lg:min-h-[431.79px] lg:max-h-[431.79px] xl:max-w-[1152px] xl:min-h-[506px] xl:max-h-[506px]">
                <img
                  onClick={() => {
                    setIsShowImgThumbnail(true);
                  }}
                  className="cursor-pointer xl:mr-[150px] lg:mr-[128px] xl:min-w-[346px] xl:max-w-[346px] xl:min-h-[346px] xl:max-h-[346px] lg:min-w-[295.25px] lg:max-w-[295.25px] lg:min-h-[295.25px] lg:max-h-[295.25px] object-cover rounded-[4px] lecture-detail-thumbnail-container"
                  src={
                    !!dataDetailLecture.thumbnail
                      ? dataDetailLecture.thumbnail
                      : ''
                  }
                />
                <div className="xl:min-w-[644px] xl:max-w-[644px] lg:min-w-[549.55px] lg:max-w-[549.55px] xl:min-h-[346px] xl:max-h-[346px] lg:min-h-[295.25px] lg:max-h-[295.25px] flex flex-col justify-between">
                  <div className="w-full max-h-[96px] overflow-hidden text-white text-[2rem] font-semibold">
                    {!!dataDetailLecture.title && dataDetailLecture.title}
                  </div>
                  <div className="flex wrap items-center w-full min-h-[209.5px] max-h-[209.5px]">
                    <div className="block w-full">
                      <div className="mb-[30px] w-full flex justify-between items-center text-white text-[1rem] font-semibold">
                        <div>
                          {!!dataDetailLecture.teacher_nickname
                            ? dataDetailLecture.teacher_nickname
                            : ''}
                        </div>
                        <div className="text-[1rem] text-white font-semibold">
                          현재{' '}
                          {!!dataDetailLecture.users
                            ? dataDetailLecture.users
                            : 0}
                          명이 수강하고 있어요!
                        </div>
                      </div>
                      <div className="w-full max-h-[96px] overflow-hidden text-[1rem] text-white leading-[1.5rem] font-semibold">
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
                        className={`rounded-[4px] xl:min-w-[132px] xl:max-w-[132px] lg:min-w-[112.64px] lg:max-w-[112.64px] min-h-[41px] max-h-[41px] text-[#4DBFF0] text-[0.875rem] font-semibold bg-white ${
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
                                    {
                                      {
                                        apply: '승인 대기',
                                        reject: '승인 거부',
                                        accept: '학습 하기',
                                      }[dataDetailLecture.status]
                                    }
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
                              <>
                                {!!!dataDetailLecture.status && '로그인 필요'}
                              </>
                            )}
                          </>
                        )}
                      </button>
                    )}
                    <div className="text-[0.875rem] text-white font-semibold">
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
            </MediaQuery>
          </div>
          <div className="w-full mt-[40.25px] h-[44px] flex justify-center items-center">
            <div className="flex-1 h-[44px] border-b-[1px] border-[#8DC556]"></div>
            <button
              type="button"
              className={`px-[10px] sm:px-0 sm:flex-none sm:w-[120px] h-[44px] text-[0.8rem] sm:text-[1rem] leading-[1.375rem] font-medium border-[#8DC556] ${
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
              className={`px-[10px] sm:px-0 sm:flex-none sm:w-[120px] h-[44px] text-[0.8rem] sm:text-[1rem] leading-[1.375rem] font-medium border-[#8DC556] ${
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
              className={`px-[10px] sm:px-0 sm:flex-none sm:w-[120px] h-[44px] text-[0.8rem] sm:text-[1rem] leading-[1.375rem] font-medium border-[#8DC556] ${
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
          <div className="mx-auto max-w-[90vw] sm:max-w-[500px] md:max-w-[680px] lg:max-w-[864px] xl:max-w-[1152px]">
            {selectedMenu === CONST_LECTURE_DETAIL_MENU.LECTURE_INTRODUCE && (
              <div className="min-h-[300px] pt-[50px] pb-[60px] mx-auto flex flex-wrap justify-center">
                {!!dataDetailLecture.images &&
                  Array.isArray(dataDetailLecture.images) &&
                  dataDetailLecture.images.length > 0 &&
                  dataDetailLecture.images.map((url, index) => {
                    return (
                      <img
                        key={index}
                        className="mb-[20px] last:mb-0 w-full md:w-[512px] lg:w-[682.67px] xl:w-[800px]"
                        src={url}
                      />
                    );
                  })}
              </div>
            )}
            {selectedMenu === CONST_LECTURE_DETAIL_MENU.LECTURE_NOTICE && (
              <div className="py-[30px] mx-auto">
                {!!token &&
                  !!dataGetMe &&
                  !!!errorGetMe &&
                  dataGetMe.role === 'admin' &&
                  !!dataDetailLecture &&
                  !!!errorDetailLecture &&
                  isShowAddNotice && (
                    <form
                      className="mb-[20px] p-[10px] sm:py-[68px] sm:px-[14px] md:px-[30px] lg:px-[50px] xl:px-[98px] box-border border-[1px] rounded-[8px] border-[#DCDEE2] w-full"
                      onSubmit={(event) => {
                        event.preventDefault();
                        onSubmitNoticeHandler();
                      }}
                    >
                      <div className="mb-[28px] text-[#17233D] font-semibold text-[1.25rem] leading-[1.875rem]">
                        공지사항 등록
                      </div>
                      <div className="my-0">
                        <input
                          className="w-full border-[1px] min-h-[41px] max-h-[41px] border-[#DCDEE2] pl-[10px] py-[10px] text-[0.875rem] placeholder-[#DCDEE2] focus:border-[#8DC556] focus:outline-none disabled:opacity-50"
                          type="text"
                          value={noticeTitle}
                          onChange={onChangeNoticeTitle}
                          placeholder="제목을 입력하세요"
                          disabled={isLoadingSubmitNotice}
                        />
                      </div>
                      <div className="mt-0 mb-[20px]">
                        <textarea
                          className="w-full min-h-[204px] max-h-[204px] border-[1px] border-[#DCDEE2] pl-[10px] py-[10px] text-[0.875rem] placeholder-[#DCDEE2] focus:border-[#8DC556] focus:outline-none disabled:opacity-50"
                          value={noticeDescription}
                          onChange={onChangeNoticeDescription}
                          placeholder="내용을 입력하세요"
                          disabled={isLoadingSubmitNotice}
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full min-h-[41px] max-h-[41px] text-[0.875rem] font-semibold bg-[#8DC556] box-border border-[1px] border-[#8DC556] rounded-[4px] text-white my-0 disabled:opacity-50"
                        disabled={isLoadingSubmitNotice}
                      >
                        공지사항 등록
                      </button>
                    </form>
                  )}
                <div className="box-border rounded-[8px] border-[1px] border-[#DCDEE2] p-[10px] sm:px-[14px] md:px-[30px] lg:px-[50px] xl:px-[98px] sm:py-[60px] w-full">
                  <div className="w-full flex justify-between items-center mb-[20px]">
                    <div className="text-[#17233D] font-semibold text-[1.25rem] leading-[1.875rem]">
                      공지사항
                    </div>
                    {!!token &&
                    !!dataGetMe &&
                    !!!errorGetMe &&
                    dataGetMe.role === 'admin' &&
                    !!dataDetailLecture &&
                    !!!errorDetailLecture ? (
                      <button
                        type="button"
                        className="flex px-[10px] py-[4px] border-[1px] border-[#EBEEEF] rounded-[4px] bg-[#F9F9FA] disabled:opacity-50 hover:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => {
                          setIsShowAddNotice(!isShowAddNotice);
                        }}
                        disabled={isLoadingSubmitNotice}
                      >
                        {isShowAddNotice ? (
                          <>
                            <span className="m-auto mr-[4px] h-[18px] text-[0.75rem] font-medium text-[#808695]">
                              닫기
                            </span>
                            <img
                              className="w-[16px] h-[16px] m-auto object-fill"
                              src={ImgClose}
                            />
                          </>
                        ) : (
                          <>
                            <span className="m-auto mr-[4px] h-[18px] text-[0.75rem] font-medium text-[#808695]">
                              공지사항 등록
                            </span>
                            <img
                              className="w-[16px] h-[16px] m-auto object-fill"
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
                      <div className="flex-none min-w-[20px] max-w-[20px] sm:min-w-[60px] sm:max-w-[60px] flex justify-center items-center">
                        <div className="text-[0.5rem] sm:text-[0.875rem] font-semibold text-[#515A6E]">
                          No
                        </div>
                      </div>
                      <div className="flex items-center justify-center flex-1">
                        <div className="text-[0.5rem] sm:text-[0.875rem] font-semibold text-[#515A6E]">
                          제목
                        </div>
                      </div>
                      <div className="flex-none min-w-[40px] max-w-[40px] sm:min-w-[126px] sm:max-w-[126px] flex justify-end items-center mr-[10px] sm:mr-[20px]">
                        <div className="text-[0.5rem] sm:text-[0.875rem] font-semibold text-[#515A6E]">
                          작성일시
                        </div>
                      </div>
                    </div>
                    {!!dataDetailLecture &&
                    !!!errorDetailLecture &&
                    !!dataDetailLecture.notices &&
                    dataDetailLecture.notices.length > 0 ? (
                      dataDetailLecture.notices
                        .sort((a: any, b: any) => {
                          return (
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                          );
                        })
                        .map((notice, index) => {
                          return (
                            <ComponentFormNoticeLecture
                              key={index}
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
                      <div className="flex items-center justify-center min-h-[41px] text-[0.7rem] sm:text-[0.875rem] font-medium text-[#515A6E]">
                        {!!!dataDetailLecture.notices ||
                        dataDetailLecture.notices.length === 0
                          ? '공지사항이 존재하지 않습니다'
                          : '잘못된 접근입니다'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {selectedMenu === CONST_LECTURE_DETAIL_MENU.LECTURE_QNA && (
              <div className="py-[30px] mx-auto">
                {!!token &&
                  !!dataGetMe &&
                  !!!errorGetMe &&
                  dataGetMe.role === 'student' &&
                  !!dataDetailLecture &&
                  isShowAddQuestion && (
                    <form
                      className="mb-[20px] px-[10px] sm:px-[14px] md:px-[30px] lg:px-[50px] xl:px-[98px] py-[20px] md:py-[30px] box-border border-[1px] rounded-[8px] border-[#DCDEE2] w-full"
                      onSubmit={(event) => {
                        event.preventDefault();
                        onSubmitQuestionHandler();
                      }}
                    >
                      <div className="mb-[28px] text-[#17233D] font-semibold text-[1.25rem] leading-[1.875rem]">
                        문의사항 등록
                      </div>
                      <div className="my-0">
                        <input
                          className="w-full border-[1px] min-h-[41px] max-h-[41px] border-[#DCDEE2] pl-[10px] py-[10px] text-[0.875rem] placeholder-[#DCDEE2] focus:border-[#8DC556] focus:outline-none disabled:opacity-50"
                          type="text"
                          value={questionTitle}
                          onChange={onChangeQuestionTitle}
                          placeholder="제목을 입력하세요"
                          disabled={isLoadingSubmitQuestion}
                        />
                      </div>
                      <div className="mt-0 mb-[20px]">
                        <textarea
                          className="w-full min-h-[204px] max-h-[204px] border-[1px] border-[#DCDEE2] pl-[10px] py-[10px] text-[0.875rem] placeholder-[#DCDEE2] focus:border-[#8DC556] focus:outline-none disabled:opacity-50"
                          value={questionDescription}
                          onChange={onChangeQuestionDescription}
                          placeholder="내용을 입력하세요"
                          disabled={isLoadingSubmitQuestion}
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full min-h-[41px] max-h-[41px] text-[0.875rem] font-semibold bg-[#8DC556] box-border border-[1px] border-[#8DC556] rounded-[4px] text-white my-0 disabled:opacity-50"
                        disabled={isLoadingSubmitQuestion}
                      >
                        문의사항 등록
                      </button>
                    </form>
                  )}
                <>
                  <div className="box-border rounded-[8px] border-[1px] border-[#DCDEE2] p-[10px] sm:py-[60px] sm:px-[14px] md:px-[30px] lg:px-[50px] xl:px-[98px] w-full">
                    <div className="w-full flex justify-between items-center mb-[20px]">
                      <div className="text-[#17233D] font-semibold text-[1.25rem] leading-[1.875rem]">
                        문의사항
                      </div>
                      {!!token &&
                      !!dataGetMe &&
                      !!!errorGetMe &&
                      dataGetMe.role === 'student' ? (
                        <button
                          type="button"
                          className="flex px-[10px] py-[4px] border-[1px] border-[#EBEEEF] rounded-[4px] bg-[#F9F9FA] disabled:opacity-50 hover:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => {
                            setIsShowAddQuestion(!isShowAddQuestion);
                          }}
                          disabled={isLoadingSubmitQuestion}
                        >
                          {isShowAddQuestion ? (
                            <>
                              <span className="m-auto mr-[4px] h-[18px] text-[0.75rem] font-medium text-[#808695]">
                                닫기
                              </span>
                              <img
                                className="w-[16px] h-[16px] m-auto object-fill"
                                src={ImgClose}
                              />
                            </>
                          ) : (
                            <>
                              <span className="m-auto mr-[4px] h-[18px] text-[0.75rem] font-medium text-[#808695]">
                                문의사항 등록
                              </span>
                              <img
                                className="w-[16px] h-[16px] m-auto object-fill"
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
                        <div className="flex-none min-w-[20px] max-w-[20px] sm:min-w-[60px] sm:max-w-[60px] flex justify-center items-center">
                          <div className="text-[0.5rem] sm:text-[0.875rem] font-semibold text-[#515A6E]">
                            No
                          </div>
                        </div>
                        <div className="flex items-center justify-center flex-1">
                          <div className="text-[0.5rem] sm:text-[0.875rem] font-semibold text-[#515A6E]">
                            제목
                          </div>
                        </div>
                        <div className="flex-none min-w-[40px] max-w-[40px] sm:min-w-[126px] sm:max-w-[126px] flex justify-end items-center mr-[10px] sm:mr-[20px]">
                          <div className="text-[0.5rem] sm:text-[0.875rem] font-semibold text-[#515A6E]">
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
                              <ComponentFormQnaLecture
                                key={index}
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
                        <div className="flex items-center justify-center min-h-[41px] text-[0.7rem] sm:text-[0.875rem] font-medium text-[#515A6E]">
                          {!token
                            ? '문의사항은 로그인 후 조회할 수 있습니다'
                            : !!!dataDetailLecture.qnas ||
                              dataDetailLecture.qnas.length === 0
                            ? '문의사항이 존재하지 않습니다'
                            : '잘못된 접근입니다'}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              </div>
            )}
          </div>
        </>
      )}
      {!(!!dataDetailLecture && !!!errorDetailLecture) && (
        <ComponentSkeletonCustom className="w-full-important min-h-screen" />
      )}
      {isShowImgThumbnail &&
        !!dataDetailLecture &&
        !!dataDetailLecture.thumbnail && (
          <ComponentViewImageExpand
            src={dataDetailLecture.thumbnail}
            hideComponent={() => {
              setIsShowImgThumbnail(false);
            }}
          />
        )}
    </div>
  );
};

export default PageDetailLecture;
