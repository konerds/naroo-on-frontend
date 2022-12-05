import { FC } from 'react';
import AdminLecture from '../components/admin/AdminLecture';
import { useGetSWR } from '../hooks/api';
import { IUserEdit, ITags } from '../interfaces';

interface AdminLayoutProps {
  token: string | null;
  setToken: (
    value: string | ((val: string | null) => string | null) | null,
  ) => void;
}

const AdminLayout: FC<AdminLayoutProps> = ({ token, setToken }) => {
  const users = useGetSWR<IUserEdit[]>(
    `${process.env.REACT_APP_BACK_URL}/user/admin/user`,
    token,
    true,
  );
  const { data: tagsData, mutate: tagsMutate } = useGetSWR<ITags[]>(
    `${process.env.REACT_APP_BACK_URL}/lecture/admin/tag`,
    token,
    true,
  );
  return (
    <div className="min-h-screen bg-white font-noto">
      <AdminLecture
        token={token}
        setToken={setToken}
        users={users}
        tagsData={tagsData}
        tagsMutate={tagsMutate}
      />
    </div>
  );
};

export default AdminLayout;
