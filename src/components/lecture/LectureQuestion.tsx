import * as React from 'react';
import 'moment/locale/ko';
import moment from 'moment';
import axios from 'axios';
import { ILectureDetail } from '../../interfaces';
import { useInput } from '../../hooks';
import ImgEdit from '../../assets/images/Edit.svg';
import ImgClose from '../../assets/images/Close.svg';
import { showError } from '../../hooks/api';
import { KeyedMutator } from 'swr';

interface LectureQuestionProps {
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

const LectureQuestion: React.FC<LectureQuestionProps> = ({
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
  const [
    updateQuestionTitle,
    onChangeUpdateQuestionTitle,
    setUpdateQuestionTitle,
  ] = useInput(question_title);
  const [
    updateQuestionDescription,
    onChangeUpdateQuestionDescription,
    setUpdateQuestionDescription,
  ] = useInput(question_description);
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
        setTimeout(() => {
          mutate();
          setIsShowQuestionEdit(false);
        }, 500);
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setTimeout(() => {
        setIsLoadingSubmitUpdateQuestion(false);
      }, 500);
    }
  };
  const [newAnswerTitle, onChangeNewAnswerTitle, setNewAnswerTitle] =
    useInput('');
  const [
    newAnswerDescription,
    onChangeNewAnswerDescription,
    setNewAnswerDescription,
  ] = useInput('');
  const [updateAnswerTitle, onChangeUpdateAnswerTitle, setUpdateAnswerTitle] =
    useInput(answer_title);
  const [
    updateAnswerDescription,
    onChangeUpdateAnswerDescription,
    setUpdateAnswerDescription,
  ] = useInput(answer_description);
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
          className="min-h-[41px] max-h-[41px] bg-white flex"
          onClick={() => {
            setIsShowQuestionEdit(false);
            setIsShowQuestionDescription(!isShowQuestionDescription);
          }}
        >
          <div className="w-full flex items-center min-h-[41px] max-h-[41px]">
            <div className="flex-none min-w-[60px] max-w-[60px] flex justify-center items-center">
              <div className="text-[14px] leading-[150%] text-[#DCDEE2]">
                {array_index}
              </div>
            </div>
            {isShowQuestionEdit ? (
              <input
                className="flex-1 flex justify-start overflow-x-hidden items-center border-[1px] rounded-[4px] my-[10px] px-[4px] text-[14px] leading-[150%] text-[#515A6E] ml-[8.5px] disabled:opacity-50"
                value={updateQuestionTitle}
                onChange={onChangeUpdateQuestionTitle}
                onClick={(event) => {
                  event.stopPropagation();
                }}
                disabled={isLoadingSubmitUpdateQuestion}
              />
            ) : (
              <div className="flex-1 flex overflow-x-hidden justify-start items-stretch my-[10px] py-[4px]">
                <div className="pl-[8.5px] text-[14px] leading-[150%] text-[#515A6E]">
                  {token && userType === 'admin'
                    ? `[${creator_nickname}] `
                    : ''}{' '}
                  {question_title}
                </div>
              </div>
            )}
            <div className="flex-none min-w-[126px] max-w-[126px] flex justify-end items-center mr-[20px]">
              <div
                className="text-[14px] leading-[150%] text-[#DCDEE2]"
                title={moment(question_created_at).format(
                  'YYYY년 MM월 DD일 HH시 mm분',
                )}
              >
                {moment(question_created_at).format('YYYY년 MM월 DD일')}
              </div>
            </div>
          </div>
        </div>
        {isShowQuestionDescription ? (
          <>
            <div className="w-full flex items-center min-h-[41px]">
              <div className="flex-none min-w-[60px] max-w-[60px] flex justify-center items-center">
                <div className="text-[14px] leading-[150%] text-[#DCDEE2]">
                  내용
                </div>
              </div>
              {isShowQuestionEdit ? (
                <textarea
                  className="flex-1 flex justify-start items-center border-[1px] rounded-[4px] my-[10px] px-[4px] text-[14px] leading-[150%] text-[#515A6E] ml-[8.5px] mr-[20px] disabled:opacity-50"
                  value={updateQuestionDescription}
                  onChange={onChangeUpdateQuestionDescription}
                  disabled={isLoadingSubmitUpdateQuestion}
                />
              ) : (
                <div className="flex-1 flex break-all justify-start items-stretch my-[10px] py-[4px]">
                  <div className="pl-[8.5px] pr-[20px] text-[14px] leading-[150%] text-[#515A6E]">
                    {question_description}
                  </div>
                </div>
              )}
              <div className="flex-none min-w-[126px] max-w-[126px] flex justify-center items-start relative">
                {token &&
                  ((userType === 'student' &&
                    userNickname === creator_nickname) ||
                    userType === 'admin') && (
                    <>
                      {isShowQuestionEdit ? (
                        <div className="w-full min-h-[41px] bg-white flex xl:justify-center justify-start items-center">
                          <button
                            type="submit"
                            className="flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] max-w-max font-normal text-[12px] leading-[150%] text-[#808695] px-[10px] py-[4px] disabled:opacity-50"
                            disabled={isLoadingSubmitUpdateQuestion}
                          >
                            완료
                          </button>
                          <button
                            type="button"
                            className="flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] max-w-max font-normal text-[12px] leading-[150%] text-[#808695] xl:ml-[10px] ml-[1px] mr-[18px] px-[10px] py-[4px] disabled:opacity-50"
                            onClick={() => {
                              setIsShowQuestionEdit(false);
                            }}
                            disabled={isLoadingSubmitUpdateQuestion}
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="w-full min-h-[41px] bg-white flex xl:justify-center justify-start items-center">
                            <button
                              type="button"
                              className="flex-none rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] max-w-max font-normal text-[12px] leading-[150%] text-[#808695] px-[10px] py-[4px] disabled:opacity-50"
                              onClick={(event) => {
                                event.preventDefault();
                                setIsShowQuestionEdit(true);
                              }}
                              disabled={isLoadingClickDeleteQuestion}
                            >
                              수정
                            </button>
                            <button
                              type="button"
                              className="flex-none rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] max-w-max font-normal text-[12px] leading-[150%] text-[#808695] xl:ml-[10px] ml-[1px] mr-[18px] px-[10px] py-[4px] disabled:opacity-50"
                              onClick={() => {
                                onClickDeleteQuestionHandler();
                              }}
                              disabled={isLoadingClickDeleteQuestion}
                            >
                              삭제
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                {userType === 'admin' && !answer_id ? (
                  <button
                    type="button"
                    className="absolute flex justify-center items-center xl:left-[133px] left-[90px] bottom-[6px] rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] min-w-max max-w-max font-normal text-[12px] leading-[150%] text-[#808695] px-[10px] py-[4px] disabled:opacity-50"
                    onClick={(event) => {
                      event.preventDefault();
                      setIsShowAddAnswer(!isShowAddAnswer);
                    }}
                    disabled={isLoadingSubmitAnswer}
                  >
                    {isShowAddAnswer ? (
                      <>
                        <span className="m-auto mr-[4px] h-[18px] text-[12px] leading-[150%] font-medium text-[#808695]">
                          응답사항
                        </span>
                        <img
                          className="w-[16px] h-[16px] m-auto object-fit"
                          src={ImgClose}
                        />
                      </>
                    ) : (
                      <>
                        <span className="m-auto mr-[4px] h-[18px] text-[12px] leading-[150%] font-medium text-[#808695]">
                          응답사항
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
            className="min-h-[41px] max-h-[41px] bg-white flex"
            onClick={() => {
              setIsShowAnswerEdit(false);
              setIsShowAnswerDescription(!isShowAnswerDescription);
            }}
          >
            <div className="w-full flex items-center min-h-[41px] max-h-[41px]">
              <div className="flex-none min-w-[60px] max-w-[60px] flex justify-center items-center">
                <div className="text-[14px] leading-[150%] text-[#DCDEE2]">
                  응답
                </div>
              </div>
              {isShowAnswerEdit ? (
                <input
                  className="flex-1 flex justify-start overflow-x-hidden items-center border-[1px] rounded-[4px] my-[10px] px-[4px] text-[14px] leading-[150%] text-[#515A6E] ml-[8.5px] disabled:opacity-50"
                  value={updateAnswerTitle}
                  onChange={onChangeUpdateAnswerTitle}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  disabled={isLoadingSubmitUpdateAnswer}
                />
              ) : (
                <div className="flex-1 flex overflow-x-hidden justify-start items-stretch my-[10px] py-[4px]">
                  <div className="pl-[8.5px] pr-[20px] text-[14px] leading-[150%] text-[#515A6E]">
                    {answer_title}
                  </div>
                </div>
              )}
              <div className="flex-none min-w-[126px] max-w-[126px] flex justify-end items-center mr-[20px]">
                <div
                  className="text-[14px] leading-[150%] text-[#DCDEE2]"
                  title={moment(answer_created_at).format(
                    'YYYY년 MM월 DD일 HH시 mm분',
                  )}
                >
                  {moment(answer_created_at).format('YYYY년 MM월 DD일')}
                </div>
              </div>
            </div>
          </div>
          {isShowAnswerDescription ? (
            <>
              <div className="w-full flex items-center min-h-[41px]">
                <div className="flex-none min-w-[60px] max-w-[60px] flex justify-center items-center">
                  <div className="text-[14px] leading-[150%] text-[#DCDEE2]">
                    내용
                  </div>
                </div>
                {isShowAnswerEdit ? (
                  <textarea
                    className="flex-1 flex justify-start items-stretch border-[1px] rounded-[4px] my-[10px] px-[4px] text-[14px] leading-[150%] text-[#515A6E] ml-[8.5px] mr-[20px] disabled:opacity-50"
                    value={updateAnswerDescription}
                    onChange={onChangeUpdateAnswerDescription}
                    disabled={isLoadingSubmitUpdateAnswer}
                  />
                ) : (
                  <div className="flex-1 flex break-all justify-start items-stretch my-[10px] py-[4px]">
                    <div className="pl-[8.5px] pr-[20px] text-[14px] leading-[150%] text-[#515A6E]">
                      {answer_description}
                    </div>
                  </div>
                )}
                <div className="flex-none min-w-[126px] max-w-[126px] flex justify-center items-start">
                  {!!token && userType === 'admin' && (
                    <>
                      {isShowAnswerEdit ? (
                        <div className="w-full min-h-[41px] bg-white flex justify-center items-center">
                          <button
                            type="submit"
                            className="flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] max-w-max font-normal text-[12px] leading-[150%] text-[#808695] px-[10px] py-[4px] disabled:opacity-50"
                            disabled={isLoadingSubmitUpdateAnswer}
                          >
                            완료
                          </button>
                          <button
                            type="button"
                            className="flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] max-w-max font-normal text-[12px] leading-[150%] text-[#808695] ml-[10px] mr-[18px] px-[10px] py-[4px] disabled:opacity-50"
                            onClick={() => {
                              setIsShowAnswerEdit(false);
                            }}
                            disabled={isLoadingSubmitUpdateAnswer}
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="w-full min-h-[41px] bg-white flex justify-center items-center">
                            <button
                              type="button"
                              className="flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] max-w-max font-normal text-[12px] leading-[150%] text-[#808695] px-[10px] py-[4px] disabled:opacity-50"
                              onClick={(event) => {
                                event.preventDefault();
                                setIsShowAnswerEdit(true);
                              }}
                              disabled={isLoadingClickDeleteAnswer}
                            >
                              수정
                            </button>
                            <button
                              type="button"
                              className="flex-1 rounded-[4px] border-[1px] border-[#EBEEEF] bg-[#F9F9FA] max-w-max font-normal text-[12px] leading-[150%] text-[#808695] ml-[10px] mr-[18px] px-[10px] py-[4px] disabled:opacity-50"
                              onClick={() => {
                                onClickDeleteAnswerHandler();
                              }}
                              disabled={isLoadingClickDeleteAnswer}
                            >
                              삭제
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
      {!!token && userType === 'admin' && !answer_id && isShowAddAnswer && (
        <form
          className="min-h-[491px] max-h-[491px] px-[98px] py-[68px] box-border border-[1px] rounded-[8px] border-[#DCDEE2] w-full"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitAnswerHandler();
          }}
        >
          <div className="mb-[28px] text-[#17233D] font-semibold text-[20px] leading-[150%]">
            응답사항 등록
          </div>
          <div className="my-0">
            <input
              className="w-full border-[1px] min-h-[41px] max-h-[41px] border-[#DCDEE2] pl-[10px] py-[10px] text-[14px] leading-[150%] placeholder-[#DCDEE2] focus:border-[#8DC556] focus:outline-none disabled:opacity-50"
              type="text"
              value={newAnswerTitle}
              onChange={onChangeNewAnswerTitle}
              placeholder="제목을 입력하세요!"
              disabled={isLoadingSubmitAnswer}
            />
          </div>
          <div className="mt-0 mb-[20px]">
            <textarea
              className="w-full min-h-[204px] max-h-[204px] border-[1px] border-[#DCDEE2] pl-[10px] py-[10px] text-[14px] leading-[150%] placeholder-[#DCDEE2] focus:border-[#8DC556] focus:outline-none disabled:opacity-50"
              value={newAnswerDescription}
              onChange={onChangeNewAnswerDescription}
              placeholder="내용을 입력하세요!"
              disabled={isLoadingSubmitAnswer}
            />
          </div>
          <button
            type="submit"
            className="w-full min-h-[41px] max-h-[41px] text-[14px] leading-[150%] font-semibold bg-[#8DC556] box-border border-[1px] border-[#8DC556] rounded-[4px] text-white my-0 disabled:opacity-50"
            disabled={isLoadingSubmitAnswer}
          >
            응답사항 등록
          </button>
        </form>
      )}
    </>
  );
};

export default LectureQuestion;
