import * as React from 'react';
import { KeyedMutator } from 'swr';
import { IUserEdit } from '../../interfaces';
import ComponentElementEditUser from './user/ComponentElementEditUser';

interface IPropsComponentContainerEditUser {
  token: string | null;
  dataUsers: IUserEdit[] | undefined;
  mutateUsers: KeyedMutator<IUserEdit[]>;
}

const ComponentContainerEditUser: React.FC<
  IPropsComponentContainerEditUser
> = ({ token, dataUsers, mutateUsers }) => {
  return (
    <div className="mt-[30px]">
      {!!token &&
        !!dataUsers &&
        dataUsers
          .sort((a, b) => +a.id - +b.id)
          .map((user, index) => (
            <ComponentElementEditUser
              key={index}
              token={token}
              user={user}
              mutate={mutateUsers}
            />
          ))}
    </div>
  );
};

export default ComponentContainerEditUser;
