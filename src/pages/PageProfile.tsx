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
  const { data: dataGetMe } = useSWR<IInfoMe>(
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
    !!token && !!dataGetMe
      ? `${process.env.REACT_APP_BACK_URL}/user/myinfo`
      : null,
    () =>
      axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/user/myinfo`, token),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  React.useEffect(() => {
    if (!!!token || (!!token && !!dataGetMe && dataGetMe.role === 'admin')) {
      navigate('/', { replace: true });
    }
  }, [token, dataGetMe, dataGetMe?.role]);
  return (
    <div className="flex min-h-[530px] w-full items-center justify-center">
      <div className="m-auto box-border min-w-[90vw] max-w-[90vw] rounded-[8px] border-[1px] border-[#DCDEE2] py-[30px] px-[20px] sm:min-w-[70vw] sm:max-w-[70vw] sm:px-[55px] md:min-w-[472.75px] md:max-w-[472.75px] xl:min-w-[554px] xl:max-w-[554px] xl:px-[98px] ">
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
