import * as React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { IUserEdit } from '../../../interfaces';
import ComponentFormUpdateUser from './ComponentFormUpdateUser';
import { KeyedMutator } from 'swr';
import { showError } from '../../../hooks/api';
import { toast } from 'react-toastify';

interface IPropsComponentElementEditUser {
  token: string;
  user: IUserEdit;
  mutate: KeyedMutator<IUserEdit[]>;
}

const ComponentElementEditUser: React.FC<IPropsComponentElementEditUser> = ({
  token,
  user,
  mutate,
}) => {
  const [isLoadingDeleteUser, setIsLoadingDeleteUser] =
    React.useState<boolean>(false);
  const onClickDeleteUser = async (id: string | null) => {
    try {
      setIsLoadingDeleteUser(true);
      const response = await axios.delete(
        `${process.env.REACT_APP_BACK_URL}/user/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        await mutate();
        toast('성공적으로 사용자가 삭제되었습니다', { type: 'success' });
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingDeleteUser(false);
    }
  };
  return (
    <React.Fragment>
      {!!user.id && (
        <div
          className={`my-[20px] w-auto rounded-[4px] border-[1px] p-[20px]${
            user.role === 'admin'
              ? ' border-[3px] border-red-700'
              : ' border-black'
          }`}
        >
          <>
            {!!user.email && (
              <ComponentFormUpdateUser
                fieldType="email"
                id={user.id}
                userField={user.email}
                mutate={mutate}
              />
            )}
            {!!user.nickname && (
              <ComponentFormUpdateUser
                fieldType="nickname"
                id={user.id}
                userField={user.nickname}
                mutate={mutate}
              />
            )}
            <ComponentFormUpdateUser
              fieldType="password"
              id={user.id}
              userField={''}
              mutate={mutate}
            />
            {!!user.phone && (
              <ComponentFormUpdateUser
                fieldType="phone"
                id={user.id}
                userField={user.phone}
                mutate={mutate}
              />
            )}
          </>
          <button
            disabled={isLoadingDeleteUser}
            className={`${
              user.role === 'admin' ? 'hidden' : 'block'
            } mx-auto mt-[10px] w-max rounded-[4px] border-[1px] px-[10px] py-[5px] hover:bg-black hover:text-white disabled:opacity-50 md:mr-0`}
            onClick={() => {
              !!user.id ? onClickDeleteUser(user.id) : null;
            }}
          >
            삭제
            <FontAwesomeIcon className="ml-[10px]" icon={faTrash} />
          </button>
        </div>
      )}
    </React.Fragment>
  );
};

export default ComponentElementEditUser;
