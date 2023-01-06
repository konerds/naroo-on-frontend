import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import ComponentFormUpdateUser from '../components/admin/user/ComponentFormUpdateUser';
import useSWR from 'swr';
import { IInfoMe, IUserEdit } from '../interfaces';
import ContextToken from '../store/ContextToken';
import { axiosGetfetcher } from '../hooks/api';

const PageProfile: React.FC = () => {
  const navigate = useNavigate();
  const tokenCtx = React.useContext(ContextToken);
  const { token } = tokenCtx;
  const { data: dataGetMe, error: errorGetMe } = useSWR<IInfoMe>(
    !!token ? `${process.env.REACT_APP_BACK_URL}/user/me` : null,
    () => axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/user/me`, token),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    },
  );
  const {
    data: dataMyInfo,
    mutate: mutateMyInfo,
    error: errorMyInfo,
  } = useSWR<IUserEdit>(
    !!token && !!dataGetMe && !!!errorGetMe
      ? `${process.env.REACT_APP_BACK_URL}/user/myinfo`
      : null,
    () =>
      axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/user/myinfo`, token),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  React.useEffect(() => {
    if (
      !!!token ||
      !!errorGetMe ||
      (!!token && !!dataGetMe && !!!errorGetMe && dataGetMe.role === 'admin')
    ) {
      navigate('/', { replace: true });
    }
  }, [token, dataGetMe, errorGetMe, dataGetMe?.role]);
  return (
    <div className="w-full flex justify-center items-center min-h-[530px]">
      <div className="min-w-[90vw] max-w-[90vw] sm:min-w-[70vw] sm:max-w-[70vw] md:min-w-[472.75px] md:max-w-[472.75px] xl:min-w-[554px] xl:max-w-[554px] box-border rounded-[8px] border-[1px] border-[#DCDEE2] m-auto py-[30px] px-[20px] sm:px-[55px] xl:px-[98px] ">
        <div className="text-[1.5rem] font-semibold">개인 정보 수정</div>
        {!!dataMyInfo && !!!errorMyInfo && (
          <div className="mt-[20px]">
            <div className="space-y-[20px] text-sm sm:text-[1rem]">
              {!!dataMyInfo.nickname && (
                <ComponentFormUpdateUser
                  fieldType="nickname"
                  id={dataMyInfo.id}
                  userField={dataMyInfo.nickname}
                  mutate={mutateMyInfo}
                />
              )}
              <ComponentFormUpdateUser
                fieldType="password"
                id={dataMyInfo.id}
                userField={''}
                mutate={mutateMyInfo}
              />
              {!!dataMyInfo.phone && (
                <ComponentFormUpdateUser
                  fieldType="phone"
                  id={dataMyInfo.id}
                  userField={dataMyInfo.phone}
                  mutate={mutateMyInfo}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageProfile;
