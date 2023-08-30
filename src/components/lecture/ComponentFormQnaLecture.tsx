import { FC, useState } from 'react';
import { useRecoilValue } from 'recoil';
import 'moment/locale/ko';
import moment from 'moment';
import axios from 'axios';
import { useStringInput } from '../../hooks';
import { ReactComponent as ImgEdit } from '../../assets/images/Edit.svg';
import { ReactComponent as ImgClose } from '../../assets/images/Close.svg';
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
import { IQnasInLecture } from '../../interfaces';

interface IPropsComponentFormQnaLecture {
  lecture_id: string;
  array_index: number;
  qna: IQnasInLecture;
}

const ComponentFormQnaLecture: FC<IPropsComponentFormQnaLecture> = ({
  lecture_id,
  array_index,
  qna,
}) => {
  const {
    question_id,
    question_created_at,
    question_title,
    question_description,
    answer_id,
    answer_created_at,
    answer_title,
    answer_description,
    creator_nickname,
  } = qna;
  const { id } = useParams<{ id: string }>();
  const { mutate: mutateDetailLecture } = useSWRDetailLecture(id);
  const token = useRecoilValue(stateToken);
  const { data: dataInfoMe } = useSWRInfoMe();
  const [isShowQuestionDescription, setIsShowQuestionDescription] =
    useState<boolean>(false);
  const [isShowQuestionEdit, setIsShowQuestionEdit] = useState<boolean>(false);
  const { value: updateQuestionTitle, onChange: onChangeUpdateQuestionTitle } =
    useStringInput(question_title);
  const {
    value: updateQuestionDescription,
    onChange: onChangeUpdateQuestionDescription,
  } = useStringInput(question_description);
  const [isLoadingClickDeleteQuestion, setIsLoadingClickDeleteQuestion] =
    useState<boolean>(false);
  const onClickDeleteQuestionHandler = async () => {
    try {
      setIsLoadingClickDeleteQuestion(true);
      const response = await axios.delete(
        `${process.env.REACT_APP_BACK_URL}/lecture/question/${lecture_id}?question_id=${question_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        await mutateDetailLecture();
        toast('성공적으로 문의가 삭제되었습니다', { type: 'success' });
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingClickDeleteQuestion(false);
    }
  };
  const [isLoadingSubmitUpdateQuestion, setIsLoadingSubmitUpdateQuestion] =
    useState<boolean>(false);
  const onSubmitUpdateQuestionHandler = async () => {
    try {
      setIsLoadingSubmitUpdateQuestion(true);
      const response = await axios.put(
        `${process.env.REACT_APP_BACK_URL}/lecture/question/modify/${lecture_id}?question_id=${question_id}`,
        {
          title: updateQuestionTitle,
          description: updateQuestionDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        await mutateDetailLecture();
        toast('성공적으로 문의가 업데이트되었습니다', { type: 'success' });
        setIsShowQuestionEdit(false);
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingSubmitUpdateQuestion(false);
    }
  };
  const {
    value: newAnswerTitle,
    setValue: setNewAnswerTitle,
    onChange: onChangeNewAnswerTitle,
  } = useStringInput('');
  const {
    value: newAnswerDescription,
    setValue: setNewAnswerDescription,
    onChange: onChangeNewAnswerDescription,
  } = useStringInput('');
  const {
    value: updateAnswerTitle,
    setValue: setUpdateAnswerTitle,
    onChange: onChangeUpdateAnswerTitle,
  } = useStringInput(answer_title);
  const {
    value: updateAnswerDescription,
    setValue: setUpdateAnswerDescription,
    onChange: onChangeUpdateAnswerDescription,
  } = useStringInput(answer_description);
  const [isShowAnswerDescription, setIsShowAnswerDescription] =
    useState<boolean>(false);
  const [isShowAnswerEdit, setIsShowAnswerEdit] = useState<boolean>(false);
  const [isShowAddAnswer, setIsShowAddAnswer] = useState<boolean>(false);
  const [isLoadingSubmitAnswer, setIsLoadingSubmitAnswer] =
    useState<boolean>(false);
  const onSubmitAnswerHandler = async () => {
    try {
      setIsLoadingSubmitAnswer(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/answer`,
        {
          question_id: question_id.toString(),
          title: newAnswerTitle,
          description: newAnswerDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 201) {
        await mutateDetailLecture();
        toast('성공적으로 답변이 등록되었습니다', { type: 'success' });
        setNewAnswerTitle('');
        setNewAnswerDescription('');
        setUpdateAnswerTitle(updateAnswerTitle);
        setUpdateAnswerDescription(updateAnswerDescription);
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingSubmitAnswer(false);
    }
  };
  const [isLoadingClickDeleteAnswer, setIsLoadingClickDeleteAnswer] =
    useState<boolean>(false);
  const onClickDeleteAnswerHandler = async () => {
    try {
      setIsLoadingClickDeleteAnswer(true);
      const response = await axios.delete(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/answer/${answer_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        await mutateDetailLecture();
        toast('성공적으로 답변이 삭제되었습니다', { type: 'success' });
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingClickDeleteAnswer(false);
    }
  };
  const [isLoadingSubmitUpdateAnswer, setIsLoadingSubmitUpdateAnswer] =
    useState<boolean>(false);
  const onSubmitUpdateAnswerHandler = async () => {
    try {
      setIsLoadingSubmitUpdateAnswer(true);
      const response = await axios.put(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/answer/modify/${question_id}?answer_id=${answer_id}`,
        {
          title: updateAnswerTitle,
          description: updateAnswerDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        await mutateDetailLecture();
        toast('성공적으로 답변이 등록되었습니다', { type: 'success' });
        setIsShowAnswerEdit(false);
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingSubmitUpdateAnswer(false);
    }
  };
  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmitUpdateQuestionHandler();
        }}
      >
        <div
          className="flex min-h-[41px] bg-white"
          onClick={() => {
            setIsShowQuestionEdit(false);
            setIsShowQuestionDescription(!isShowQuestionDescription);
          }}
        >
          <div className="flex min-h-[41px] w-full items-center">
            <div className="flex min-w-[20px] max-w-[20px] flex-none items-center justify-center sm:min-w-[60px] sm:max-w-[60px]">
              <div className="text-[0.5rem] text-[#DCDEE2] sm:text-[0.875rem]">
                {array_index}
              </div>
            </div>
            {isShowQuestionEdit ? (
              <input
                className="my-[10px] ml-[8.5px] flex flex-1 items-center justify-start overflow-x-hidden rounded-[4px] border-[1px] px-[4px] text-[0.875rem] text-[#515A6E] disabled:opacity-50"
                value={updateQuestionTitle}
                onChange={onChangeUpdateQuestionTitle}
                onClick={(event) => {
                  event.stopPropagation();
                }}
                disabled={isLoadingSubmitUpdateQuestion}
              />
            ) : (
              <div className="my-[10px] flex flex-1 items-stretch justify-start break-all py-[4px] pl-[8.5px] pr-[20px] text-[0.5rem] text-[#515A6E] sm:text-[0.875rem]">
                {`${
                  !!token && !!dataInfoMe && dataInfoMe.role === 'admin'
                    ? '[' + creator_nickname + '] '
                    : ''
                } ${question_title}`}
              </div>
            )}
            <div className="mr-[10px] flex min-w-[40px] max-w-[40px] flex-none items-center justify-end sm:mr-[20px] sm:min-w-[126px] sm:max-w-[126px]">
              <div
                className="text-[0.5rem] text-[#DCDEE2] sm:text-[0.875rem]"
                title={moment(question_created_at).format(
                  'YYYY년 MM월 DD일 HH시 mm분',
                )}
              >
                <MediaQuery maxWidth={639.98}>
                  {moment(question_created_at).format('YYMMDD')}
                </MediaQuery>
                <MediaQuery minWidth={640}>
                  {moment(question_created_at).format('YYYY년 MM월 DD일')}
                </MediaQuery>
              </div>
            </div>
          </div>
        </div>
        {isShowQuestionDescription ? (
          <>
            <div className="flex min-h-[41px] w-full items-center">
              <div className="flex min-w-[20px] max-w-[20px] flex-none items-center justify-center sm:min-w-[60px] sm:max-w-[60px]">
                <div className="text-[0.5rem] text-[#DCDEE2] sm:text-[0.875rem]">
                  내용
                </div>
              </div>
              {isShowQuestionEdit ? (
                <textarea
                  className="my-[10px] ml-[8.5px] mr-[10px] flex flex-1 items-center justify-start rounded-[4px] border-[1px] px-[4px] text-[0.875rem] text-[#515A6E] disabled:opacity-50 sm:mr-[20px]"
                  value={updateQuestionDescription}
                  onChange={onChangeUpdateQuestionDescription}
                  disabled={isLoadingSubmitUpdateQuestion}
                />
              ) : (
                <div className="my-[10px] flex flex-1 items-stretch justify-start break-all py-[4px] pl-[8.5px] pr-[20px] text-[0.5rem] text-[#515A6E] sm:text-[0.875rem]">
                  {question_description}
                </div>
              )}
              <div className="relative right-[4px] flex min-w-[40px] max-w-[40px] flex-none items-start justify-center sm:min-w-[126px] sm:max-w-[126px]">
                {!!token &&
                  !!dataInfoMe &&
                  ((dataInfoMe.role === 'student' &&
                    dataInfoMe.nickname === creator_nickname) ||
                    dataInfoMe.role === 'admin') && (
                    <>
                      {isShowQuestionEdit ? (
                        <div className="flex min-h-[41px] w-full items-center justify-start bg-white xl:justify-center">
                          <button
                            type="submit"
                            className="max-h-[21px] min-h-[21px] min-w-[21px] max-w-[21px] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] p-[5px] font-normal text-[#808695] disabled:opacity-50 sm:max-h-[unset] sm:min-h-[unset] sm:min-w-[unset] sm:max-w-max sm:px-[10px] sm:py-[4px] sm:text-[0.75rem]"
                            disabled={isLoadingSubmitUpdateQuestion}
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
                            className={`mr-[10px] max-h-[21px] min-h-[21px] min-w-[21px] max-w-[21px] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] p-[5px] font-normal text-[#808695] hover:opacity-50 disabled:opacity-50 sm:mr-[18px] sm:max-h-[unset] sm:min-h-[unset] sm:min-w-[unset] sm:max-w-max sm:px-[10px] sm:py-[4px] sm:text-[0.75rem] disabled:cursor-not-allowed${
                              !!answer_id &&
                              !!dataInfoMe &&
                              dataInfoMe.role !== 'admin'
                                ? ' ml-[3px] sm:ml-[10px]'
                                : ' ml-[1px] xl:ml-[10px]'
                            }`}
                            onClick={() => {
                              setIsShowQuestionEdit(false);
                            }}
                            disabled={isLoadingSubmitUpdateQuestion}
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
                        <>
                          <div className="flex min-h-[41px] w-full items-center justify-start bg-white xl:justify-center">
                            <button
                              type="button"
                              className="max-h-[21px] min-h-[21px] min-w-[21px] max-w-[21px] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] p-[5px] font-normal text-[#808695] hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-50 sm:max-h-[unset] sm:min-h-[unset] sm:min-w-[unset] sm:max-w-max sm:px-[10px] sm:py-[4px] sm:text-[0.75rem]"
                              onClick={(event) => {
                                event.preventDefault();
                                setIsShowQuestionEdit(true);
                              }}
                              disabled={isLoadingClickDeleteQuestion}
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
                              className={`mr-[10px] max-h-[21px] min-h-[21px] min-w-[21px] max-w-[21px] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] p-[5px] font-normal text-[#808695] hover:opacity-50 disabled:opacity-50 sm:mr-[18px] sm:max-h-[unset] sm:min-h-[unset] sm:min-w-[unset] sm:max-w-max sm:px-[10px] sm:py-[4px] sm:text-[0.75rem] disabled:cursor-not-allowed${
                                !!answer_id &&
                                !!dataInfoMe &&
                                dataInfoMe.role !== 'admin'
                                  ? ' ml-[3px] sm:ml-[10px]'
                                  : ' ml-[1px] xl:ml-[10px]'
                              }`}
                              onClick={() => {
                                onClickDeleteQuestionHandler();
                              }}
                              disabled={isLoadingClickDeleteQuestion}
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
                        </>
                      )}
                    </>
                  )}
                {!!dataInfoMe &&
                  dataInfoMe.role === 'admin' &&
                  !!!answer_id && (
                    <button
                      type="button"
                      className="absolute bottom-[10px] left-[44px] flex max-h-[21px] min-h-[21px] min-w-[21px] max-w-[21px] items-center justify-center rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] px-[4px] py-[4px] text-[0.75rem] font-normal text-[#808695] hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-50 sm:bottom-[6px] sm:left-[90px] sm:h-[28px] sm:max-h-[unset] sm:min-h-[unset] sm:w-max sm:min-w-[unset] sm:max-w-[unset] xl:left-[133px] xl:px-[10px]"
                      onClick={() => {
                        setIsShowAddAnswer(!isShowAddAnswer);
                      }}
                      disabled={isLoadingSubmitAnswer}
                    >
                      {isShowAddAnswer ? (
                        <>
                          <span className="m-auto mr-[4px] hidden h-[18px] font-medium text-[#808695] sm:text-[0.75rem] xl:block">
                            닫기
                          </span>
                          <ImgClose
                            width={10}
                            height={10}
                            className="m-auto h-[10px] w-[10px] fill-[black] object-fill hover:fill-[#4DBFF0] sm:h-[16px] sm:w-[16px]"
                          />
                        </>
                      ) : (
                        <>
                          <span className="m-auto mr-[4px] hidden h-[18px] font-medium text-[#808695] sm:text-[0.75rem] xl:block">
                            답변하기
                          </span>
                          <ImgEdit
                            width={10}
                            height={10}
                            className="m-auto h-[10px] w-[10px] fill-[black] object-fill hover:fill-[#4DBFF0] sm:h-[16px] sm:w-[16px]"
                          />
                        </>
                      )}
                    </button>
                  )}
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </form>
      {!!answer_id && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitUpdateAnswerHandler();
          }}
        >
          <div
            className="flex min-h-[41px] bg-white"
            onClick={() => {
              setIsShowAnswerEdit(false);
              setIsShowAnswerDescription(!isShowAnswerDescription);
            }}
          >
            <div className="flex min-h-[41px] w-full items-center">
              <div className="flex min-w-[20px] max-w-[20px] flex-none items-center justify-center sm:min-w-[60px] sm:max-w-[60px]">
                <div className="text-[0.5rem] text-[#b13636] sm:text-[0.875rem]">
                  답변
                </div>
              </div>
              {isShowAnswerEdit ? (
                <input
                  className="my-[10px] ml-[8.5px] flex flex-1 items-center justify-start overflow-x-hidden rounded-[4px] border-[1px] px-[4px] text-[0.875rem] text-[#515A6E] disabled:opacity-50"
                  value={updateAnswerTitle}
                  onChange={onChangeUpdateAnswerTitle}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  disabled={isLoadingSubmitUpdateAnswer}
                />
              ) : (
                <div className="my-[10px] flex flex-1 items-stretch justify-start break-all py-[4px] pl-[8.5px] pr-[20px] text-[0.5rem] text-[#515A6E] sm:text-[0.875rem]">
                  {answer_title}
                </div>
              )}
              <div className="mr-[10px] flex min-w-[40px] max-w-[40px] flex-none items-center justify-end sm:mr-[20px] sm:min-w-[126px] sm:max-w-[126px]">
                <div
                  className="text-[0.5rem] text-[#DCDEE2] sm:text-[0.875rem]"
                  title={moment(answer_created_at).format(
                    'YYYY년 MM월 DD일 HH시 mm분',
                  )}
                >
                  <MediaQuery maxWidth={639.98}>
                    {moment(answer_created_at).format('YYMMDD')}
                  </MediaQuery>
                  <MediaQuery minWidth={640}>
                    {moment(answer_created_at).format('YYYY년 MM월 DD일')}
                  </MediaQuery>
                </div>
              </div>
            </div>
          </div>
          {isShowAnswerDescription ? (
            <>
              <div className="flex min-h-[41px] w-full items-center">
                <div className="flex min-w-[20px] max-w-[20px] flex-none items-center justify-center sm:min-w-[60px] sm:max-w-[60px]">
                  <div className="text-[0.5rem] text-[#DCDEE2] sm:text-[0.875rem]">
                    내용
                  </div>
                </div>
                {isShowAnswerEdit ? (
                  <textarea
                    className="my-[10px] ml-[8.5px] mr-[10px] flex flex-1 items-stretch justify-start rounded-[4px] border-[1px] px-[4px] text-[0.875rem] text-[#515A6E] disabled:opacity-50 sm:mr-[20px]"
                    value={updateAnswerDescription}
                    onChange={onChangeUpdateAnswerDescription}
                    disabled={isLoadingSubmitUpdateAnswer}
                  />
                ) : (
                  <div className="my-[10px] flex flex-1 items-stretch justify-start break-all py-[4px] pl-[8.5px] pr-[20px] text-[0.5rem] text-[#515A6E] sm:text-[0.875rem]">
                    {answer_description}
                  </div>
                )}
                <div className="relative right-[4px] flex min-w-[40px] max-w-[40px] flex-none items-start justify-center sm:min-w-[126px] sm:max-w-[126px]">
                  {!!token && !!dataInfoMe && dataInfoMe.role === 'admin' && (
                    <>
                      {isShowAnswerEdit ? (
                        <div className="flex min-h-[41px] w-full items-center justify-center bg-white">
                          <button
                            type="submit"
                            className="max-h-[21px] min-h-[21px] min-w-[21px] max-w-[21px] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] p-[5px] font-normal text-[#808695] hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-50 sm:max-h-[unset] sm:min-h-[unset] sm:min-w-[unset] sm:max-w-max sm:px-[10px] sm:py-[4px] sm:text-[0.75rem]"
                            disabled={isLoadingSubmitUpdateAnswer}
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
                            className="ml-[1px] mr-[10px] max-h-[21px] min-h-[21px] min-w-[21px] max-w-[21px] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] p-[5px] font-normal text-[#808695] hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-50 sm:mr-[18px] sm:max-h-[unset] sm:min-h-[unset] sm:min-w-[unset] sm:max-w-max sm:px-[10px] sm:py-[4px] sm:text-[0.75rem] xl:ml-[10px]"
                            onClick={() => {
                              setIsShowAnswerEdit(false);
                            }}
                            disabled={isLoadingSubmitUpdateAnswer}
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
                        <>
                          <div className="flex min-h-[41px] w-full items-center justify-start bg-white xl:justify-center">
                            <button
                              type="button"
                              className="max-h-[21px] min-h-[21px] min-w-[21px] max-w-[21px] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] p-[5px] font-normal text-[#808695] hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-50 sm:max-h-[unset] sm:min-h-[unset] sm:min-w-[unset] sm:max-w-max sm:px-[10px] sm:py-[4px] sm:text-[0.75rem]"
                              onClick={() => {
                                setIsShowAnswerEdit(true);
                              }}
                              disabled={isLoadingClickDeleteAnswer}
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
                              className="ml-[1px] mr-[10px] max-h-[21px] min-h-[21px] min-w-[21px] max-w-[21px] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] p-[5px] font-normal text-[#808695] hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-50 sm:mr-[18px] sm:max-h-[unset] sm:min-h-[unset] sm:min-w-[unset] sm:max-w-max sm:px-[10px] sm:py-[4px] sm:text-[0.75rem] xl:ml-[10px]"
                              onClick={() => {
                                onClickDeleteAnswerHandler();
                              }}
                              disabled={isLoadingClickDeleteAnswer}
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
                        </>
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
      )}
      {!!token &&
        !!dataInfoMe &&
        dataInfoMe.role === 'admin' &&
        !!!answer_id &&
        isShowAddAnswer && (
          <div className="p-[10px]">
            <form
              className="box-border w-full rounded-[8px] border-[1px] border-[#DCDEE2] px-[20px] py-[30px] md:px-[98px]"
              onSubmit={(event) => {
                event.preventDefault();
                onSubmitAnswerHandler();
              }}
            >
              <div className="mb-[28px] text-[1.25rem] font-semibold leading-[1.875rem] text-[#17233D]">
                {creator_nickname + '님 '}
                <span className="text-sm font-light"> 문의에 답변</span>
              </div>
              <div className="my-0">
                <input
                  className="min-h-[41px] w-full border-[1px] border-[#DCDEE2] py-[10px] pl-[10px] text-[0.875rem] placeholder-[#DCDEE2] focus:border-[#8DC556] focus:outline-none disabled:opacity-50"
                  type="text"
                  value={newAnswerTitle}
                  onChange={onChangeNewAnswerTitle}
                  placeholder="제목을 입력하세요"
                  disabled={isLoadingSubmitAnswer}
                />
              </div>
              <div className="mb-[20px] mt-0">
                <textarea
                  className="max-h-[204px] min-h-[204px] w-full border-[1px] border-[#DCDEE2] py-[10px] pl-[10px] text-[0.875rem] placeholder-[#DCDEE2] focus:border-[#8DC556] focus:outline-none disabled:opacity-50"
                  value={newAnswerDescription}
                  onChange={onChangeNewAnswerDescription}
                  placeholder="내용을 입력하세요"
                  disabled={isLoadingSubmitAnswer}
                />
              </div>
              <button
                type="submit"
                className="my-0 box-border min-h-[41px] w-full rounded-[4px] border-[1px] border-[#8DC556] bg-[#8DC556] text-[0.875rem] font-semibold text-white hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoadingSubmitAnswer}
              >
                답변 등록
              </button>
            </form>
          </div>
        )}
    </>
  );
};

export default ComponentFormQnaLecture;
