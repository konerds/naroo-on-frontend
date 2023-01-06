import * as React from 'react';
import axios from 'axios';
import { useStringInput } from '../../../hooks';
import { IUserEdit } from '../../../interfaces';
import { ReactComponent as ImgEdit } from '../../../assets/images/Edit.svg';
import ContextToken from '../../../store/ContextToken';
import { showError } from '../../../hooks/api';
import { KeyedMutator } from 'swr';
import { toast } from 'react-toastify';

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
        toast('성공적으로 정보를 업데이트하였습니다', { type: 'success' });
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
          className="mt-[10px] block sm:flex sm:items-center sm:min-h-[41px]"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitUpdateField();
          }}
        >
          <div className="w-full">
            <input
              className="w-full h-[32px] border-[1px] box-border rounded-[4px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[0.875rem] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white pl-[5px] disabled:opacity-50"
              type="text"
              value={updateFieldName ? updateFieldName : ''}
              onChange={onChangeUpdateFieldName}
              disabled={isLoadingSubmit}
            />
          </div>
          <div className="flex justify-end sm:justify-start items-center mt-[5px] mb-[10px]">
            <button
              className="w-[65px] h-[32px] mx-[5px] sm:mx-[10px] button-modify-cancel-admin text-sm"
              type="submit"
              disabled={isLoadingSubmit}
            >
              수정
            </button>
            <button
              className="w-[65px] h-[32px] button-modify-cancel-admin"
              type="button"
              onClick={onClickUpdateToggle}
              disabled={isLoadingSubmit}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center min-h-[41px] py-[10px] w-full">
          <div className="w-full">
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
          {fieldType !== 'email' && (
            <ImgEdit
              className="ml-[20px] cursor-pointer fill-[black] hover:fill-[#4DBFF0]"
              onClick={onClickUpdateToggle}
              width={14}
              height={14}
            />
          )}
        </div>
      )}
    </>
  );
};

export default ComponentFormUpdateUser;
