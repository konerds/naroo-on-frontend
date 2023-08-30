import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import ComponentElementEditUser from './user/ComponentElementEditUser';
import { useSWRListUserAll } from '../../hooks/api';
import stateToken from '../../recoil/state-object-token/stateToken';

interface IPropsComponentContainerEditUser {}

const ComponentContainerEditUser: FC<
  IPropsComponentContainerEditUser
> = ({}) => {
  const token = useRecoilValue(stateToken);
  const { data: dataListUserAll } = useSWRListUserAll();
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {!!token &&
        !!dataListUserAll &&
        dataListUserAll
          .sort((a, b) => +a.id - +b.id)
          .map((user, index) => (
            <ComponentElementEditUser key={index} user={user} />
          ))}
    </div>
  );
};

export default ComponentContainerEditUser;
