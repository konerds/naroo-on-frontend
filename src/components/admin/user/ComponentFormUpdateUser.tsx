import * as React from 'react';
import axios from 'axios';
import { useStringInput } from '../../../hooks';
import { IUserEdit } from '../../../interfaces';
import { ReactComponent as ImgEdit } from '../../../assets/images/Edit.svg';
import ContextToken from '../../../store/ContextToken';
import { showError } from '../../../hooks/api';
import { KeyedMutator } from 'swr';

interface IPropsComponentFormUpdateUser {
  fieldType: string;
  id: string;
  userField: string;
  mutate: KeyedMutator<IUserEdit> | KeyedMutator<IUserEdit[]>;
}

const ComponentFormUpdateUser: React.FC<IPropsComponentFormUpdateUser> = ({
  fieldType,
  id,
  userField,
  mutate,
}) => {
  const tokenCtx = React.useContext(ContextToken);
  const { token } = tokenCtx;
  const [updateToggle, setUpdateToggle] = React.useState<boolean>(false);
  const {
    value: updateFieldName,
    setValue: setUpdateFieldName,
    onChange: onChangeUpdateFieldName,
  } = useStringInput('');
  const [isLoadingSubmit, setIsLoadingSubmit] = React.useState<boolean>(false);
  const onClickUpdateToggle = () => {
    setUpdateToggle(!updateToggle);
    setUpdateFieldName(userField);
  };
  const onSubmitUpdateField = async () => {
    try {
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
        await mutate();
        setUpdateToggle(!updateToggle);
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingSubmit(false);
    }
  };
  return (
    <>
      {updateToggle ? (
        <form
          className="flex items-center min-h-[41px] py-[10px]"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitUpdateField();
          }}
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
            className="mx-[10px] w-[50px] box-border rounded-[4px] border-[1px] border-[#4DBFF0] h-[41px] text-[14px] font-semibold bg-[#4DBFF0] text-white disabled:opacity-50"
            type="submit"
            disabled={isLoadingSubmit}
          >
            수정
          </button>
          <button
            className="w-[50px] box-border rounded-[4px] border-[1px] border-[#4DBFF0] h-[41px] text-[14px] font-semibold leading-[150%] bg-[#4DBFF0] text-white disabled:opacity-50"
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
              {userField === '' &&
                fieldType === 'password' &&
                '보안을 위해 기존 비밀번호 확인은 불가능하며, 새로운 비밀번호를 설정하는 것은 가능합니다'}
            </div>
          </div>
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

export default ComponentFormUpdateUser;
