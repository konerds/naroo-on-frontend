import { FC } from 'react';
import { DataResponse } from '../../hooks/api';
import { IUserEdit } from '../../interfaces';
import UserEditElement from './user/UserEditElement';

interface UserEditProps {
  token: string | null;
  setToken: (
    value: string | ((val: string | null) => string | null) | null,
  ) => void;
  users: DataResponse<IUserEdit[]>;
}

const UserEdit: FC<UserEditProps> = ({ token, setToken, users }) => {
  return (
    <div className="mt-[30px]">
      {users.data &&
        users.data
          .sort((a, b) => +a.id - +b.id)
          .map((user) => (
            <UserEditElement
              token={token}
              setToken={setToken}
              user={user}
              mutate={users.mutate}
            />
          ))}
    </div>
  );
};

export default UserEdit;
