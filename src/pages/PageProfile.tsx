import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import UpdateUserField from '../components/admin/user/UpdateUserField';
import useSWR from 'swr';
import { IInfoMe, IUserEdit } from '../interfaces';
import TokenContext from '../store/TokenContext';
import { axiosGetfetcher } from '../hooks/api';

interface IPropsPageProfile {}

const PageProfile: React.FC<IPropsPageProfile> = ({}) => {
  const navigate = useNavigate();
  const tokenCtx = React.useContext(TokenContext);
  const { token } = tokenCtx;
  const { data: dataGetMe, error: errorGetMe } = useSWR<IInfoMe>(
    !!token ? `${process.env.REACT_APP_BACK_URL}/user/me` : null,
    () => axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/user/me`, token),
    { revalidateOnFocus: false, revalidateIfStale: false },
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
    if (!!errorGetMe) {
      navigate('/', { replace: true });
    }
  }, [errorGetMe]);
  return (
    <div className="min-h-[73vh] w-full flex justify-center items-center">
      <div className="xl:min-w-[554px] xl:max-w-[554px] lg:min-w-[472.75px] lg:max-w-[472.75px] md:min-w-[354.56px] md:max-w-[354.56px] sm:min-w-[295.47px] sm:max-w-[295.47px] xs:min-w-[295.47px] xs:max-w-[295.47px] box-border rounded-[8px] border-[1px] border-[#DCDEE2] mx-auto my-[120px] py-[30px] xl:px-[98px] lg:px-[83.63px] md:px-[62.72px] sm:px-[52.27px] xs:px-[52.27px]">
        <div className="text-[24px] leading-[150%] font-semibold">
          개인 정보 수정
        </div>
        <div className="mt-[20px]">
          {!!dataMyInfo && (
            <>
              <div className="space-y-[20px]">
                {!!dataMyInfo.nickname && (
                  <UpdateUserField
                    fieldType="nickname"
                    id={dataMyInfo.id}
                    userField={dataMyInfo.nickname}
                    mutate={MutateMyInfo}
                  />
                )}
                <UpdateUserField
                  fieldType="password"
                  id={dataMyInfo.id}
                  userField={null}
                  mutate={MutateMyInfo}
                />
                {!!dataMyInfo.phone && (
                  <UpdateUserField
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
