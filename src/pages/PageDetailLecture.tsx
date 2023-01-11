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
  const { data: dataGetMe } = useSWR<IInfoMe>(
    !!token ? `${process.env.REACT_APP_BACK_URL}/user/me` : null,
    () => axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/user/me`, token),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const { mutate: mutateUserLectures } = useSWR<ILectureInList[]>(
    !!token && !!dataGetMe ? `${process.env.REACT_APP_BACK_URL}/lecture` : null,
    () => axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/lecture`, token),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const {
    data: dataDetailLecture,
    mutate: mutateDetailLecture,
    error: errorDetailLecture,
  } = !!token && !!dataGetMe
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
        if (!!token && !!dataGetMe && dataGetMe.role === 'student') {
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
              <div className="mx-auto w-full max-w-[90vw] p-[20px] sm:max-w-[500px] md:max-w-[680px] lg:hidden">
                <img
                  onClick={() => {
                    setIsShowImgThumbnail(true);
                  }}
                  className="lecture-detail-thumbnail-container mx-auto cursor-pointer rounded-[4px] object-cover"
                  src={
                    dataDetailLecture.thumbnail
                      ? dataDetailLecture.thumbnail
                      : ''
                  }
                />
                <div className="mx-auto mt-[10px] flex max-h-[75px] min-h-[75px] items-center justify-between leading-[24px]">
                  <div className="mr-[10px] max-h-[75px] flex-1 overflow-y-hidden break-all text-[18px] font-semibold text-white">
                    {dataDetailLecture.title && dataDetailLecture.title}
                  </div>
                  {((!!token && !!dataGetMe && dataGetMe.role === 'student') ||
                    !!!token) && (
                    <button
                      type="button"
                      onClick={onPlayLectureHandler}
                      className={`h-[54px] w-max max-w-[176px] rounded-[4px] bg-white px-[10px] text-[14px] font-semibold text-[#4DBFF0] ${
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
              <div className="hidden lg:mx-auto lg:flex lg:max-h-[431.79px] lg:min-h-[431.79px] lg:w-full lg:max-w-[864px] lg:items-center lg:justify-center xl:max-h-[506px] xl:min-h-[506px] xl:max-w-[1152px]">
                <img
                  onClick={() => {
                    setIsShowImgThumbnail(true);
                  }}
                  className="lecture-detail-thumbnail-container cursor-pointer rounded-[4px] object-cover lg:mr-[128px] lg:max-h-[295.25px] lg:min-h-[295.25px] lg:min-w-[295.25px] lg:max-w-[295.25px] xl:mr-[150px] xl:max-h-[346px] xl:min-h-[346px] xl:min-w-[346px] xl:max-w-[346px]"
                  src={
                    !!dataDetailLecture.thumbnail
                      ? dataDetailLecture.thumbnail
                      : ''
                  }
                />
                <div className="flex flex-col justify-between lg:max-h-[295.25px] lg:min-h-[295.25px] lg:min-w-[549.55px] lg:max-w-[549.55px] xl:max-h-[346px] xl:min-h-[346px] xl:min-w-[644px] xl:max-w-[644px]">
                  <div className="max-h-[96px] w-full overflow-hidden text-[32px] font-semibold text-white">
                    {!!dataDetailLecture.title && dataDetailLecture.title}
                  </div>
                  <div className="wrap flex max-h-[209.5px] min-h-[209.5px] w-full items-center">
                    <div className="block w-full">
                      <div className="mb-[30px] flex w-full items-center justify-between text-[16px] font-semibold text-white">
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                          {!!dataDetailLecture.teacher_nickname
                            ? dataDetailLecture.teacher_nickname
                            : ''}
                        </div>
                        <div className="ml-[60px] min-w-fit text-[16px] font-semibold text-white">
                          {`현재 ${
                            !!dataDetailLecture.users
                              ? dataDetailLecture.users.toString()
                              : '0'
                          }명이 수강하고 있어요!`}
                        </div>
                      </div>
                      <div className="max-h-[96px] w-full overflow-hidden text-[16px] font-semibold leading-[24px] text-white">
                        {!!dataDetailLecture.description
                          ? dataDetailLecture.description
                          : ''}
                      </div>
                    </div>
                  </div>
                  <div className="flex max-h-[41px] min-h-[41px] w-full items-center justify-between">
                    {!(
                      !!token &&
                      !!dataGetMe &&
                      dataGetMe.role === 'admin'
                    ) && (
                      <button
                        type="button"
                        onClick={onPlayLectureHandler}
                        className={`max-h-[41px] min-h-[41px] rounded-[4px] bg-white text-[16px] font-semibold text-[#4DBFF0] lg:min-w-[112.64px] lg:max-w-[112.64px] xl:min-w-[132px] xl:max-w-[132px] ${
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
                            {!!token &&
                            !!dataGetMe &&
                            dataGetMe.role === 'student' ? (
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
                              <>로그인 필요</>
                            )}
                          </>
                        )}
                      </button>
                    )}
                    <div className="ml-[50px] overflow-hidden text-ellipsis whitespace-nowrap text-[16px] font-semibold text-white">
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
          <div className="mt-[40.25px] flex h-[44px] w-full items-center justify-center">
            <div className="h-[44px] flex-1 border-b-[1px] border-[#8DC556]"></div>
            <button
              type="button"
              className={`h-[44px] border-[#8DC556] px-[10px] text-[12px] font-medium leading-[22px] sm:w-[120px] sm:flex-none sm:px-0 sm:text-[16px] ${
                selectedMenu === CONST_LECTURE_DETAIL_MENU.LECTURE_INTRODUCE
                  ? 'border-t-[1px] border-l-[1px] border-r-[1px] text-[#8DC556]'
                  : 'border-b-[1px] text-[#808695]'
              }`}
              onClick={() =>
                setSelectedMenu(CONST_LECTURE_DETAIL_MENU.LECTURE_INTRODUCE)
              }
            >
              강의 소개
            </button>
            <button
              type="button"
              className={`h-[44px] border-[#8DC556] px-[10px] text-[12px] font-medium leading-[22px] sm:w-[120px] sm:flex-none sm:px-0 sm:text-[16px] ${
                selectedMenu === CONST_LECTURE_DETAIL_MENU.LECTURE_NOTICE
                  ? 'border-t-[1px] border-l-[1px] border-r-[1px] text-[#8DC556]'
                  : 'border-b-[1px] text-[#808695]'
              }`}
              onClick={() =>
                setSelectedMenu(CONST_LECTURE_DETAIL_MENU.LECTURE_NOTICE)
              }
            >
              공지사항
            </button>
            <button
              type="button"
              className={`h-[44px] border-[#8DC556] px-[10px] text-[12px] font-medium leading-[22px] sm:w-[120px] sm:flex-none sm:px-0 sm:text-[16px] ${
                selectedMenu === CONST_LECTURE_DETAIL_MENU.LECTURE_QNA
                  ? 'border-t-[1px] border-l-[1px] border-r-[1px] text-[#8DC556]'
                  : 'border-b-[1px] text-[#808695]'
              }`}
              onClick={() =>
                setSelectedMenu(CONST_LECTURE_DETAIL_MENU.LECTURE_QNA)
              }
            >
              문의하기
            </button>
            <div className="h-[44px] flex-1 border-b-[1px] border-[#8DC556]"></div>
          </div>
          <div className="mx-auto max-w-[90vw] sm:max-w-[500px] md:max-w-[680px] lg:max-w-[864px] xl:max-w-[1152px]">
            {selectedMenu === CONST_LECTURE_DETAIL_MENU.LECTURE_INTRODUCE && (
              <div className="mx-auto flex min-h-[300px] flex-wrap justify-center pt-[50px] pb-[60px]">
                {!!dataDetailLecture.images &&
                  Array.isArray(dataDetailLecture.images) &&
                  dataDetailLecture.images.length > 0 &&
                  dataDetailLecture.images.map((url, index) => {
                    return (
                      <img
                        key={index}
                        className="mb-[20px] w-full last:mb-0 md:w-[512px] lg:w-[682.67px] xl:w-[800px]"
                        src={url}
                      />
                    );
                  })}
              </div>
            )}
            {selectedMenu === CONST_LECTURE_DETAIL_MENU.LECTURE_NOTICE && (
              <div className="mx-auto py-[30px]">
                {!!token &&
                  !!dataGetMe &&
                  dataGetMe.role === 'admin' &&
                  !!dataDetailLecture &&
                  !!!errorDetailLecture &&
                  isShowAddNotice && (
                    <form
                      className="mb-[20px] box-border w-full rounded-[8px] border-[1px] border-[#DCDEE2] p-[10px] sm:py-[68px] sm:px-[14px] md:px-[30px] lg:px-[50px] xl:px-[98px]"
                      onSubmit={(event) => {
                        event.preventDefault();
                        onSubmitNoticeHandler();
                      }}
                    >
                      <div className="mb-[28px] text-[20px] font-semibold leading-[30px] text-[#17233D]">
                        공지사항 등록
                      </div>
                      <div className="my-0">
                        <input
                          className="max-h-[41px] min-h-[41px] w-full border-[1px] border-[#DCDEE2] py-[10px] pl-[10px] text-[16px] placeholder-[#DCDEE2] focus:border-[#8DC556] focus:outline-none disabled:opacity-50"
                          type="text"
                          value={noticeTitle}
                          onChange={onChangeNoticeTitle}
                          placeholder="제목을 입력하세요"
                          disabled={isLoadingSubmitNotice}
                        />
                      </div>
                      <div className="mt-0 mb-[20px]">
                        <textarea
                          className="max-h-[204px] min-h-[204px] w-full border-[1px] border-[#DCDEE2] py-[10px] pl-[10px] text-[16px] placeholder-[#DCDEE2] focus:border-[#8DC556] focus:outline-none disabled:opacity-50"
                          value={noticeDescription}
                          onChange={onChangeNoticeDescription}
                          placeholder="내용을 입력하세요"
                          disabled={isLoadingSubmitNotice}
                        />
                      </div>
                      <button
                        type="submit"
                        className="my-0 box-border max-h-[41px] min-h-[41px] w-full rounded-[4px] border-[1px] border-[#8DC556] bg-[#8DC556] text-[16px] font-semibold text-white disabled:opacity-50"
                        disabled={isLoadingSubmitNotice}
                      >
                        공지사항 등록
                      </button>
                    </form>
                  )}
                <div className="box-border w-full rounded-[8px] border-[1px] border-[#DCDEE2] p-[10px] sm:px-[14px] sm:py-[60px] md:px-[30px] lg:px-[50px] xl:px-[98px]">
                  <div className="mb-[20px] flex w-full items-center justify-between">
                    <div className="text-[20px] font-semibold leading-[30px] text-[#17233D]">
                      공지사항
                    </div>
                    {!!token &&
                    !!dataGetMe &&
                    dataGetMe.role === 'admin' &&
                    !!dataDetailLecture &&
                    !!!errorDetailLecture ? (
                      <button
                        type="button"
                        className="flex rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] px-[10px] py-[4px] hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => {
                          setIsShowAddNotice(!isShowAddNotice);
                        }}
                        disabled={isLoadingSubmitNotice}
                      >
                        {isShowAddNotice ? (
                          <>
                            <span className="m-auto mr-[4px] h-[18px] text-[12px] font-medium text-[#808695]">
                              닫기
                            </span>
                            <img
                              className="m-auto h-[16px] w-[16px] object-fill"
                              src={ImgClose}
                            />
                          </>
                        ) : (
                          <>
                            <span className="m-auto mr-[4px] h-[18px] text-[12px] font-medium text-[#808695]">
                              공지사항 등록
                            </span>
                            <img
                              className="m-auto h-[16px] w-[16px] object-fill"
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
                    <div className="flex h-[41px] w-full bg-[#F9F9FA]">
                      <div className="flex min-w-[20px] max-w-[20px] flex-none items-center justify-center sm:min-w-[60px] sm:max-w-[60px]">
                        <div className="text-[8px] font-semibold text-[#515A6E] sm:text-[16px]">
                          No
                        </div>
                      </div>
                      <div className="flex flex-1 items-center justify-center">
                        <div className="text-[8px] font-semibold text-[#515A6E] sm:text-[16px]">
                          제목
                        </div>
                      </div>
                      <div className="mr-[10px] flex min-w-[40px] max-w-[40px] flex-none items-center justify-end sm:mr-[20px] sm:min-w-[126px] sm:max-w-[126px]">
                        <div className="text-[8px] font-semibold text-[#515A6E] sm:text-[16px]">
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
                      <div className="flex min-h-[41px] items-center justify-center text-[11px] font-medium text-[#515A6E] sm:text-[16px]">
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
              <div className="mx-auto py-[30px]">
                {!!token &&
                  !!dataGetMe &&
                  dataGetMe.role === 'student' &&
                  !!dataDetailLecture &&
                  isShowAddQuestion && (
                    <form
                      className="mb-[20px] box-border w-full rounded-[8px] border-[1px] border-[#DCDEE2] px-[10px] py-[20px] sm:px-[14px] md:px-[30px] md:py-[30px] lg:px-[50px] xl:px-[98px]"
                      onSubmit={(event) => {
                        event.preventDefault();
                        onSubmitQuestionHandler();
                      }}
                    >
                      <div className="mb-[28px] text-[20px] font-semibold leading-[30px] text-[#17233D]">
                        문의사항 등록
                      </div>
                      <div className="my-0">
                        <input
                          className="max-h-[41px] min-h-[41px] w-full border-[1px] border-[#DCDEE2] py-[10px] pl-[10px] text-[16px] placeholder-[#DCDEE2] focus:border-[#8DC556] focus:outline-none disabled:opacity-50"
                          type="text"
                          value={questionTitle}
                          onChange={onChangeQuestionTitle}
                          placeholder="제목을 입력하세요"
                          disabled={isLoadingSubmitQuestion}
                        />
                      </div>
                      <div className="mt-0 mb-[20px]">
                        <textarea
                          className="max-h-[204px] min-h-[204px] w-full border-[1px] border-[#DCDEE2] py-[10px] pl-[10px] text-[16px] placeholder-[#DCDEE2] focus:border-[#8DC556] focus:outline-none disabled:opacity-50"
                          value={questionDescription}
                          onChange={onChangeQuestionDescription}
                          placeholder="내용을 입력하세요"
                          disabled={isLoadingSubmitQuestion}
                        />
                      </div>
                      <button
                        type="submit"
                        className="my-0 box-border max-h-[41px] min-h-[41px] w-full rounded-[4px] border-[1px] border-[#8DC556] bg-[#8DC556] text-[16px] font-semibold text-white disabled:opacity-50"
                        disabled={isLoadingSubmitQuestion}
                      >
                        문의사항 등록
                      </button>
                    </form>
                  )}
                <>
                  <div className="box-border w-full rounded-[8px] border-[1px] border-[#DCDEE2] p-[10px] sm:py-[60px] sm:px-[14px] md:px-[30px] lg:px-[50px] xl:px-[98px]">
                    <div className="mb-[20px] flex w-full items-center justify-between">
                      <div className="text-[20px] font-semibold leading-[30px] text-[#17233D]">
                        문의사항
                      </div>
                      {!!token &&
                      !!dataGetMe &&
                      dataGetMe.role === 'student' ? (
                        <button
                          type="button"
                          className="flex rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] px-[10px] py-[4px] hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
                          onClick={() => {
                            setIsShowAddQuestion(!isShowAddQuestion);
                          }}
                          disabled={isLoadingSubmitQuestion}
                        >
                          {isShowAddQuestion ? (
                            <>
                              <span className="m-auto mr-[4px] h-[18px] text-[12px] font-medium text-[#808695]">
                                닫기
                              </span>
                              <img
                                className="m-auto h-[16px] w-[16px] object-fill"
                                src={ImgClose}
                              />
                            </>
                          ) : (
                            <>
                              <span className="m-auto mr-[4px] h-[18px] text-[12px] font-medium text-[#808695]">
                                문의사항 등록
                              </span>
                              <img
                                className="m-auto h-[16px] w-[16px] object-fill"
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
                      <div className="flex h-[41px] w-full bg-[#F9F9FA]">
                        <div className="flex min-w-[20px] max-w-[20px] flex-none items-center justify-center sm:min-w-[60px] sm:max-w-[60px]">
                          <div className="text-[8px] font-semibold text-[#515A6E] sm:text-[16px]">
                            No
                          </div>
                        </div>
                        <div className="flex flex-1 items-center justify-center">
                          <div className="text-[8px] font-semibold text-[#515A6E] sm:text-[16px]">
                            제목
                          </div>
                        </div>
                        <div className="mr-[10px] flex min-w-[40px] max-w-[40px] flex-none items-center justify-end sm:mr-[20px] sm:min-w-[126px] sm:max-w-[126px]">
                          <div className="text-[8px] font-semibold text-[#515A6E] sm:text-[16px]">
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
                        <div className="flex min-h-[41px] items-center justify-center text-[11px] font-medium text-[#515A6E] sm:text-[16px]">
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
