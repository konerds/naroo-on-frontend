import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { FC, useState } from 'react';
import { IUserEdit } from '../../../interfaces';
import UpdateUserField from './UpdateUserField';
import { KeyedMutator } from 'swr';
import { showError } from '../../../hooks/api';

interface UserEditElementProps {
  token: string;
  setToken: (v: string | null) => void;
  user: IUserEdit;
  mutate: KeyedMutator<IUserEdit[]>;
}

const UserEditElement: FC<UserEditElementProps> = ({
  token,
  setToken,
  user,
  mutate,
}) => {
  const [isLoadingDeleteUser, setIsLoadingDeleteUser] =
    useState<boolean>(false);
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
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingDeleteUser(false);
    }
  };
  return (
    <div key={user.id ? user.id : null}>
      {user.id && (
        <div
          className={`border-[1px] rounded-[4px] p-[20px] my-[20px] ${
            user.role === 'admin'
              ? 'border-[3px] border-red-700'
              : 'border-black'
          }`}
        >
          <div>
            {user.email && (
              <UpdateUserField
                fieldType="email"
                id={user.id}
                userField={user.email}
                mutate={mutate}
              />
            )}
            {user.nickname && (
              <UpdateUserField
                fieldType="nickname"
                id={user.id}
                userField={user.nickname}
                mutate={mutate}
              />
            )}
            <UpdateUserField
              fieldType="password"
              id={user.id}
              userField={null}
              mutate={mutate}
            />
            {user.phone && (
              <UpdateUserField
                fieldType="phone"
                id={user.id}
                userField={user.phone}
                mutate={mutate}
              />
            )}
          </div>
          <button
            disabled={isLoadingDeleteUser}
            className={`${
              user.role === 'admin' ? 'hidden' : 'block'
            } border-[1px] mx-auto mt-[10px] rounded-[4px] w-[10vw] disabled:opacity-50`}
          >
            삭제
            <FontAwesomeIcon
              className="ml-[1vw]"
              icon={faTrash}
              onClick={() => {
                user.id ? onClickDeleteUser(user.id) : null;
              }}
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserEditElement;
