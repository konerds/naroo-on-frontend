import * as React from 'react';
import 'moment/locale/ko';
import moment from 'moment';
import axios from 'axios';
import { ILectureDetail } from '../../interfaces';
import { useStringInput } from '../../hooks';
import { ReactComponent as ImgEdit } from '../../assets/images/Edit.svg';
import { ReactComponent as ImgClose } from '../../assets/images/Close.svg';
import { showError } from '../../hooks/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { KeyedMutator } from 'swr';
import MediaQuery from 'react-responsive';
import { toast } from 'react-toastify';

interface IPropsComponentFormQnaLecture {
  token: string | null;
  userType?: string | null;
  mutate: KeyedMutator<ILectureDetail>;
  lecture_id: string;
  array_index: number;
  question_id: string;
  question_created_at: string;
  question_title: string;
  question_description: string;
  answer_id: string;
  answer_created_at: string;
  answer_title: string;
  answer_description: string;
  userNickname?: string | null;
  creator_nickname: string;
}

const ComponentFormQnaLecture: React.FC<IPropsComponentFormQnaLecture> = ({
  token,
  userType,
  mutate,
  lecture_id,
  array_index,
  question_id,
  question_created_at,
  question_title,
  question_description,
  answer_id,
  answer_created_at,
  answer_title,
  answer_description,
  userNickname,
  creator_nickname,
}) => {
  const [isShowQuestionDescription, setIsShowQuestionDescription] =
    React.useState<boolean>(false);
  const [isShowQuestionEdit, setIsShowQuestionEdit] =
    React.useState<boolean>(false);
  const { value: updateQuestionTitle, onChange: onChangeUpdateQuestionTitle } =
    useStringInput(question_title);
  const {
    value: updateQuestionDescription,
    onChange: onChangeUpdateQuestionDescription,
  } = useStringInput(question_description);
  const [isLoadingClickDeleteQuestion, setIsLoadingClickDeleteQuestion] =
    React.useState<boolean>(false);
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
        await mutate();
        toast('성공적으로 문의가 삭제되었습니다', { type: 'success' });
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingClickDeleteQuestion(false);
    }
  };
  const [isLoadingSubmitUpdateQuestion, setIsLoadingSubmitUpdateQuestion] =
    React.useState<boolean>(false);
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
        await mutate();
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
    React.useState<boolean>(false);
  const [isShowAnswerEdit, setIsShowAnswerEdit] =
    React.useState<boolean>(false);
  const [isShowAddAnswer, setIsShowAddAnswer] = React.useState<boolean>(false);
  const [isLoadingSubmitAnswer, setIsLoadingSubmitAnswer] =
    React.useState<boolean>(false);
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
        await mutate();
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
    React.useState<boolean>(false);
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
        await mutate();
        toast('성공적으로 답변이 삭제되었습니다', { type: 'success' });
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingClickDeleteAnswer(false);
    }
  };
  const [isLoadingSubmitUpdateAnswer, setIsLoadingSubmitUpdateAnswer] =
    React.useState<boolean>(false);
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
        await mutate();
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
          className="min-h-[41px] bg-white flex"
          onClick={() => {
            setIsShowQuestionEdit(false);
            setIsShowQuestionDescription(!isShowQuestionDescription);
          }}
        >
          <div className="w-full flex items-center min-h-[41px]">
            <div className="flex-none min-w-[20px] max-w-[20px] sm:min-w-[60px] sm:max-w-[60px] flex justify-center items-center">
              <div className="text-[0.5rem] sm:text-[0.875rem] text-[#DCDEE2]">
                {array_index}
              </div>
            </div>
            {isShowQuestionEdit ? (
              <input
                className="flex-1 flex justify-start overflow-x-hidden items-center border-[1px] rounded-[4px] my-[10px] px-[4px] text-[0.875rem] text-[#515A6E] ml-[8.5px] disabled:opacity-50"
                value={updateQuestionTitle}
                onChange={onChangeUpdateQuestionTitle}
                onClick={(event) => {
                  event.stopPropagation();
                }}
                disabled={isLoadingSubmitUpdateQuestion}
              />
            ) : (
              <div className="flex-1 flex break-all justify-start items-stretch my-[10px] py-[4px] pl-[8.5px] pr-[20px] text-[0.5rem] sm:text-[0.875rem] text-[#515A6E]">
                {`${
                  token && userType === 'admin'
                    ? '[' + creator_nickname + '] '
                    : ''
                } ${question_title}`}
              </div>
            )}
            <div className="flex-none min-w-[40px] max-w-[40px] sm:min-w-[126px] sm:max-w-[126px] flex justify-end items-center mr-[10px] sm:mr-[20px]">
              <div
                className="text-[0.5rem] sm:text-[0.875rem] text-[#DCDEE2]"
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
            <div className="w-full flex items-center min-h-[41px]">
              <div className="flex-none min-w-[20px] max-w-[20px] sm:min-w-[60px] sm:max-w-[60px] flex justify-center items-center">
                <div className="text-[0.5rem] sm:text-[0.875rem] text-[#DCDEE2]">
                  내용
                </div>
              </div>
              {isShowQuestionEdit ? (
                <textarea
                  className="flex-1 flex justify-start items-center border-[1px] rounded-[4px] my-[10px] px-[4px] text-[0.875rem] text-[#515A6E] ml-[8.5px] mr-[10px] sm:mr-[20px] disabled:opacity-50"
                  value={updateQuestionDescription}
                  onChange={onChangeUpdateQuestionDescription}
                  disabled={isLoadingSubmitUpdateQuestion}
                />
              ) : (
                <div className="flex-1 flex break-all justify-start items-stretch my-[10px] py-[4px] pl-[8.5px] pr-[20px] text-[0.5rem] sm:text-[0.875rem] sm:text-[0.875rem] text-[#515A6E]">
                  {question_description}
                </div>
              )}
              <div className="flex-none min-w-[40px] max-w-[40px] sm:min-w-[126px] sm:max-w-[126px] flex justify-center items-start relative right-[4px]">
                {token &&
                  ((userType === 'student' &&
                    userNickname === creator_nickname) ||
                    userType === 'admin') && (
                    <>
                      {isShowQuestionEdit ? (
                        <div className="w-full min-h-[41px] bg-white flex justify-start xl:justify-center items-center">
                          <button
                            type="submit"
                            className="min-w-[21px] max-w-[21px] min-h-[21px] max-h-[21px] sm:min-w-[unset] sm:max-w-[unset] sm:min-h-[unset] sm:max-h-[unset] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] sm:max-w-max font-normal sm:text-[0.75rem] text-[#808695] p-[5px] sm:px-[10px] sm:py-[4px] disabled:opacity-50"
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
                            className={`min-w-[21px] max-w-[21px] min-h-[21px] max-h-[21px] sm:min-w-[unset] sm:max-w-[unset] sm:min-h-[unset] sm:max-h-[unset] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] sm:max-w-max font-normal sm:text-[0.75rem] text-[#808695] mr-[10px] sm:mr-[18px] p-[5px] sm:px-[10px] sm:py-[4px] disabled:opacity-50 disabled:opacity-50 hover:opacity-50 disabled:cursor-not-allowed${
                              !!answer_id && userType !== 'admin'
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
                                className="block text-[0.6rem] ml-[2px]"
                                icon={faXmark}
                              />
                            </MediaQuery>
                            <MediaQuery minWidth={640}>취소</MediaQuery>
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="w-full min-h-[41px] bg-white flex xl:justify-center justify-start items-center">
                            <button
                              type="button"
                              className="min-w-[21px] max-w-[21px] min-h-[21px] max-h-[21px] sm:min-w-[unset] sm:max-w-[unset] sm:min-h-[unset] sm:max-h-[unset] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] sm:max-w-max font-normal sm:text-[0.75rem] text-[#808695] p-[5px] sm:px-[10px] sm:py-[4px] disabled:opacity-50 disabled:opacity-50 hover:opacity-50 disabled:cursor-not-allowed"
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
                              className={`min-w-[21px] max-w-[21px] min-h-[21px] max-h-[21px] sm:min-w-[unset] sm:max-w-[unset] sm:min-h-[unset] sm:max-h-[unset] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] sm:max-w-max font-normal sm:text-[0.75rem] text-[#808695] mr-[10px] sm:mr-[18px] p-[5px] sm:px-[10px] sm:py-[4px] disabled:opacity-50 disabled:opacity-50 hover:opacity-50 disabled:cursor-not-allowed${
                                !!answer_id && userType !== 'admin'
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
                {userType === 'admin' && !!!answer_id && (
                  <button
                    type="button"
                    className="absolute min-w-[21px] max-w-[21px] min-h-[21px] max-h-[21px] sm:w-max sm:min-w-[unset] sm:max-w-[unset] sm:min-h-[unset] sm:max-h-[unset] sm:h-[28px] flex justify-center items-center left-[44px] sm:left-[110px] xl:left-[133px] bottom-[10px] sm:bottom-[6px] rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] min-w-max max-w-max font-normal text-[0.75rem] text-[#808695] px-[4px] xl:px-[10px] py-[4px] disabled:opacity-50 hover:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      setIsShowAddAnswer(!isShowAddAnswer);
                    }}
                    disabled={isLoadingSubmitAnswer}
                  >
                    {isShowAddAnswer ? (
                      <>
                        <span className="hidden xl:block m-auto mr-[4px] h-[18px] sm:text-[0.75rem] font-medium text-[#808695]">
                          닫기
                        </span>
                        <ImgClose className="sm:w-[16px] sm:h-[16px] m-auto object-fill fill-[black] hover:fill-[#4DBFF0]" />
                      </>
                    ) : (
                      <>
                        <span className="hidden xl:block m-auto mr-[4px] h-[18px] sm:text-[0.75rem] font-medium text-[#808695]">
                          답변하기
                        </span>
                        <ImgEdit className="sm:w-[16px] sm:h-[16px] m-auto object-fill fill-[black] hover:fill-[#4DBFF0]" />
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
            className="min-h-[41px] bg-white flex"
            onClick={() => {
              setIsShowAnswerEdit(false);
              setIsShowAnswerDescription(!isShowAnswerDescription);
            }}
          >
            <div className="w-full flex items-center min-h-[41px]">
              <div className="flex-none min-w-[20px] max-w-[20px] sm:min-w-[60px] sm:max-w-[60px] flex justify-center items-center">
                <div className="text-[0.5rem] sm:text-[0.875rem] text-[#b13636]">
                  답변
                </div>
              </div>
              {isShowAnswerEdit ? (
                <input
                  className="flex-1 flex justify-start overflow-x-hidden items-center border-[1px] rounded-[4px] my-[10px] px-[4px] text-[0.875rem] text-[#515A6E] ml-[8.5px] disabled:opacity-50"
                  value={updateAnswerTitle}
                  onChange={onChangeUpdateAnswerTitle}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  disabled={isLoadingSubmitUpdateAnswer}
                />
              ) : (
                <div className="flex-1 flex break-all justify-start items-stretch my-[10px] py-[4px] pl-[8.5px] pr-[20px] text-[0.5rem] sm:text-[0.875rem] text-[#515A6E]">
                  {answer_title}
                </div>
              )}
              <div className="flex-none min-w-[40px] max-w-[40px] sm:min-w-[126px] sm:max-w-[126px] flex justify-end items-center mr-[10px] sm:mr-[20px]">
                <div
                  className="text-[0.5rem] sm:text-[0.875rem] text-[#DCDEE2]"
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
              <div className="w-full flex items-center min-h-[41px]">
                <div className="flex-none min-w-[20px] max-w-[20px] sm:min-w-[60px] sm:max-w-[60px] flex justify-center items-center">
                  <div className="text-[0.5rem] sm:text-[0.875rem] text-[#DCDEE2]">
                    내용
                  </div>
                </div>
                {isShowAnswerEdit ? (
                  <textarea
                    className="flex-1 flex justify-start items-stretch border-[1px] rounded-[4px] my-[10px] px-[4px] text-[0.875rem] text-[#515A6E] ml-[8.5px] mr-[10px] sm:mr-[20px] disabled:opacity-50"
                    value={updateAnswerDescription}
                    onChange={onChangeUpdateAnswerDescription}
                    disabled={isLoadingSubmitUpdateAnswer}
                  />
                ) : (
                  <div className="flex-1 flex break-all justify-start items-stretch my-[10px] py-[4px] pl-[8.5px] pr-[20px] text-[0.5rem] sm:text-[0.875rem] sm:text-[0.875rem] text-[#515A6E]">
                    {answer_description}
                  </div>
                )}
                <div className="flex-none min-w-[40px] max-w-[40px] sm:min-w-[126px] sm:max-w-[126px] flex justify-center items-start relative right-[4px]">
                  {!!token && userType === 'admin' && (
                    <>
                      {isShowAnswerEdit ? (
                        <div className="w-full min-h-[41px] bg-white flex justify-center items-center">
                          <button
                            type="submit"
                            className="min-w-[21px] max-w-[21px] min-h-[21px] max-h-[21px] sm:min-w-[unset] sm:max-w-[unset] sm:min-h-[unset] sm:max-h-[unset] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] sm:max-w-max font-normal sm:text-[0.75rem] text-[#808695] p-[5px] sm:px-[10px] sm:py-[4px] disabled:opacity-50 disabled:opacity-50 hover:opacity-50 disabled:cursor-not-allowed"
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
                            className="min-w-[21px] max-w-[21px] min-h-[21px] max-h-[21px] sm:min-w-[unset] sm:max-w-[unset] sm:min-h-[unset] sm:max-h-[unset] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] sm:max-w-max font-normal sm:text-[0.75rem] text-[#808695] mr-[10px] sm:mr-[18px] p-[5px] sm:px-[10px] sm:py-[4px] disabled:opacity-50 disabled:opacity-50 hover:opacity-50 disabled:cursor-not-allowed ml-[1px] xl:ml-[10px]"
                            onClick={() => {
                              setIsShowAnswerEdit(false);
                            }}
                            disabled={isLoadingSubmitUpdateAnswer}
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
                        <>
                          <div className="w-full min-h-[41px] bg-white flex xl:justify-center justify-start items-center">
                            <button
                              type="button"
                              className="min-w-[21px] max-w-[21px] min-h-[21px] max-h-[21px] sm:min-w-[unset] sm:max-w-[unset] sm:min-h-[unset] sm:max-h-[unset] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] sm:max-w-max font-normal sm:text-[0.75rem] text-[#808695] p-[5px] sm:px-[10px] sm:py-[4px] disabled:opacity-50 disabled:opacity-50 hover:opacity-50 disabled:cursor-not-allowed"
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
                              className="min-w-[21px] max-w-[21px] min-h-[21px] max-h-[21px] sm:min-w-[unset] sm:max-w-[unset] sm:min-h-[unset] sm:max-h-[unset] flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] sm:max-w-max font-normal sm:text-[0.75rem] text-[#808695] mr-[10px] sm:mr-[18px] p-[5px] sm:px-[10px] sm:py-[4px] disabled:opacity-50 disabled:opacity-50 hover:opacity-50 disabled:cursor-not-allowed ml-[1px] xl:ml-[10px]"
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
      {!!token && userType === 'admin' && !!!answer_id && isShowAddAnswer && (
        <div className="p-[10px]">
          <form
            className="px-[20px] md:px-[98px] py-[30px] box-border border-[1px] rounded-[8px] border-[#DCDEE2] w-full"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmitAnswerHandler();
            }}
          >
            <div className="mb-[28px] text-[#17233D] font-semibold text-[1.25rem] leading-[1.875rem]">
              {creator_nickname + '님 '}
              <span className="text-sm font-light"> 문의에 답변</span>
            </div>
            <div className="my-0">
              <input
                className="w-full border-[1px] min-h-[41px] border-[#DCDEE2] pl-[10px] py-[10px] text-[0.875rem] placeholder-[#DCDEE2] focus:border-[#8DC556] focus:outline-none disabled:opacity-50"
                type="text"
                value={newAnswerTitle}
                onChange={onChangeNewAnswerTitle}
                placeholder="제목을 입력하세요"
                disabled={isLoadingSubmitAnswer}
              />
            </div>
            <div className="mt-0 mb-[20px]">
              <textarea
                className="w-full min-h-[204px] max-h-[204px] border-[1px] border-[#DCDEE2] pl-[10px] py-[10px] text-[0.875rem] placeholder-[#DCDEE2] focus:border-[#8DC556] focus:outline-none disabled:opacity-50"
                value={newAnswerDescription}
                onChange={onChangeNewAnswerDescription}
                placeholder="내용을 입력하세요"
                disabled={isLoadingSubmitAnswer}
              />
            </div>
            <button
              type="submit"
              className="w-full min-h-[41px] text-[0.875rem] font-semibold bg-[#8DC556] box-border border-[1px] border-[#8DC556] rounded-[4px] text-white my-0 disabled:opacity-50 hover:opacity-50 disabled:cursor-not-allowed"
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
