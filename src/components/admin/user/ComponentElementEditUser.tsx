import * as React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { IUserEdit } from '../../../interfaces';
import ComponentFormUpdateUser from './ComponentFormUpdateUser';
import { KeyedMutator } from 'swr';
import { showError } from '../../../hooks/api';

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
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingDeleteUser(false);
    }
  };
  return (
    <React.Fragment key={!!user.id ? user.id : null}>
      {!!user.id && (
        <div
          className={`w-auto sm border-[1px] rounded-[4px] p-[20px] my-[20px] ${
            user.role === 'admin'
              ? 'border-[3px] border-red-700'
              : 'border-black'
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
            } border-[1px] mx-auto md:mr-0 mt-[10px] rounded-[4px] w-max px-[10px] py-[5px] disabled:opacity-50 hover:bg-black hover:text-white`}
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
