import axios from 'axios';
import { FC, FormEvent, FormEventHandler, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { useInput } from '../../../hooks';
import { IUserEdit } from '../../../interfaces';
import { ReactComponent as ImgEdit } from '../../../assets/images/Edit.svg';
import TokenContext from '../../../store/TokenContext';

interface UpdateUserFieldProps {
  fieldType: string;
  id: string;
  userField: string | null;
  mutate: (
    data?: any,
    shouldRevalidate?: boolean | undefined,
  ) => Promise<IUserEdit | IUserEdit[] | undefined>;
}

const UpdateUserField: FC<UpdateUserFieldProps> = ({
  fieldType,
  id,
  userField,
  mutate,
}) => {
  const tokenCtx = useContext(TokenContext);
  const { token } = tokenCtx;
  const [updateToggle, setUpdateToggle] = useState<boolean>(false);
  const [updateFieldName, onChangeUpdateFieldName, setUpdateFieldName] =
    useInput('');
  const onClickUpdateToggle = () => {
    setUpdateToggle(!updateToggle);
    setUpdateFieldName(userField);
  };
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const onSubmitUpdateField: FormEventHandler<HTMLFormElement> = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    try {
      event.preventDefault();
      setIsLoadingSubmit(true);
      if (!updateFieldName || updateFieldName === userField) {
        setUpdateToggle(!updateToggle);
        setUpdateFieldName(userField);
        return;
      }

      const response = await axios.put(
        `${process.env.REACT_APP_BACK_URL}/user/admin/${id}`,
        {
          [fieldType]: updateFieldName,
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
          setUpdateToggle(!updateToggle);
        }, 500);
      }
    } catch (error: any) {
      const messages = error.response.data.message;
      if (Array.isArray(messages)) {
        messages.map((message) => {
          toast.error(message);
        });
      } else {
        toast.error(messages);
      }
    } finally {
      setTimeout(() => {
        setIsLoadingSubmit(false);
      }, 500);
    }
  };
  return (
    <>
      {updateToggle ? (
        <form
          className="flex items-center min-h-[41px] py-[10px]"
          onSubmit={onSubmitUpdateField}
        >
          <div className="w-full">
            <input
              className="w-full h-[41px] border-[1px] box-border rounded-[4px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[14px] leading-[150%] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white px-[20px] disabled:opacity-50"
              type="text"
              value={updateFieldName ? updateFieldName : ''}
              onChange={onChangeUpdateFieldName}
              disabled={isLoadingSubmit}
            />
          </div>
          <button
            className="mx-[10px] lg:w-[4vw] w-[8vw] box-border rounded-[4px] border-[1px] border-[#4DBFF0] h-[41px] lg:text-[14px] text-[1vw] font-semibold leading-[150%] bg-[#4DBFF0] text-white disabled:opacity-50"
            type="submit"
            disabled={isLoadingSubmit}
          >
            수정
          </button>
          <button
            className="lg:w-[4vw] w-[8vw] box-border rounded-[4px] border-[1px] border-[#4DBFF0] h-[41px] lg:text-[14px] text-[1vw] font-semibold leading-[150%] bg-[#4DBFF0] text-white disabled:opacity-50"
            type="button"
            onClick={onClickUpdateToggle}
            disabled={isLoadingSubmit}
          >
            취소
          </button>
        </form>
      ) : (
        <div className="flex items-center min-h-[41px] py-[10px] w-full">
          <div className="w-full overflow-x-hidden">
            <div>
              {fieldType === 'email'
                ? '이메일 : '
                : fieldType === 'nickname'
                ? '닉네임 : '
                : fieldType === 'phone'
                ? '휴대폰 번호 : '
                : ''}
              {userField && userField}
              {!userField &&
                fieldType === 'password' &&
                '보안을 위해 기존 비밀번호 확인은 불가능하며, 새로운 비밀번호를 설정하는 것은 가능합니다!'}
            </div>
          </div>
          {/* <img
            src={ImgEdit}
            className="w-[14px] h-[14px] ml-[20px] cursor-pointer hover:text-black"
            onClick={onClickUpdateToggle}
          /> */}
          <ImgEdit
            className="ml-[20px] cursor-pointer fill-[black] hover:fill-[#4DBFF0]"
            onClick={onClickUpdateToggle}
            width={14}
            height={14}
          />
        </div>
      )}
    </>
  );
};

export default UpdateUserField;
