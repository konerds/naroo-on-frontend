import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import ComponentAdminLecture from '../components/admin/AdminLecture';
import { axiosGetfetcher } from '../hooks/api';
import { IInfoMe } from '../interfaces';
import TokenContext from '../store/TokenContext';

interface IPropsPageAdmin {}

const PageAdmin: React.FC<IPropsPageAdmin> = ({}) => {
  const navigate = useNavigate();
  const tokenCtx = React.useContext(TokenContext);
  const { token } = tokenCtx;
  const { data: dataGetMe, error: errorGetMe } = useSWR<IInfoMe>(
    !!token ? `${process.env.REACT_APP_BACK_URL}/user/me` : null,
    () => axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/user/me`, token),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  React.useEffect(() => {
    if (!(!!dataGetMe && !!!errorGetMe && dataGetMe.role === 'admin')) {
      navigate('/', { replace: true });
    }
  }, [dataGetMe, errorGetMe]);
  return (
    <div className="min-h-screen bg-white font-noto">
      {!!dataGetMe && !!!errorGetMe && dataGetMe.role === 'admin' && (
        <ComponentAdminLecture />
      )}
    </div>
  );
};

export default PageAdmin;
