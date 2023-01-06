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
  const { data: dataMyInfo, mutate: MutateMyInfo } = useSWR<IUserEdit>(
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
    <div className="w-full flex justify-center items-center">
      <div className="xl:min-w-[554px] xl:max-w-[554px] md:min-w-[472.75px] md:max-w-[472.75px] min-w-[400px] max-w-[400px] box-border rounded-[8px] border-[1px] border-[#DCDEE2] mx-auto my-[120px] py-[30px] xl:px-[98px] px-[52.27px]">
        <div className="text-[1.5rem] font-semibold">개인 정보 수정</div>
        <div className="mt-[20px]">
          {!!dataMyInfo && (
            <>
              <div className="space-y-[20px]">
                {!!dataMyInfo.nickname && (
                  <ComponentFormUpdateUser
                    fieldType="nickname"
                    id={dataMyInfo.id}
                    userField={dataMyInfo.nickname}
                    mutate={MutateMyInfo}
                  />
                )}
                <ComponentFormUpdateUser
                  fieldType="password"
                  id={dataMyInfo.id}
                  userField={''}
                  mutate={MutateMyInfo}
                />
                {!!dataMyInfo.phone && (
                  <ComponentFormUpdateUser
                    fieldType="phone"
                    id={dataMyInfo.id}
                    userField={dataMyInfo.phone}
                    mutate={MutateMyInfo}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageProfile;
