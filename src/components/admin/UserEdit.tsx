import { FC } from 'react';
import { KeyedMutator } from 'swr';
import { IUserEdit } from '../../interfaces';
import UserEditElement from './user/UserEditElement';

interface UserEditProps {
  token: string | null;
  setToken: (v: string | null) => void;
  dataUsers: IUserEdit[] | undefined;
  mutateUsers: KeyedMutator<IUserEdit[]>;
}

const UserEdit: FC<UserEditProps> = ({
  token,
  setToken,
  dataUsers,
  mutateUsers,
}) => {
  return (
    <div className="mt-[30px]">
      {!!token &&
        !!dataUsers &&
        dataUsers
          .sort((a, b) => +a.id - +b.id)
          .map((user, index) => (
            <UserEditElement
              key={index}
              token={token}
              setToken={setToken}
              user={user}
              mutate={mutateUsers}
            />
          ))}
    </div>
  );
};

export default UserEdit;
