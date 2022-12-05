import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { FC, useState } from 'react';
import { toast } from 'react-toastify';
import { MutatorCallback } from 'swr/dist/types';
import { IUserEdit } from '../../../interfaces';
import UpdateUserField from './UpdateUserField';

interface UserEditElementProps {
  token: string | null;
  setToken: (
    value: string | ((val: string | null) => string | null) | null,
  ) => void;
  user: IUserEdit;
  mutate: (
    data?:
      | IUserEdit[]
      | Promise<IUserEdit[]>
      | MutatorCallback<IUserEdit[]>
      | undefined,
    shouldRevalidate?: boolean | undefined,
  ) => Promise<IUserEdit[] | undefined>;
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
        setTimeout(() => {
          mutate();
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
        setIsLoadingDeleteUser(false);
      }, 500);
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
                token={token}
                setToken={setToken}
                fieldType="email"
                id={user.id}
                userField={user.email}
                mutate={mutate}
              />
            )}
            {user.nickname && (
              <UpdateUserField
                token={token}
                setToken={setToken}
                fieldType="nickname"
                id={user.id}
                userField={user.nickname}
                mutate={mutate}
              />
            )}
            <UpdateUserField
              token={token}
              setToken={setToken}
              fieldType="password"
              id={user.id}
              userField={null}
              mutate={mutate}
            />
            {user.phone && (
              <UpdateUserField
                token={token}
                setToken={setToken}
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
